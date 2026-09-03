import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import type { CSSProperties, FunctionComponent, ReactElement } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminCoreIconName } from '~core/config';
import { ImageOrAudioWaveForm } from '~modules/content-page/components/ImageOrAudioWaveForm/ImageOrAudioWaveForm.tsx';
import { useGetIeObjectsByIds } from '~modules/content-page/hooks/useGetIeObjectsByIds';
import { useGetPlayableFileForIeObjects } from '~modules/content-page/hooks/useGetPlayableFileForIeObjects';
import type {
	DriekeuzespelerInterestState,
	DriekeuzespelerTileColors,
} from '~modules/content-page/types/content-block.types';
import { Icon } from '~shared/components/Icon/Icon';
import { mapDcTermsFormatToSimpleType } from '~shared/helpers/map-format-to-type.ts';
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
 * Shows three of the configured interests, picked at random. The shuffle CTA replaces all three.
 */
export const BlockDriekeuzespeler: FunctionComponent<BlockDriekeuzespelerProps> = ({
	title,
	tileColors,
	shuffleButtonLabel,
	interests,
	className,
}): ReactElement => {
	// Selected after mount: randomising during render would break hydration, so the first paint shows
	// the tile skeletons instead.
	const [selection, setSelection] = useState<number[] | null>(null);

	// A ref rather than state: bookkeeping pickNextSelection reads, not something the block renders.
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

	// An index rather than the interest itself, so it survives the renderer handing us a rebuilt array.
	const [openedIndex, setOpenedIndex] = useState<number | null>(null);

	// Only the three on screen are resolved, not all two hundred a block may hold. The pids are part
	// of the query key, so a shuffle back to a selection already seen is served from cache.
	const selectedSchemaIdentifiers = (selection || [])
		.map((index) => interests[index]?.mediaItem?.value || '')
		.filter(Boolean);

	const { data: ieObjectsById, isFetching: isFetchingObjects } =
		useGetIeObjectsByIds(selectedSchemaIdentifiers);

	// Ticketed with the selection, so the modal plays what is already there.
	const { data: playableFileById, isFetching: isFetchingPlayableFile } =
		useGetPlayableFileForIeObjects(
			selectedSchemaIdentifiers.map((schemaIdentifier) => ieObjectsById?.[schemaIdentifier])
		);

	// Deduplicated and sorted, so a shuffle back to a selection already seen hits the same query key.
	const selectedThemeIds = Array.from(
		new Set((selection || []).map((index) => interests[index]?.theme?.value || '').filter(Boolean))
	).sort();

	const { data: themes } = useGetThemesByIds(selectedThemeIds);

	const openedInterest = openedIndex === null ? null : interests[openedIndex];

	const renderTile = (tileIndex: number): ReactElement => {
		// Not compacted: colours are positional, so dropping a missing interest shifts every later tile
		// onto the wrong colour.
		const interestIndex = selection?.[tileIndex];
		// Index and interest travel together, so the render below needs one check rather than one per
		// half: opening the modal needs the index, naming the button needs the interest.
		const selected =
			interestIndex === undefined
				? undefined
				: { index: interestIndex, interest: interests[interestIndex] };
		const { backgroundColor, textColor } = tileColors[tileIndex] ?? {};
		const schemaIdentifier = selected?.interest?.mediaItem?.value;
		const ieObject = schemaIdentifier ? ieObjectsById?.[schemaIdentifier] : undefined;
		const simpleType = mapDcTermsFormatToSimpleType(ieObject?.dctermsFormat);

		return (
			<li
				// The index is the tile's identity: after a shuffle tile 1 keeps tile 1's colours.
				key={`c-driekeuzespeler__tile--${tileIndex}`}
				className="c-driekeuzespeler__tile"
				// Also the ground a tile shows while its thumbnail loads, or when the object stops resolving.
				style={{ '--tile-color': backgroundColor } as CSSProperties}
			>
				{!!ieObject?.thumbnailUrl && (
					<ImageOrAudioWaveForm
						imageSrc={ieObject.thumbnailUrl}
						imageAlt={ieObject.name}
						backgroundColor={backgroundColor}
						className={clsx(
							'c-driekeuzespeler__thumbnail',
							`c-driekeuzespeler__thumbnail--${simpleType}`
						)}
					/>
				)}
				{!!selected?.interest && (
					// A real button, so Enter and Space work for free. The thumbnail is decorative, so the
					// interest name is what names the control.
					<button
						type="button"
						className="c-driekeuzespeler__tile-button"
						onClick={() => setOpenedIndex(selected.index)}
					>
						<span
							className="c-driekeuzespeler__pill"
							style={{ backgroundColor, color: textColor } as CSSProperties}
						>
							{selected.interest.name}
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
				{/* Each shape carries its own rotation and a background layer cannot be rotated on its own, so
				    the three mobile shapes need three boxes: this layer, its two pseudo elements draw two of
				    them, and this span the third. */}
				<div className="c-driekeuzespeler__shapes" aria-hidden="true">
					<span className="c-driekeuzespeler__shape" />
				</div>

				<ul className="c-driekeuzespeler__tiles">
					{Array.from({ length: DRIEKEUZESPELER_TILE_COUNT }, (_unused, tileIndex) =>
						renderTile(tileIndex)
					)}
				</ul>
			</div>

			{/* With exactly three interests every shuffle draws the same three, so the CTA only appears
			    once there is something else to draw. */}
			{interests.length > DRIEKEUZESPELER_TILE_COUNT && (
				<Button
					className="c-driekeuzespeler__shuffle"
					// No `block` variant: that one stretches the button to the full width of the block.
					variants={['black']}
					// iconStart, not icon: `icon` is the library's icon-only button, which drops the label.
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
				playableFile={
					openedInterest?.mediaItem?.value
						? playableFileById?.[openedInterest.mediaItem.value]
						: undefined
				}
				isFetching={isFetchingObjects || isFetchingPlayableFile}
				onClose={() => setOpenedIndex(null)}
			/>
		</div>
	);
};
