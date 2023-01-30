import {
	CTA,
	CTAProps,
	DefaultProps,
	defaultRenderLinkFunction,
	RenderLinkFunction,
} from '@viaa/avo2-components';
import classnames from 'classnames';
import React, { FunctionComponent } from 'react';

export interface BlockCTAsProps extends DefaultProps {
	elements: CTAProps[];
	width?: string;
	renderLink?: RenderLinkFunction;
}

export const BlockCTAs: FunctionComponent<BlockCTAsProps> = ({
	className,
	elements,
	width,
	renderLink = defaultRenderLinkFunction,
}) => (
	<div className={classnames(className, 'c-cta')}>
		{elements.map((cta, index) => (
			<CTA
				key={`cta-${index}`}
				{...cta}
				renderLink={renderLink}
				width={width || (elements.length === 1 ? '100%' : '50%')}
			/>
		))}
	</div>
);
