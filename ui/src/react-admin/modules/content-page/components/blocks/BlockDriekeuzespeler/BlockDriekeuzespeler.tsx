import clsx from 'clsx';
import type { CSSProperties, FunctionComponent, ReactElement } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminCoreIconName } from '~core/config';
import type { Color } from '~modules/content-page/types/content-block.types';
import { Icon } from '~shared/components/Icon/Icon';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import type { DefaultComponentProps } from '~shared/types/components';
import { DRIEKEUZESPELER_TILE_COUNT } from './BlockDriekeuzespeler.editorconfig';
import {
	pickNextSelection,
	pickRandomIndices,
	RECENTLY_SHOWN_LIMIT,
} from './BlockDriekeuzespeler.helpers';
import { BlockDriekeuzespelerModal } from './BlockDriekeuzespelerModal';
import { useGetDriekeuzespelerPlayableObjects } from './hooks/useGetDriekeuzespelerPlayableObjects';

import './BlockDriekeuzespeler.scss';

interface DriekeuzespelerInterest {
	name: string;
	/** The object picker's value: `value` is the pid. Absent while the admin has picked nothing. */
	mediaItem?: { value?: string };
	/** The theme picker's value: `value` is the theme id. Absent while the admin has picked nothing. */
	theme?: { value?: string };
}

export interface BlockDriekeuzespelerProps extends DefaultComponentProps {
	/** Id of the content block, added by the content block renderer. Empty for an unsaved block. */
	blockId?: string;
	title: string;
	/** Exactly three entries, one per tile position. */
	tileColors: { backgroundColor: Color; textColor: Color }[];
	shuffleButtonLabel: string;
	interests: DriekeuzespelerInterest[];
}

/**
 * Shows three of the configured interests, picked at random, each as a tile with the thumbnail of
 * its object and a pill carrying the interest name. The shuffle CTA replaces all three.
 *
 * https://meemoo.atlassian.net/wiki/spaces/HA2/pages/6218383419
 */
export const BlockDriekeuzespeler: FunctionComponent<BlockDriekeuzespelerProps> = ({
	blockId,
	title,
	tileColors,
	shuffleButtonLabel,
	interests,
	className,
}): ReactElement => {
	// Fixed at three, not derived from the colour lists: the stylesheet places the tiles by
	// nth-child(1..3), so a fourth tile would render with no position at all. A saved block whose
	// colour lists are the wrong length keeps three tiles and falls back per tile below.
	const tileCount = DRIEKEUZESPELER_TILE_COUNT;

	// The selection is only made after mount. Randomising during render would make the server and
	// the client disagree and break hydration, so the first paint shows the tile skeletons instead.
	const [selection, setSelection] = useState<number[] | null>(null);

	// Interests shown over the last couple of shuffles (including the initial draw), oldest first,
	// capped at RECENTLY_SHOWN_LIMIT. A ref rather than state: it is bookkeeping pickNextSelection
	// reads, not something the block renders, so updating it should not itself trigger a render.
	const recentlyShownRef = useRef<number[]>([]);

	useEffect(() => {
		const initial = pickRandomIndices(interests.length, tileCount);
		recentlyShownRef.current = initial.slice(-RECENTLY_SHOWN_LIMIT);
		setSelection(initial);
	}, [interests.length, tileCount]);

	const shuffle = useCallback(() => {
		const next = pickNextSelection(
			interests.length,
			tileCount,
			selection || [],
			recentlyShownRef.current
		);
		recentlyShownRef.current = [...recentlyShownRef.current, ...next].slice(-RECENTLY_SHOWN_LIMIT);
		setSelection(next);
	}, [interests.length, tileCount, selection]);

	// The interest whose tile is open in the modal, or null when nothing is open. The selection is
	// untouched while the modal is open, so closing returns to the same three tiles.
	const [openedInterest, setOpenedInterest] = useState<DriekeuzespelerInterest | null>(null);

	// Not compacted: tile colors are positional, so dropping a missing interest would shift every
	// later tile onto the wrong colour. renderTile handles an empty slot.
	const selectedInterests = (selection || []).map((index) => interests[index]);
	const selectedSchemaIdentifiers = selectedInterests
		.filter(Boolean)
		.map((interest) => interest.mediaItem?.value || '')
		.filter(Boolean);

	// Resolved proactively for the whole selection as soon as it is picked, so opening a tile in the
	// modal reads from data that is already there instead of triggering its own request.
	const { data: objectsById, isFetching: isFetchingObjects } = useGetDriekeuzespelerPlayableObjects(
		blockId,
		selectedSchemaIdentifiers,
		// A block being edited has no id yet, so the objects travel with the request. The proxy
		// honours this path for content page editors only.
		!blockId
			? selectedSchemaIdentifiers.map((schemaIdentifier) => ({ schemaIdentifier }))
			: undefined
	);

	const renderTile = (tileIndex: number): ReactElement => {
		const interest = selectedInterests[tileIndex];
		// The colours are positional and fixed at three, so they index by tile.
		const { backgroundColor, textColor } = tileColors[tileIndex] ?? {};
		const schemaIdentifier = interest?.mediaItem?.value;
		const ieObject = schemaIdentifier ? objectsById?.[schemaIdentifier] : undefined;

		return (
			<li
				// The tile colors are positional, so the index is the tile's identity: after a shuffle
				// tile 1 keeps tile 1's colors, whichever interest landed there.
				key={`c-driekeuzespeler__tile--${tileIndex}`}
				className="c-driekeuzespeler__tile"
			>
				{/* A thumbnail that has not arrived yet, or an object that no longer resolves, leaves the
				    tile in its placeholder state rather than removing it: the block always shows three. */}
				{!!ieObject?.thumbnailUrl && (
					<img
						className="c-driekeuzespeler__thumbnail"
						src={ieObject.thumbnailUrl}
						alt=""
						loading="lazy"
					/>
				)}
				{!!interest && (
					// The whole tile is the control that opens the modal, so it is a real button: Enter and
					// Space work for free, and the tile's :focus-within styling finally has something to
					// react to. The thumbnail is decorative, so the interest name names the button.
					<button
						type="button"
						className="c-driekeuzespeler__tile-button"
						onClick={() => setOpenedInterest(interest)}
					>
						<span
							className="c-driekeuzespeler__pill"
							style={{ backgroundColor, color: textColor } as CSSProperties}
						>
							{interest.name}
						</span>
					</button>
				)}
			</li>
		);
	};

	return (
		<div className={clsx('c-driekeuzespeler', className)}>
			{!!title && <h1 className="c-driekeuzespeler__title">{title}</h1>}

			<div className="c-driekeuzespeler__stage">
				{/* The white blobs the design lays on the block's background colour, behind the tiles --
				    the "achtergrondkleur met masker" of the FA. Purely decorative, so it is hidden from
				    assistive technology and the artwork lives in the stylesheet. */}
				<div className="c-driekeuzespeler__shapes" aria-hidden="true">
					<span className="c-driekeuzespeler__shape c-driekeuzespeler__shape--desktop" />
					<span className="c-driekeuzespeler__shape c-driekeuzespeler__shape--mobile-top" />
					<span className="c-driekeuzespeler__shape c-driekeuzespeler__shape--mobile-middle" />
					<span className="c-driekeuzespeler__shape c-driekeuzespeler__shape--mobile-bottom" />
				</div>

				<ul className="c-driekeuzespeler__tiles">
					{Array.from({ length: tileCount }, (_unused, tileIndex) => renderTile(tileIndex))}
				</ul>
			</div>

			{/* Shown as soon as there is anything to shuffle. Even with exactly three interests the CTA
			    still does something: the selection is ordered, so a shuffle moves the interests between
			    tile positions, and each position carries its own colours and thumbnail. */}
			{interests.length > 0 && (
				<button type="button" className="c-driekeuzespeler__shuffle" onClick={shuffle}>
					{/* The FA fixes this icon: only the label is configurable. */}
					<Icon
						name={AdminCoreIconName.CollectionShuffle}
						className="c-driekeuzespeler__shuffle-icon"
					/>
					{shuffleButtonLabel ||
						tText(
							'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___toon-me-iets-anders',
							undefined,
							[HET_ARCHIEF]
						)}
				</button>
			)}

			<BlockDriekeuzespelerModal
				interest={openedInterest}
				ieObject={
					openedInterest?.mediaItem?.value
						? objectsById?.[openedInterest.mediaItem.value]
						: undefined
				}
				isFetching={isFetchingObjects}
				onClose={() => setOpenedInterest(null)}
			/>
		</div>
	);
};
