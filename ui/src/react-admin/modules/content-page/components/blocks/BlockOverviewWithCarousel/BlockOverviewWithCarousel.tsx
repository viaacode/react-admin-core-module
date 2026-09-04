import { Button } from '@meemoo/react-components';
import { type ButtonAction, Image } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import React, { type FunctionComponent, type ReactElement, useMemo, useState } from 'react';
import type SwiperController from 'swiper';
import { Controller } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import clsx from 'clsx';
import { BlockHeading } from '~content-blocks/BlockHeading';
import { CarouselButtons } from '~modules/content-page/components/CarouselButtons/CarouselButtons.tsx';
import { IeObjectLoadError } from '~modules/content-page/components/IeObjectLoadError/IeObjectLoadError.tsx';
import { useGetIeObjectsPlayableDisplayData } from '~modules/content-page/hooks/useGetIeObjectsPlayableDisplayData.ts';
import type { Color, HeadingTypeOption } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink.tsx';

import 'swiper/css';
import './BlockOverviewWithCarousel.scss';

export interface BlockOverviewWithCarouselProps extends DefaultComponentProps {
	/** Injected by the content block renderer for saved blocks, see PLAYABLE_DISPLAY_DATA_BLOCKS */
	blockId?: string;
	backgroundColor: string;
	title: string;
	titleType: HeadingTypeOption;
	buttonLabel: string;
	buttonAltTitle?: string;
	buttonAction?: ButtonAction;
	elements: {
		mediaItem?: ButtonAction;
		image: string;
		imageAlt: string;
		title: string;
		textColor: Color;
		backgroundColor: Color;
		itemDisplay: string;
	}[];
}

export const BlockOverviewWithCarousel: FunctionComponent<BlockOverviewWithCarouselProps> = ({
	blockId,
	backgroundColor,
	title,
	titleType,
	buttonLabel,
	buttonAltTitle,
	buttonAction,
	elements,
}): ReactElement => {
	const [controlledSwiper, setControlledSwiper] = useState<SwiperController | null>(null);

	// A slide shows an editor-uploaded image, but it can link to an ie-object. Resolve those objects
	// so a slide pointing at content this visitor may not see isn't advertised with its artwork.
	// The response keeps the block's element order, so entry i belongs to element i.
	// While this block is being put together in the editor it has no id yet, so its slides go along
	// for the proxy to resolve. One entry per slide, so the response stays aligned; slides that
	// don't point at an ie-object send an empty identifier.
	const unsavedObjects = useMemo(
		() =>
			elements.map((element) => ({
				schemaIdentifier:
					element.mediaItem?.type === AvoCoreContentPickerType.IE_OBJECT
						? String(element.mediaItem?.value || '')
						: '',
			})),
		[elements]
	);

	const { data: ieObjects } = useGetIeObjectsPlayableDisplayData(blockId, unsavedObjects);

	const renderSlideContent = (
		image: string,
		imageAlt: string,
		title: string,
		backgroundColor: Color,
		textColor: Color,
		// False only for a slide linking to an ie-object whose essence this visitor may not see
		hasAccessToEssence = true
	) => {
		return (
			<>
				{hasAccessToEssence ? (
					<Image
						src={image}
						alt={imageAlt || title}
						className={clsx('c-block-overview-with-carousel__slide-image')}
					/>
				) : (
					<IeObjectLoadError className={clsx('c-block-overview-with-carousel__slide-image')} />
				)}
				<div
					className={'c-block-overview-with-carousel__slide-description'}
					style={{
						backgroundColor: backgroundColor,
					}}
				>
					<span
						className={'c-block-overview-with-carousel__slide-text'}
						style={{
							color: textColor,
						}}
					>
						{title}
					</span>
				</div>
			</>
		);
	};

	return (
		<div
			className={clsx('c-block-overview-with-carousel')}
			style={{
				backgroundColor: backgroundColor,
			}}
		>
			<div className={'c-block-overview-with-carousel__header'}>
				<BlockHeading
					className={clsx('c-block-overview-with-carousel__header-title')}
					type={titleType}
				>
					{title}
				</BlockHeading>

				<div className={'c-block-overview-with-carousel__header-actions'}>
					{buttonAction &&
						generateSmartLink(
							buttonAction,
							<Button
								variants={['inline-block', 'silver', 'sm']}
								label={buttonLabel}
								title={buttonAltTitle}
								ariaLabel={buttonAltTitle}
							/>,
							buttonAltTitle || buttonLabel,
							undefined,
							-1
						)}
					<CarouselButtons controlledSwiper={controlledSwiper} />
				</div>
			</div>
			<Swiper
				modules={[Controller]}
				controller={{ control: controlledSwiper }}
				className={'c-block-overview-with-carousel__wrapper'}
				slidesPerView="auto"
				spaceBetween={16}
				onSwiper={setControlledSwiper}
				watchSlidesProgress={true}
			>
				{elements.map(
					(
						{ title, image, imageAlt, itemDisplay, textColor, backgroundColor, mediaItem },
						index
					) => {
						const componentClassName = clsx(
							'c-block-overview-with-carousel__slide',
							itemDisplay === '9:16' && 'c-block-overview-with-carousel__slide__portrait',
							itemDisplay === '9:16round' && 'c-block-overview-with-carousel__slide__round',
							itemDisplay === '16:9' && 'c-block-overview-with-carousel__slide__landscape'
						);
						// Only a slide that links to an ie-object can be gated, and only once the proxy has
						// answered. Anything else keeps its artwork: a content page, an external link, or a
						// slide whose object is still loading -- so it doesn't flash the no-access tile on
						// every load. For the gated ones a null entry counts as no access too: it means the
						// object is gone or wholly out of reach.
						const linksToIeObject = mediaItem?.type === AvoCoreContentPickerType.IE_OBJECT;
						const isGatedByIeObject = linksToIeObject && !!ieObjects;
						const hasAccessToEssence = isGatedByIeObject
							? !!ieObjects?.[index]?.hasAccessToEssence
							: true;

						return (
							<SwiperSlide
								key={`carousel-slide__${title}__${mediaItem?.type}__${mediaItem?.value}`}
								className={componentClassName}
								style={{
									backgroundColor: backgroundColor,
								}}
							>
								{({ isVisible }) => {
									return generateSmartLink(
										mediaItem,
										renderSlideContent(
											image,
											imageAlt,
											title,
											backgroundColor,
											textColor,
											hasAccessToEssence
										),
										title,
										componentClassName,
										isVisible ? undefined : -1
									);
								}}
							</SwiperSlide>
						);
					}
				)}
			</Swiper>
		</div>
	);
};
