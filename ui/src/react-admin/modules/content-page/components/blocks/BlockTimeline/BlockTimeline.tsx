import clsx from 'clsx';
import { compact, uniq } from 'es-toolkit/compat';
import type { CSSProperties, FunctionComponent, ReactElement } from 'react';
import React, { useMemo, useRef } from 'react';
import { AdminCoreIconName } from '~core/config';
import { AdminConfigManager } from '~core/config/config.class';
import { IeObjectFlowPlayerWrapper } from '~modules/content-page/components/IeObjectFlowPlayerWrapper/IeObjectFlowPlayerWrapper.tsx';
import { IeObjectMetadata } from '~modules/content-page/components/IeObjectMetadata/IeObjectMetadata.tsx';
import { useGetIeObjectsPlayableDisplayData } from '~modules/content-page/hooks/useGetIeObjectsPlayableDisplayData.ts';
import type { TimelineNodeBlockComponentState } from '~modules/content-page/types/content-block.types';
import { Color } from '~modules/content-page/types/content-block.types';
import { CopyrightAttribution } from '~shared/components/CopyrightAttribution';
import Html from '~shared/components/Html/Html';
import { Icon } from '~shared/components/Icon/Icon';
import { formatDateToDayMonthNameYear, getYear } from '~shared/helpers/formatters/date';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';
import { tText } from '~shared/helpers/translation-functions';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { HET_ARCHIEF } from '~shared/types';
import type { DefaultComponentProps } from '~shared/types/components';
import './BlockTimeline.scss';
import { isAudioVideoFormat } from '~shared/helpers/is-audio-video-format.ts';

export interface BlockTimelineProps extends DefaultComponentProps {
	elements: TimelineNodeBlockComponentState[];
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
	elements = [],
}): ReactElement => {
	const containerRef = useRef<HTMLDivElement>(null);
	const locale = AdminConfigManager.getConfig().locale;

	// Resolve all objects of the timeline in a single request
	const pids = useMemo(
		() =>
			uniq(
				compact(
					elements.map((node) => ({
						schemaIdentifier:
							node.visualType === 'OBJECT' && node.mediaItem?.value
								? String(node.mediaItem.value)
								: null,
					})) as PlayableDisplayIeObject[]
				)
			),
		[elements]
	);
	const { data: ieObjects } = useGetIeObjectsPlayableDisplayData(pids);

	console.log('ieObjects', ieObjects);

	const scrollToTop = () => {
		containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	return (
		<div className={clsx('c-block-timeline', className)} ref={containerRef}>
			<ol className="c-block-timeline__list">
				<TimelineCap position="start" />
				{elements.map((node, index) => {
					const showYear = index === 0 || getYear(node.date) !== getYear(elements[index - 1].date);
					const backgroundColor =
						node.backgroundColor && node.backgroundColor !== Color.Transparent
							? node.backgroundColor
							: undefined;
					const markerShape = index % 2 === 0 ? 'circle' : 'rectangle';
					const hasImage = node.visualType === 'IMAGE' && !!node.image;
					const hasObject = node.visualType === 'OBJECT' && !!node.mediaItem?.value;
					const ieObject = hasObject ? ieObjects?.[index] : undefined;
					const thumbnail = ieObject?.newspaperImage || ieObject?.thumbnailUrl;

					return (
						<li
							className="c-block-timeline__node"
							key={`c-block-timeline__node--${node.date}-${node.title}-${index}`}
						>
							{showYear && (
								<span className="c-block-timeline__node-year">{getYear(node.date)}</span>
							)}
							<time className="c-block-timeline__node-date" dateTime={node.date}>
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
								})}
								style={
									backgroundColor
										? ({ '--c-block-timeline-node-bg': backgroundColor } as CSSProperties)
										: undefined
								}
							>
								{ieObject && (
									<div className={clsx('c-ie-object-media')}>
										{isAudioVideoFormat(ieObject.dctermsFormat) ? (
											<IeObjectFlowPlayerWrapper
												className="c-block-timeline__node-object-media"
												ieObject={ieObject}
												poster={node.image}
											/>
										) : (
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
									<h3 className="c-block-timeline__node-title">{node.title}</h3>
									{node.text && (
										<Html
											content={node.text}
											sanitizePreset={SanitizePreset.full}
											type="div"
											className="c-block-timeline__node-description"
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
			{elements.length > 0 && (
				<button type="button" className="c-block-timeline__back-to-top" onClick={scrollToTop}>
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
