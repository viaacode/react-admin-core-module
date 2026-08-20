import React, { type CSSProperties, type FunctionComponent, type ReactNode, useMemo } from 'react';
import { Color } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockHeroCarousel.scss';
import 'swiper/css';
import clsx from 'clsx';
import type {
	HeroCarouselBlockComponentState,
	HeroCarouselSlideItem,
} from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { BlockHeroCarouselCarousel } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselCarousel.tsx';
import { BlockHeroCarouselSearch } from '~content-blocks/BlockHeroCarousel/BlockHeroCarouselSearch.tsx';
import { getRandomTertiaryBackgroundColor } from '~modules/content-page/helpers/get-random-tertiary-background-color.ts';
import { useGetIeObjectsPlayableDisplayData } from '~modules/content-page/hooks/useGetIeObjectsPlayableDisplayData.ts';
import { isAudioVideoFormat } from '~shared/helpers/is-audio-video-format.ts';
import type { IeObjectType } from '~shared/helpers/map-format-to-type.ts';
import { toSeconds } from '~shared/helpers/parsers/duration.ts';

export interface BlockHeroCarouselProps extends DefaultComponentProps {
	/** Id of the content block, added by the content block renderer. Empty for an unsaved block. */
	blockId?: string;
	backgroundImage?: string;
	title: string;
	searchAriaLabel: string;
	subtitles: { label: string }[];
	elements: HeroCarouselBlockComponentState[];
}

export const BlockHeroCarousel: FunctionComponent<BlockHeroCarouselProps> = ({
	className,
	blockId,
	backgroundImage,
	title,
	subtitles,
	searchAriaLabel,
	elements,
}): ReactNode => {
	// While this block is being put together in the editor it has no id yet, so its slides go
	// along for the proxy to resolve. One entry per slide, so the response stays aligned.
	const unsavedObjects = useMemo(
		() =>
			elements.map((element) => ({
				schemaIdentifier: String(element.mediaItem?.value || ''),
				start: element.startTime ? (toSeconds(element.startTime, true) ?? undefined) : undefined,
				end: element.endTime ? (toSeconds(element.endTime, true) ?? undefined) : undefined,
			})),
		[elements]
	);

	// The objects themselves -- and the part of them that plays -- are resolved by the proxy from
	// this block's stored config, so only the block id goes out once it has been saved. The
	// response comes back in the same order as the elements below, which is what lets them be
	// merged by index.
	const {
		data: ieObjects,
		isLoading,
		isFetching,
	} = useGetIeObjectsPlayableDisplayData(blockId, unsavedObjects);

	const items = useMemo(() => {
		return elements.map((object, index) => {
			const ieObject = ieObjects?.[index];
			// A resolved-but-null entry means this slide's object couldn't be loaded; the slide
			// stays in the strip and shows an error tile instead of an empty player.
			const hasFailed = !!ieObjects && index < ieObjects.length && ieObjects[index] === null;
			const dctermsFormat = (ieObject?.dctermsFormat ??
				object.mediaItem?.dctermsFormat) as IeObjectType;

			return {
				...ieObject,
				schemaIdentifier: ieObject?.schemaIdentifier ?? String(object.mediaItem?.value),
				dctermsFormat,
				videoThumbnail: object.videoThumbnail,
				hasFailed,
				backgroundColor: isAudioVideoFormat(dctermsFormat)
					? getRandomTertiaryBackgroundColor()
					: Color.Mustard,
			} as HeroCarouselSlideItem;
		});
	}, [elements, ieObjects]);

	return (
		<article className={clsx('c-block-hero-carousel', className)}>
			{backgroundImage && (
				<div
					aria-hidden
					className={clsx('c-block-hero-carousel__background')}
					style={
						{
							backgroundImage: `url(${backgroundImage})`,
						} as CSSProperties
					}
				/>
			)}
			<BlockHeroCarouselSearch
				title={title}
				subtitles={subtitles}
				searchAriaLabel={searchAriaLabel}
			/>
			{/* Nothing to show until the objects have been resolved: a slide without a playable url
			    would render an empty player. */}
			{!!ieObjects?.length && (
				<BlockHeroCarouselCarousel elements={items} isLoading={isLoading || isFetching} />
			)}
		</article>
	);
};
