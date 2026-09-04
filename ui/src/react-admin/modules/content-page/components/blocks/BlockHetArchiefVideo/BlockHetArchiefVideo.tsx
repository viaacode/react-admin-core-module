import type { DefaultProps } from '@viaa/avo2-components';
import { Container, Spinner } from '@viaa/avo2-components';
import clsx from 'clsx';
import { type FunctionComponent, useMemo } from 'react';
import { IeObjectFlowPlayerWrapper } from '~modules/content-page/components/IeObjectFlowPlayerWrapper/IeObjectFlowPlayerWrapper';
import { IeObjectLoadError } from '~modules/content-page/components/IeObjectLoadError/IeObjectLoadError';
import { useGetIeObjectsPlayableDisplayData } from '~modules/content-page/hooks/useGetIeObjectsPlayableDisplayData';
import { CopyrightAttribution } from '~shared/components/CopyrightAttribution';
import { snippetTimeToSeconds } from '~shared/helpers/parsers/duration';
import type { PickerItem } from '~shared/types/content-picker';

import './BlockHetArchiefVideo.scss';

export interface BlockHetArchiefVideoProps extends DefaultProps {
	/** Id of the content block, added by the content block renderer. Empty for an unsaved block. */
	blockId?: string;
	/** The AV ie-object to play, referenced by its pid / fragmentId. */
	mediaItem?: PickerItem;
	/** Start of the snippet as entered in the editor: HH:MM:SS or MM:SS. */
	startTime?: string;
	/** End of the snippet as entered in the editor: HH:MM:SS or MM:SS. */
	endTime?: string;
	poster?: string;
	title?: string;
	copyrightTitle?: string;
	copyrightIconVisible?: boolean;
	copyrightText?: string;
	width?: string;
}

/**
 * Plays a snippet of an audio/video ie-object on a content page, with an optional caption underneath.
 *
 * The snippet is purely editorial: it does not exist as an object in the MAM. Which object plays
 * and which part of it plays are both read from this block's stored config by the proxy -- the
 * block only sends its own id -- so the returned url is already cut to the snippet the editor
 * configured
 */
export const BlockHetArchiefVideo: FunctionComponent<BlockHetArchiefVideoProps> = ({
	className,
	blockId,
	mediaItem,
	startTime,
	endTime,
	poster,
	title,
	copyrightTitle,
	copyrightIconVisible = false,
	copyrightText,
	width,
}) => {
	// While this block is being put together in the editor it has no id yet, so its object goes
	// along for the proxy to resolve. Only cut when both times are given and form a real interval,
	// same rule as the editor and the proxy apply: the media service needs an end time to cut at
	// all, so a start time on its own would silently play the whole object.
	const unsavedObjects = useMemo(() => {
		const start = snippetTimeToSeconds(startTime);
		const end = snippetTimeToSeconds(endTime);
		const hasSnippet = start !== null && end !== null && end > start;

		return [
			{
				schemaIdentifier: String(mediaItem?.value || ''),
				start: hasSnippet ? start : undefined,
				end: hasSnippet ? end : undefined,
			},
		];
	}, [mediaItem?.value, startTime, endTime]);

	// A video block references exactly one object, so the response holds a single entry.
	const {
		data: ieObjects,
		isLoading,
		isFetching,
	} = useGetIeObjectsPlayableDisplayData(blockId, unsavedObjects);
	const ieObject = ieObjects?.[0];

	// A resolved-but-null entry means the object itself couldn't be loaded (it's gone, or this
	// visitor can't get at it), and a resolved object with no essence access is one this visitor
	// may not play. Both are worth showing: the block is only ever added for an AV object, so an
	// empty spot would just look like a rendering bug.
	const hasFailed =
		!!ieObjects &&
		ieObjects.length > 0 &&
		(ieObject === null || ieObject?.hasAccessToEssence === false);

	// The url can only come from the request, but the poster the editor picked is right here in the
	// block config: showing it while the object resolves keeps the block in the page flow instead of
	// having it appear out of nowhere once the url lands.
	const isLoadingObject = isLoading || isFetching || !ieObjects;

	// Nothing local to hold the spot with while the object is still loading, and nothing to play
	// once it has: the block is only ever added for an AV object, but content pages are public while
	// the object behind them still goes through the licence and visitor space checks. An object this
	// visitor may not see is the one case that does get something in the player's place.
	if (!hasFailed && (isLoadingObject ? !poster : !ieObject?.playableUrl)) {
		return null;
	}

	return (
		<Container className={clsx(className, 'c-block-het-archief-video')}>
			<div
				className={clsx('c-block-het-archief-video__player', {
					'c-block-het-archief-video__player--loading': !hasFailed && isLoadingObject,
					'c-block-het-archief-video__player--error': hasFailed,
				})}
				style={width ? { width } : undefined}
			>
				{hasFailed ? (
					// Only the player is swapped out: the block keeps its size and its caption, so the
					// object stays announced the same way it would have been with access.
					<IeObjectLoadError />
				) : isLoadingObject || !ieObject ? (
					<>
						<img
							src={poster}
							alt=""
							aria-hidden="true"
							className="c-block-het-archief-video__player-poster"
						/>
						<div className="c-block-het-archief-video__player-loading">
							<Spinner size="large" locationId={'block-het-archief-video'} />
						</div>
					</>
				) : (
					<IeObjectFlowPlayerWrapper ieObject={ieObject} poster={poster} title={title} />
				)}
			</div>
			<CopyrightAttribution
				title={copyrightTitle}
				text={copyrightText}
				showIcon={copyrightIconVisible}
				className="c-block-het-archief-video__annotation"
			/>
		</Container>
	);
};
