import type { DefaultProps } from '@viaa/avo2-components';
import { Container } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import { AudioOrVideoPlayerWrapper } from '~shared/components/AudioOrVideoPlayerWrapper';
import { CopyrightAttribution } from '~shared/components/CopyrightAttribution';
import { snippetTimeToSeconds } from '~shared/helpers/parsers/duration';
import type { PickerItem } from '~shared/types/content-picker';

import './BlockHetArchiefVideo.scss';

export interface BlockHetArchiefVideoProps extends DefaultProps {
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
 * Plays a snippet of an AV ie-object on a content page, with an optional caption underneath.
 *
 * The snippet is purely editorial: it does not exist as an object in the MAM. The start and end
 * time are handed to the player, which passes them on to the player-ticket endpoint so the media
 * service delivers only that part.
 *
 * https://meemoo.atlassian.net/browse/ARC-3832
 */
export const BlockHetArchiefVideo: FunctionComponent<BlockHetArchiefVideoProps> = ({
	className,
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
	const schemaIdentifier = mediaItem?.value;

	if (!schemaIdentifier) {
		return null;
	}

	// Only cut when both times are given: the media service needs an end time to cut at all, and
	// the editor enforces the pair. An invalid value yields null and is treated as "not set".
	const startSeconds = snippetTimeToSeconds(startTime);
	const endSeconds = snippetTimeToSeconds(endTime);
	const hasSnippet = startSeconds !== null && endSeconds !== null && endSeconds > startSeconds;

	return (
		<Container className={clsx(className, 'c-block-het-archief-video')}>
			<div className="c-block-het-archief-video__player" style={width ? { width } : undefined}>
				<AudioOrVideoPlayerWrapper
					schemaIdentifier={schemaIdentifier}
					startTime={hasSnippet ? startSeconds : undefined}
					endTime={hasSnippet ? endSeconds : undefined}
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
