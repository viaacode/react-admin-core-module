import type { DefaultProps } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React from 'react';

import './CopyrightAttribution.scss';
import clsx from 'clsx';

export interface BlockImageProps extends DefaultProps {
	title?: string;
	showIcon?: boolean;
	text?: string;
}

export const CopyrightAttribution: FunctionComponent<BlockImageProps> = ({
	className,
	title = '',
	showIcon = false,
	text = '',
}) => {
	if (!title && !text) {
		return null;
	}

	const renderTitle = () => {
		if (!title && !showIcon) {
			return null;
		}

		return (
			<h3>
				{showIcon && <>&#169;</>} {title}
			</h3>
		);
	};

	return (
		<div className={clsx('a-copyright-attribution__annotation', className)}>
			{renderTitle()}
			{text && <p className="a-copyright-attribution__text">{text}</p>}
		</div>
	);
};
