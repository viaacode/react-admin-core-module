import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement } from 'react';
import '~modules/content-page/components/CarouselButtons/CarouselButtons.scss';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon';
import { tText } from '~shared/helpers/translation-functions.ts';
import { HET_ARCHIEF } from '~shared/types';

export interface BlockHeroCarouselNavButtonsProps extends DefaultComponentProps {
	onPrev: () => void;
	onNext: () => void;
}

export const BlockHeroCarouselNavButtons: FunctionComponent<BlockHeroCarouselNavButtonsProps> = ({
	onPrev,
	onNext,
	className,
}): ReactElement => (
	<div className={clsx('c-carousel-buttons', className)}>
		<Button
			variants={['black', 'sm']}
			icon={<Icon name="arrowLeft" />}
			title={tText('Vorige slide', undefined, [HET_ARCHIEF])}
			ariaLabel={tText('Vorige slide', undefined, [HET_ARCHIEF])}
			onClick={onPrev}
		/>
		<Button
			variants={['black', 'sm']}
			icon={<Icon name="arrowRight" />}
			title={tText('Volgende slide', undefined, [HET_ARCHIEF])}
			ariaLabel={tText('Volgende slide', undefined, [HET_ARCHIEF])}
			onClick={onNext}
		/>
	</div>
);
