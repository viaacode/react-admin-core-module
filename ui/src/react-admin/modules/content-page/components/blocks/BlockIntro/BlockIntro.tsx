import type { AlignOptions, DefaultProps, HeadingType } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';
import { BlockRichText } from '~content-blocks/BlockRichText/BlockRichText';
import { BlockHeading } from '../BlockHeading/BlockHeading';

export interface BlockIntroProps extends DefaultProps {
	title: string;
	content: string;
	align?: AlignOptions;
	headingType?: HeadingType;
}

export const BlockIntro: FunctionComponent<BlockIntroProps> = ({
	className,
	title,
	content = '',
	align = 'left',
	headingType = 'h1',
}) => (
	<div className={clsx(className, 'c-content', `u-text-${align}`)}>
		{title && (
			<BlockHeading className="o-container-vertical-title__title" type={headingType}>
				{title}
			</BlockHeading>
		)}
		{content && (
			<BlockRichText className="o-container-vertical-intro__intro" elements={{ content }} />
		)}
	</div>
);
