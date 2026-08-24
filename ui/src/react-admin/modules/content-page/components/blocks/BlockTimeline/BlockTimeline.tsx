import { Spinner } from '@viaa/avo2-components';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import clsx from 'clsx';
import type { CSSProperties, FunctionComponent, ReactElement } from 'react';
import React, { useMemo, useRef } from 'react';
import { AdminCoreIconName } from '~core/config';
import { AdminConfigManager } from '~core/config/config.class';
import { IeObjectFlowPlayerWrapper } from '~modules/content-page/components/IeObjectFlowPlayerWrapper/IeObjectFlowPlayerWrapper.tsx';
import { IeObjectLoadError } from '~modules/content-page/components/IeObjectLoadError/IeObjectLoadError.tsx';
import { IeObjectMetadata } from '~modules/content-page/components/IeObjectMetadata/IeObjectMetadata.tsx';
import { getBackgroundTextColorVariables } from '~modules/content-page/const/background-text-colors';
import { useGetIeObjectsPlayableDisplayData } from '~modules/content-page/hooks/useGetIeObjectsPlayableDisplayData.ts';
import type { TimelineNodeBlockComponentState } from '~modules/content-page/types/content-block.types';
import { Color } from '~modules/content-page/types/content-block.types';
import { CopyrightAttribution } from '~shared/components/CopyrightAttribution';
import Html from '~shared/components/Html/Html';
import { Icon } from '~shared/components/Icon/Icon';
import { formatDateToDayMonthNameYear, getYear } from '~shared/helpers/formatters/date';
import { isAudioVideoFormat } from '~shared/helpers/is-audio-video-format.ts';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import type { DefaultComponentProps } from '~shared/types/components';
import './BlockTimeline.scss';

export interface BlockTimelineProps extends DefaultComponentProps {
	/** Id of the content block, added by the content block renderer. Empty for an unsaved block. */
	blockId?: string;
	elements: TimelineNodeBlockComponentState[];
	/** Chronological order of the nodes. Descending (most recent first) when unset. */
	sortOrder?: AvoSearchOrderDirection;
}

// The timeline starts and ends with the same fixed circle/rectangle/circle cluster of markers.
// Every node in between alternates circle, rectangle, circle, rectangle, ... based on its index.
const TimelineCap: FunctionComponent<{ position: 'start' | 'end' }> = ({ position }) => (
	<li className={`c-block-timeline__cap c-block-timeline__cap--${position}`} aria-hidden="true">
		<span className="c-block-timeline__cap-shape c-block-timeline__cap-shape--circle" />
		<span className="c-block-timeline__cap-shape c-block-timeline__cap-shape--rectangle" />
		<span className="c-block-timeline__cap-shape c-block-timeline__cap-shape--circle" />
	</li>
);

export const BlockTimeline: FunctionComponent<BlockTimelineProps> = ({
	className,
	blockId,
	elements = [],
	sortOrder = AvoSearchOrderDirection.DESC,
}): ReactElement => {
	const containerRef = useRef<HTMLDivElement>(null);
	const locale = AdminConfigManager.getConfig().locale;

	// The nodes are shown in chronological order, regardless of the order they were configured in.
	// Nodes without a usable date keep their configured order at the end of the timeline.
	// The position a node was configured at travels along with it: the playable display data below
	// comes back in the block's own element order, so that -- and not the position on screen -- is
	// what tells which entry of the response belongs to which node.
	const sortedElements = useMemo(() => {
		const direction = sortOrder === AvoSearchOrderDirection.ASC ? 1 : -1;
		return elements
			.map((node, elementIndex) => ({ node, elementIndex }))
			.sort((left, right) => {
				const leftTime = new Date(left.node.date).getTime();
				const rightTime = new Date(right.node.date).getTime();
				if (Number.isNaN(leftTime) || Number.isNaN(rightTime)) {
					return Number.isNaN(leftTime) ? (Number.isNaN(rightTime) ? 0 : 1) : -1;
				}
				return (leftTime - rightTime) * direction;
			});
	}, [elements, sortOrder]);

	// While this block is being put together in the editor, it has no id yet, so its nodes go along
	// for the proxy to resolve. One entry per node, in the block's own element order -- the same
	// order the proxy reads them in from a saved config -- so the response is indexed the same way
	// either way it was fetched. Only cut when both times are given and form a real interval, same
	// rule as the editor and the proxy apply: the media service needs an end time to cut at all, so
	// a start time on its own would silently play the whole object.
	const unsavedObjects = useMemo(
		() =>
			elements.map((node) => {
				const start = snippetTimeToSeconds(node.startTime);
				const end = snippetTimeToSeconds(node.endTime);
				const hasSnippet = start !== null && end !== null && end > start;

				return {
					schemaIdentifier: node.visualType === 'OBJECT' ? String(node.mediaItem?.value || '') : '',
					start: hasSnippet ? start : undefined,
					end: hasSnippet ? end : undefined,
				};
			}),
		[elements]
	);

	// Resolve all objects of the timeline in a single request. Which objects those are is read
	// from this block's stored config by the proxy, so only the block id goes out once it has been
	// saved; the response comes back in the order the nodes were configured in -- not the
	// chronological order they are shown in -- one (possibly null) entry per node.
	const { data: ieObjects } = useGetIeObjectsPlayableDisplayData(blockId, unsavedObjects);

	const scrollToTop = () => {
		containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	return (
		<div className={clsx('c-block-timeline', className)} ref={containerRef}>
			<ol className="c-block-timeline__list">
				<TimelineCap position="start" />
				{sortedElements.map(({ node, elementIndex }, index) => {
					const showYear =
						index === 0 || getYear(node.date) !== getYear(sortedElements[index - 1].node.date);
					const backgroundColor =
						node.backgroundColor && node.backgroundColor !== Color.Transparent
							? node.backgroundColor
							: undefined;
					// The node's title and text sit on its own colour band, so they take the design
					// text colors for that band's color instead of the block's own background.
					// https://meemoo.atlassian.net/browse/ARC-3848
					const nodeTextColorVariables = backgroundColor
						? getBackgroundTextColorVariables(backgroundColor)
						: {};
					const hasNodeTextColors = Object.keys(nodeTextColorVariables).length > 0;
					const markerShape = index % 2 === 0 ? 'circle' : 'rectangle';
					const hasImage = node.visualType === 'IMAGE' && !!node.image;
					const hasObject = node.visualType === 'OBJECT' && !!node.mediaItem?.value;
					const ieObject = hasObject ? ieObjects?.[elementIndex] : undefined;
					const thumbnail = ieObject?.newspaperImage || ieObject?.thumbnailUrl;
					// A resolved-but-null entry means this node's object couldn't be loaded (it's
					// gone, or out of reach for this visitor); the node keeps its place in the
					// timeline and shows an error tile where the media would have been.
					const hasFailedObject =
						hasObject &&
						!!ieObjects &&
						elementIndex < ieObjects.length &&
						ieObjects[elementIndex] === null;
					// Until its object has been resolved the node shows what its own config knows --
					// the poster image, if it has one -- so the timeline is laid out at its final
					// size straight away instead of reflowing as the objects come in.
					const isLoadingObject = hasObject && !ieObject && !hasFailedObject;

					return (
						<li
							className="c-block-timeline__node"
							key={`c-block-timeline__node--${node.date}-${node.title}-${index}`}
						>
							{showYear && (
								<span className="c-block-timeline__node-year">{getYear(node.date)}</span>
							)}
							{/* The date sits on the block background, outside the node's own colour band, so it
							    takes the neutral text role. https://meemoo.atlassian.net/browse/ARC-3848 */}
							<time
								className="c-block-timeline__node-date u-background-text-secondary"
								dateTime={node.date}
							>
								<span
									className={clsx(
										'c-block-timeline__node-marker',
										`c-block-timeline__node-marker--${markerShape}`
									)}
									aria-hidden="true"
								/>
								{formatDateToDayMonthNameYear(node.date, locale)}
							</time>
							<div
								className={clsx('c-block-timeline__node-content', {
									'c-block-timeline__node-content--has-background': !!backgroundColor,
									'c-block-timeline__node-content--has-image': hasImage,
									'c-block-timeline__node-content--has-object': hasObject,
									'u-background-text-colors': hasNodeTextColors,
								})}
								style={
									backgroundColor
										? ({
												'--c-block-timeline-node-bg': backgroundColor,
												...nodeTextColorVariables,
											} as CSSProperties)
										: undefined
								}
							>
								{hasFailedObject && (
									<div className={clsx('c-ie-object-media')}>
										<IeObjectLoadError className="c-block-timeline__node-object-error" />
									</div>
								)}
								{isLoadingObject && (
									<div className={clsx('c-ie-object-media')}>
										<div
											className={clsx(
												'c-block-timeline__node-image-wrapper',
												'c-block-timeline__node-image-wrapper--loading'
											)}
										>
											{node.image && (
												<img
													src={node.image}
													alt=""
													aria-hidden="true"
													className="c-block-timeline__node-object-image"
												/>
											)}
											<div className="c-block-timeline__node-object-loading">
												<Spinner size="large" locationId={'timeline-node-object'} />
											</div>
										</div>
									</div>
								)}
								{ieObject && (
									<div className={clsx('c-ie-object-media')}>
										{isAudioVideoFormat(ieObject.dctermsFormat) ? (
											<IeObjectFlowPlayerWrapper
												className="c-block-timeline__node-object-media"
												ieObject={ieObject}
												poster={node.image}
											/>
										) : (
											// Newspapers
											thumbnail && (
												<div className="c-block-timeline__node-image-wrapper">
													<img
														src={thumbnail}
														alt={ieObject.name || node.title}
														className="c-block-timeline__node-object-image"
													/>
												</div>
											)
										)}
									</div>
								)}
								{node.visualType === 'IMAGE' && node.image && (
									<div className="c-block-timeline__node-image-wrapper">
										<img
											src={node.image}
											alt={node.imageAlt || node.title}
											className="c-block-timeline__node-image"
										/>
									</div>
								)}
								<div className="c-block-timeline__node-text">
									<CopyrightAttribution
										title={node.copyrightTitle}
										text={node.copyrightText}
										showIcon={node.copyrightIconVisible}
										className="c-block-timeline__node-image-caption"
									/>
									<h3 className="c-block-timeline__node-title u-background-text-primary">
										{node.title}
									</h3>
									{node.text && (
										<Html
											content={node.text}
											sanitizePreset={SanitizePreset.full}
											type="div"
											className="c-block-timeline__node-description u-background-text-primary u-background-text-links"
										/>
									)}
									{ieObject && <IeObjectMetadata ieObject={ieObject} fallbackTitle={node.title} />}
								</div>
							</div>
						</li>
					);
				})}
				<TimelineCap position="end" />
			</ol>
			{sortedElements.length > 0 && (
				<button
					type="button"
					// "Terug naar boven" is secondary text, so it follows the design's secondary color for
					// the block background instead of a fixed grey.
					// https://meemoo.atlassian.net/browse/ARC-3848
					className="c-block-timeline__back-to-top u-background-text-secondary"
					onClick={scrollToTop}
				>
					{tText(
						'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___terug-naar-boven',
						{},
						[HET_ARCHIEF]
					)}
					<Icon name={AdminCoreIconName.ArrowUp} className="c-block-timeline__back-to-top-icon" />
				</button>
			)}
		</div>
	);
};
