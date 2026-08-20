import type { DefaultProps } from '@viaa/avo2-components';
import { Container } from '@viaa/avo2-components';
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
	autoplay?: boolean;
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
	autoplay,
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
	const { data: ieObjects } = useGetIeObjectsPlayableDisplayData(blockId, unsavedObjects);
	const ieObject = ieObjects?.[0];

	// A resolved-but-null entry means the object itself couldn't be loaded (it's gone, or this
	// visitor can't get at it). That's worth showing: the block is only ever added for an AV
	// object, so an empty spot would just look like a rendering bug.
	const hasFailed = !!ieObjects && ieObjects.length > 0 && ieObjects[0] === null;

	if (hasFailed) {
		return (
			<Container className={clsx(className, 'c-block-het-archief-video')}>
				<div className="c-block-het-archief-video__player" style={width ? { width } : undefined}>
					<IeObjectLoadError />
				</div>
			</Container>
		);
	}

	// Nothing to show while the object is still loading, or when it can't be played at all: the
	// block is only ever added for an AV object, but content pages are public while the object
	// behind them still goes through the licence and visitor space checks.
	if (!ieObject?.playableUrl) {
		return null;
	}

	return (
		<Container className={clsx(className, 'c-block-het-archief-video')}>
			<div className="c-block-het-archief-video__player" style={width ? { width } : undefined}>
				<IeObjectFlowPlayerWrapper
					ieObject={ieObject}
					poster={poster}
					title={title}
					autoplay={autoplay}
				/>
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
