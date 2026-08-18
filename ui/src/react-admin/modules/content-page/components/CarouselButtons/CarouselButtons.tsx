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
	controlledSwiper?: SwiperController | null;
	// Plain-callback mode: for carousels with their own hand-rolled (non-swiper) navigation,
	// e.g. the hero carousel's infinite strip. When both are set, the buttons are always
	// enabled and swiper wiring below is skipped entirely.
	onPrev?: () => void;
	onNext?: () => void;
}

export const CarouselButtons: FunctionComponent<CarouselButtonsProps> = ({
	controlledSwiper = null,
	onPrev,
	onNext,
	className,
}): ReactNode => {
	const isPlainCallbackMode = !!onPrev && !!onNext;

	const [disablePrevSlideButton, setDisablePrevSlideButton] = useState<boolean>(
		!isPlainCallbackMode
	);
	const [disableNextSlideButton, setDisableNextSlideButton] = useState<boolean>(
		!isPlainCallbackMode
	);

	const updateSlideButtons = () => {
		setDisablePrevSlideButton(!!controlledSwiper?.isBeginning);
		setDisableNextSlideButton(!!controlledSwiper?.isEnd);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only used to init the buttons
	useEffect(() => {
		if (isPlainCallbackMode) {
			return;
		}
		if (controlledSwiper) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			updateSlideButtons();
			controlledSwiper.on('transitionEnd', updateSlideButtons);
		}

		return () => {
			controlledSwiper?.off('transitionEnd', updateSlideButtons);
		};
	}, [controlledSwiper, isPlainCallbackMode]);

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
				onClick={() => (onPrev ? onPrev() : controlledSwiper?.slidePrev())}
				disabled={disablePrevSlideButton}
			/>
			<Button
				variants={['black', 'sm']}
				icon={<Icon name="arrowRight" />}
				title={tText('Volgende slide', undefined, [HET_ARCHIEF])}
				ariaLabel={tText('Volgende slide', undefined, [HET_ARCHIEF])}
				onClick={() => (onNext ? onNext() : controlledSwiper?.slideNext())}
				disabled={disableNextSlideButton}
			/>
		</div>
	);
};
