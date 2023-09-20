import { CTA, CTAProps, DefaultProps, RenderLinkFunction } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { defaultRenderLinkFunction } from '~shared/helpers/link';

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
	<div className={clsx(className, 'c-cta')}>
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
