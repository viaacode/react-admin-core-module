import {
	ButtonAction,
	DefaultProps,
	defaultRenderLinkFunction,
	Icon,
	IconName,
	RenderLinkFunction,
} from '@viaa/avo2-components';
import classnames from 'classnames';
import { get } from 'lodash-es';
import React, { FunctionComponent } from 'react';

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
		if (!elements[index]) {
			return null;
		}
		const buttonAction = get(elements, [index, 'buttonAction']);
		return (
			<div
				className={classnames('c-spotlight__item', {
					'u-clickable': !!buttonAction,
				})}
				style={{ backgroundImage: `url(${get(elements, [index, 'image'])})` }}
			>
				{renderLink(
					buttonAction,
					<p>
						{get(elements, [index, 'title'])} <Icon name={IconName.chevronRight} />
					</p>,
					get(elements, [index, 'title'])
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
