import type { DefaultProps } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React from 'react';

import './CopyrightAttribution.scss';
import clsx from 'clsx';

export interface CopyrightAttributionProps extends DefaultProps {
	title?: string;
	showIcon?: boolean;
	text?: string;
}

export const CopyrightAttribution: FunctionComponent<CopyrightAttributionProps> = ({
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
			<span className="a-copyright-attribution__annotation u-background-text-secondary">
				{showIcon && <>&#169;</>} {title}
			</span>
		);
	};

	return (
		<div className={clsx('a-copyright-attribution', className)}>
			{renderTitle()}
			{text && (
				<span className="a-copyright-attribution__text u-background-text-primary">{text}</span>
			)}
		</div>
	);
};
