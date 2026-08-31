import React, { type FunctionComponent, type ReactElement } from 'react';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon';
import { getIconFromObjectType } from '~shared/helpers/get-icon-from-object-type.ts';

export interface BlockHeroCarouselInaccessibleItemProps extends DefaultComponentProps {
	item: HeroCarouselSlideItem;
}

export const BlockHeroCarouselInaccessibleItem: FunctionComponent<
	BlockHeroCarouselInaccessibleItemProps
> = ({ item }): ReactElement => {
	return (
		<div className="c-block-hero-carousel__carousel-slide-placeholder">
			<Icon name={getIconFromObjectType(item.dctermsFormat, false)} />
		</div>
	);
};
