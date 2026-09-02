import type { HetArchiefIeObjectType as IeObjectType } from '@viaa/avo2-types';
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
	const { data: ieObjects, isLoading } = useGetIeObjectsPlayableDisplayData(
		blockId,
		unsavedObjects
	);

	// The random tertiary colour has to be picked once per slide and then stay put: derived inside
	// the merge below it would be re-rolled the moment the fetched objects land, changing the
	// background of a slide the visitor is already looking at. Nothing here needs the response --
	// the format is picked in the content picker and is known up-front.
	const backgroundColors = useMemo(
		() =>
			elements.map((element) =>
				isAudioVideoFormat(element.mediaItem?.dctermsFormat as IeObjectType)
					? getRandomTertiaryBackgroundColor()
					: Color.Mustard
			),
		[elements]
	);

	// Merged by index: whatever is already known from the block config -- the object it points at,
	// its format, its thumbnail -- is what the slide shows while the objects are still being
	// resolved, and the fetched object fills in the rest (playable url, name, ...) on top of it.
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
				// The content picker stores the object's name as the picked item's label, so the
				// metadata strip under the carousel can name the slide before its object has been
				// resolved instead of sitting there empty.
				name: ieObject?.name ?? object.mediaItem?.label,
				videoThumbnail: object.videoThumbnail,
				hasFailed,
				backgroundColor: backgroundColors[index],
			} as HeroCarouselSlideItem;
		});
	}, [elements, ieObjects, backgroundColors]);

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
			{/* The strip goes up as soon as there is a slide to put in it, sized and coloured from
			    what the block config already knows; the slides themselves show a spinner until
			    their object has been resolved. Only the first fetch counts as loading -- a
			    background refetch shouldn't turn a strip that already has content back into
			    spinners. */}
			{items.length > 0 && <BlockHeroCarouselCarousel elements={items} isLoading={isLoading} />}
		</article>
	);
};
