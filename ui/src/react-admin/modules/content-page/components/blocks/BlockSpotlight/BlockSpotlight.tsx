import type {
	ButtonAction,
	DefaultProps,
	IconName,
	RenderLinkFunction,
} from '@viaa/avo2-components';
import { Icon } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';
import { getBackgroundImage } from '~shared/helpers/images';
import { defaultRenderLinkFunction } from '~shared/helpers/routing/link';

import './BlockSpotlight.scss';

// The first item spans 4 of 6 columns of the page content width (~850px), the other two 2 of 6
// (~425px). All of them are full width (up to 700px) on mobile.
const ITEM_DISPLAY_WIDTHS = [860, 640, 640];

export interface ImageInfo {
	image: string;
	title: string;
	buttonAction?: ButtonAction;
	className?: string;
}

export interface BlockSpotlightProps extends DefaultProps {
	elements: ImageInfo[];
	renderLink?: RenderLinkFunction;
}

export const BlockSpotlight: FunctionComponent<BlockSpotlightProps> = ({
	elements,
	renderLink = defaultRenderLinkFunction,
	className,
}) => {
	function renderItem(index: number) {
		const element = elements?.[index];
		if (!element) {
			return null;
		}
		const buttonAction = element?.buttonAction;
		return (
			<div
				className={clsx('c-spotlight__item', {
					'u-clickable': !!buttonAction,
				})}
				style={{ backgroundImage: getBackgroundImage(element?.image, ITEM_DISPLAY_WIDTHS[index]) }}
			>
				{renderLink(
					buttonAction,
					<p>
						{element?.title} <Icon name={'chevronRight' as IconName} />
					</p>,
					element?.title
				)}
			</div>
		);
	}

	return (
		<div className={clsx(className, 'c-spotlight')}>
			{renderItem(0)}
			{renderItem(1)}
			{renderItem(2)}
		</div>
	);
};
