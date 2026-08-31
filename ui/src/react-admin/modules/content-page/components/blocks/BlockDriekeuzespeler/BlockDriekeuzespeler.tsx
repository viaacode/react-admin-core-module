import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import type { CSSProperties, FunctionComponent, ReactElement } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminCoreIconName } from '~core/config';
import { useGetIeObjectsByIds } from '~modules/content-page/hooks/useGetIeObjectsByIds';
import { useGetPlayableDataForIeObjects } from '~modules/content-page/hooks/useGetPlayableDataForIeObjects';
import type {
	DriekeuzespelerInterestState,
	DriekeuzespelerTileColors,
} from '~modules/content-page/types/content-block.types';
import { Icon } from '~shared/components/Icon/Icon';
import type { DefaultComponentProps } from '~shared/types/components';
import { useGetThemesByIds } from '../BlockOverviewThemes/hooks/useGetThemesByIds';
import { DRIEKEUZESPELER_TILE_COUNT } from './BlockDriekeuzespeler.editorconfig';
import {
	pickNextSelection,
	pickRandomIndices,
	RECENTLY_SHOWN_LIMIT,
} from './BlockDriekeuzespeler.helpers';
import { BlockDriekeuzespelerModal } from './BlockDriekeuzespelerModal';

import './BlockDriekeuzespeler.scss';

export interface BlockDriekeuzespelerProps extends DefaultComponentProps {
	title: string;
	tileColors: DriekeuzespelerTileColors[];
	shuffleButtonLabel: string;
	interests: DriekeuzespelerInterestState[];
}

/**
 * Shows three of the configured interests, picked at random, each as a tile with the thumbnail of
 * its object and a pill carrying the interest name. The shuffle CTA replaces all three.
 *
 * https://meemoo.atlassian.net/browse/ARC-3813
 */
export const BlockDriekeuzespeler: FunctionComponent<BlockDriekeuzespelerProps> = ({
	title,
	tileColors,
	shuffleButtonLabel,
	interests,
	className,
}): ReactElement => {
	// The selection is only made after mount. Randomising during render would make the server and
	// the client disagree and break hydration, so the first paint shows the tile skeletons instead.
	const [selection, setSelection] = useState<number[] | null>(null);

	// Interests shown over the last couple of shuffles (including the initial draw), oldest first,
	// capped at RECENTLY_SHOWN_LIMIT. A ref rather than state: it is bookkeeping pickNextSelection
	// reads, not something the block renders.
	const recentlyShownRef = useRef<number[]>([]);

	useEffect(() => {
		const initial = pickRandomIndices(interests.length, DRIEKEUZESPELER_TILE_COUNT);
		recentlyShownRef.current = initial.slice(-RECENTLY_SHOWN_LIMIT);
		setSelection(initial);
	}, [interests.length]);

	const shuffle = useCallback(() => {
		const next = pickNextSelection(
			interests.length,
			DRIEKEUZESPELER_TILE_COUNT,
			selection || [],
			recentlyShownRef.current
		);
		recentlyShownRef.current = [...recentlyShownRef.current, ...next].slice(-RECENTLY_SHOWN_LIMIT);
		setSelection(next);
	}, [interests.length, selection]);

	// Index into `interests` of the tile open in the modal, or null when nothing is open. An index
	// rather than the interest itself, so it survives the renderer handing us a rebuilt array. The
	// selection is untouched while the modal is open, so closing returns to the same three tiles.
	const [openedIndex, setOpenedIndex] = useState<number | null>(null);

	// Only the three interests on screen are resolved, not all two hundred a block may hold. The pids
	// are part of the query key, so a shuffle back to a selection already seen is served from cache.
	const selectedSchemaIdentifiers = (selection || [])
		.map((index) => interests[index]?.mediaItem?.value || '')
		.filter(Boolean);

	const { data: ieObjectsById, isFetching: isFetchingObjects } =
		useGetIeObjectsByIds(selectedSchemaIdentifiers);

	// Ticketed with the selection, not when a tile is opened, so the modal plays what is already
	// there instead of going to the network at the moment the visitor clicks.
	const { data: playableDataById, isFetching: isFetchingPlayableData } =
		useGetPlayableDataForIeObjects(
			selectedSchemaIdentifiers.map((schemaIdentifier) => ieObjectsById?.[schemaIdentifier])
		);

	// Deduplicated and sorted, so a shuffle back to a selection already seen hits the same query key.
	const selectedThemeIds = Array.from(
		new Set((selection || []).map((index) => interests[index]?.theme?.value || '').filter(Boolean))
	).sort();

	const { data: themes } = useGetThemesByIds(selectedThemeIds);

	const openedInterest = openedIndex === null ? null : interests[openedIndex];

	const renderTile = (tileIndex: number): ReactElement => {
		// Not compacted: tile colors are positional, so dropping a missing interest would shift every
		// later tile onto the wrong colour.
		const interestIndex = selection?.[tileIndex];
		const interest = interestIndex === undefined ? undefined : interests[interestIndex];
		const { backgroundColor, textColor } = tileColors[tileIndex] ?? {};
		const schemaIdentifier = interest?.mediaItem?.value;
		const ieObject = schemaIdentifier ? ieObjectsById?.[schemaIdentifier] : undefined;

		return (
			<li
				// The tile colors are positional, so the index is the tile's identity: after a shuffle
				// tile 1 keeps tile 1's colors, whichever interest landed there.
				key={`c-driekeuzespeler__tile--${tileIndex}`}
				className="c-driekeuzespeler__tile"
				// Also the ground a tile shows while its thumbnail loads, or when the object no longer
				// resolves -- the block always renders three tiles.
				style={{ '--tile-color': backgroundColor } as CSSProperties}
			>
				{!!ieObject?.thumbnailUrl && (
					<img
						className="c-driekeuzespeler__thumbnail"
						src={ieObject.thumbnailUrl}
						alt=""
						loading="lazy"
					/>
				)}
				{interestIndex !== undefined && !!interest && (
					// The whole tile is the control that opens the modal, so it is a real button: Enter and
					// Space work for free. The thumbnail is decorative, so the interest name names the button.
					<button
						type="button"
						className="c-driekeuzespeler__tile-button"
						onClick={() => setOpenedIndex(interestIndex)}
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
				    the "achtergrondkleur met masker" of the FA. Decorative, so the artwork lives in the
				    stylesheet. Each shape carries its own rotation and a background layer cannot be
				    rotated on its own, so the three mobile shapes need three boxes: the layer itself and
				    its two pseudo elements draw two of them, this span the third. */}
				<div className="c-driekeuzespeler__shapes" aria-hidden="true">
					<span className="c-driekeuzespeler__shape" />
				</div>

				<ul className="c-driekeuzespeler__tiles">
					{Array.from({ length: DRIEKEUZESPELER_TILE_COUNT }, (_unused, tileIndex) =>
						renderTile(tileIndex)
					)}
				</ul>
			</div>

			{/* With exactly three interests every shuffle would draw the same three, so the CTA only
			    appears once there is something else to draw. */}
			{interests.length > DRIEKEUZESPELER_TILE_COUNT && (
				<Button
					className="c-driekeuzespeler__shuffle"
					// No `block` variant: that one stretches the button to the full width of the block.
					variants={['black']}
					// iconStart, not icon: `icon` is the library's icon-only button, which drops the label.
					// The FA fixes this icon anyway -- only the label is configurable.
					iconStart={<Icon name={AdminCoreIconName.CollectionShuffle} />}
					label={shuffleButtonLabel}
					onClick={shuffle}
				/>
			)}

			<BlockDriekeuzespelerModal
				interest={openedInterest}
				ieObject={
					openedInterest?.mediaItem?.value
						? ieObjectsById?.[openedInterest.mediaItem.value]
						: undefined
				}
				theme={themes?.find((theme) => theme.id === openedInterest?.theme?.value)}
				playableData={
					openedInterest?.mediaItem?.value
						? playableDataById?.[openedInterest.mediaItem.value]
						: undefined
				}
				isFetching={isFetchingObjects || isFetchingPlayableData}
				onClose={() => setOpenedIndex(null)}
			/>
		</div>
	);
};
