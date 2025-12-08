import type { CTAProps, DefaultProps, RenderLinkFunction } from '@viaa/avo2-components';
import { CTA } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';
import { defaultRenderLinkFunction } from '~shared/helpers/routing/link';

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
				// biome-ignore lint/suspicious/noArrayIndexKey: We don't have a better key at this time
				key={`cta-${index}`}
				{...cta}
				renderLink={renderLink}
				width={width || (elements.length === 1 ? '100%' : '50%')}
			/>
		))}
	</div>
);
