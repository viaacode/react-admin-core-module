import {
	ButtonAction,
	DefaultProps,
	Icon,
	IconName,
	RenderLinkFunction,
} from '@viaa/avo2-components';
import classnames from 'classnames';
import React, { FunctionComponent } from 'react';
import { defaultRenderLinkFunction } from '~shared/helpers/link';

import './BlockSpotlight.scss';

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
				className={classnames('c-spotlight__item', {
					'u-clickable': !!buttonAction,
				})}
				style={{ backgroundImage: `url(${element?.image})` }}
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
		<div className={classnames(className, 'c-spotlight')}>
			{renderItem(0)}
			{renderItem(1)}
			{renderItem(2)}
		</div>
	);
};
