import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import clsx from 'clsx';
import type { CSSProperties, FunctionComponent, ReactElement } from 'react';
import React, { useRef } from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import type { TimelineNodeBlockComponentState } from '~modules/content-page/types/content-block.types';
import { Color } from '~modules/content-page/types/content-block.types';
import { FlowPlayerWrapper } from '~shared/components/FlowPlayerWrapper/FlowPlayerWrapper';
import Html from '~shared/components/Html/Html';
import { Icon } from '~shared/components/Icon/Icon';
import { SmartLink } from '~shared/components/SmartLink/SmartLink';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import type { DefaultComponentProps } from '~shared/types/components';
import { useGetTimelineIeObject } from './hooks/useGetTimelineIeObject';

import './BlockTimeline.scss';

export interface BlockTimelineProps extends DefaultComponentProps {
	elements: TimelineNodeBlockComponentState[];
}

const isValidDate = (date: string): boolean => !Number.isNaN(new Date(date).getTime());

const getYear = (date: string): number | null =>
	isValidDate(date) ? new Date(date).getFullYear() : null;

// The timeline starts and ends with the same fixed circle/rectangle/circle cluster of markers.
// Every node in between alternates circle, rectangle, circle, rectangle, ... based on its index.
const TimelineCap: FunctionComponent<{ position: 'start' | 'end' }> = ({ position }) => (
	<li className={`c-block-timeline__cap c-block-timeline__cap--${position}`} aria-hidden="true">
		<span className="c-block-timeline__cap-shape c-block-timeline__cap-shape--circle" />
		<span className="c-block-timeline__cap-shape c-block-timeline__cap-shape--rectangle" />
		<span className="c-block-timeline__cap-shape c-block-timeline__cap-shape--circle" />
	</li>
);

const BlockTimelineObject: FunctionComponent<{ pid: string; fallbackTitle: string }> = ({
	pid,
	fallbackTitle,
}) => {
	const { data: ieObject, isLoading } = useGetTimelineIeObject(pid);

	if (isLoading || !ieObject) {
		return null;
	}

	return (
		<div className="c-block-timeline__node-object">
			<div className="c-block-timeline__node-object-media">
				{ieObject.mediaType === 'video' || ieObject.mediaType === 'audio' ? (
					<FlowPlayerWrapper
						src={ieObject.src}
						poster={ieObject.thumbnailUrl}
						title={ieObject.name || fallbackTitle}
						duration={ieObject.duration}
						organisationName={ieObject.maintainerName}
						organisationLogo={ieObject.maintainerLogo}
						trackPlayEvent={true}
					/>
				) : (
					ieObject.thumbnailUrl && (
						<img
							src={ieObject.thumbnailUrl}
							alt={ieObject.name || fallbackTitle}
							className="c-block-timeline__node-object-image"
						/>
					)
				)}
			</div>
			<div className="c-block-timeline__node-object-meta">
				<p className="c-block-timeline__node-object-title">{ieObject.name || fallbackTitle}</p>
				<div className="c-block-timeline__node-object-footer">
					{ieObject.detailPageUrl && (
						<SmartLink
							action={{
								type: AvoCoreContentPickerType.EXTERNAL_LINK,
								value: ieObject.detailPageUrl,
							}}
							className="c-block-timeline__node-object-cta"
						>
							{tText(
								'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___bekijk-volledig-fragment',
								{},
								[HET_ARCHIEF]
							)}
						</SmartLink>
					)}
					{ieObject.maintainerLogo && (
						<img
							src={ieObject.maintainerLogo}
							alt={ieObject.maintainerName || ''}
							className="c-block-timeline__node-object-maintainer-logo"
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export const BlockTimeline: FunctionComponent<BlockTimelineProps> = ({
	className,
	elements = [],
}): ReactElement => {
	const containerRef = useRef<HTMLDivElement>(null);
	const locale = AdminConfigManager.getConfig().locale;

	const formatDate = (date: string): string =>
		isValidDate(date)
			? new Intl.DateTimeFormat(locale, {
					day: 'numeric',
					month: 'long',
					year: 'numeric',
				}).format(new Date(date))
			: '';

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
					const hasMedia =
						(node.visualType === 'OBJECT' && !!node.mediaItem?.value) ||
						(node.visualType === 'IMAGE' && !!node.image);

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
								{formatDate(node.date)}
							</time>
							<div
								className={clsx('c-block-timeline__node-content', {
									'c-block-timeline__node-content--has-background': !!backgroundColor,
									'c-block-timeline__node-content--has-media': hasMedia,
								})}
								style={
									backgroundColor
										? ({ '--c-block-timeline-node-bg': backgroundColor } as CSSProperties)
										: undefined
								}
							>
								{node.visualType === 'OBJECT' && node.mediaItem?.value && (
									<BlockTimelineObject
										pid={String(node.mediaItem.value)}
										fallbackTitle={node.title}
									/>
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
									{(node.imageCaptionCopyright || node.imageCaptionDescription) && (
										<div className="c-block-timeline__node-image-caption">
											{node.imageCaptionCopyright && (
												<p className="c-block-timeline__node-image-copyright">
													{node.imageCaptionCopyrightIconVisible !== false && (
														<span aria-hidden="true">&copy;&nbsp;</span>
													)}
													{node.imageCaptionCopyright}
												</p>
											)}
											{node.imageCaptionDescription && (
												<p className="c-block-timeline__node-image-description">
													{node.imageCaptionDescription}
												</p>
											)}
										</div>
									)}
									<h3 className="c-block-timeline__node-title">{node.title}</h3>
									{node.text && (
										<Html
											content={node.text}
											sanitizePreset={SanitizePreset.full}
											type="div"
											className="c-block-timeline__node-description"
										/>
									)}
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
					<Icon name="arrowUp" className="c-block-timeline__back-to-top-icon" />
				</button>
			)}
		</div>
	);
};
