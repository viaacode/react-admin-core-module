import { Button } from '@meemoo/react-components';
import React, { type FunctionComponent, type ReactNode, useEffect, useState } from 'react';
import type SwiperController from 'swiper';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon';
import { tText } from '~shared/helpers/translation-functions.ts';
import 'swiper/css';
import { HET_ARCHIEF } from '~shared/types';
import './CarouselButtons.scss';
import { clsx } from 'clsx';

export interface CarouselButtonsProps extends DefaultComponentProps {
	controlledSwiper: SwiperController | null;
	isLoopedCarousel: boolean;
}

export const CarouselButtons: FunctionComponent<CarouselButtonsProps> = ({
	controlledSwiper,
	isLoopedCarousel,
	className,
}): ReactNode => {
	const [disablePrevSlideButton, setDisablePrevSlideButton] = useState<boolean>(true);
	const [disableNextSlideButton, setDisableNextSlideButton] = useState<boolean>(true);

	const updateSlideButtons = () => {
		if (isLoopedCarousel) {
			const amountOfSlides = controlledSwiper?.slides?.length || 0;
			setDisablePrevSlideButton(amountOfSlides === 0);
			setDisableNextSlideButton(amountOfSlides === 0);
		} else {
			setDisablePrevSlideButton(!!controlledSwiper?.isBeginning);
			setDisableNextSlideButton(!!controlledSwiper?.isEnd);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only used to init the buttons
	useEffect(() => {
		if (controlledSwiper) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			updateSlideButtons();
			controlledSwiper.on('transitionEnd', updateSlideButtons);
		}

		return () => {
			controlledSwiper?.off('transitionEnd', updateSlideButtons);
		};
	}, [controlledSwiper]);

	if (disablePrevSlideButton && disableNextSlideButton) {
		return null;
	}

	return (
		<div className={clsx('c-carousel-buttons', className)}>
			<Button
				variants={['black', 'sm']}
				icon={<Icon name="arrowLeft" />}
				title={tText('Vorige slide', undefined, [HET_ARCHIEF])}
				ariaLabel={tText('Vorige slide', undefined, [HET_ARCHIEF])}
				onClick={() => controlledSwiper?.slidePrev()}
				disabled={disablePrevSlideButton}
			/>
			<Button
				variants={['black', 'sm']}
				icon={<Icon name="arrowRight" />}
				title={tText('Volgende slide', undefined, [HET_ARCHIEF])}
				ariaLabel={tText('Volgende slide', undefined, [HET_ARCHIEF])}
				onClick={() => controlledSwiper?.slideNext()}
				disabled={disableNextSlideButton}
			/>
		</div>
	);
};
