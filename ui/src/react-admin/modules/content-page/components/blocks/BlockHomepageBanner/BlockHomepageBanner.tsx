import React, { type CSSProperties, type FunctionComponent, type ReactElement } from 'react';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockHomepageBanner.scss';
import { Container } from '@viaa/avo2-components';
import clsx from 'clsx';
import { BlockHeading } from '~content-blocks/BlockHeading';
import type { AlignOption } from '~modules/content-page/types/content-block.types';
import { ContentPageWidth } from '~modules/content-page/types/content-pages.types.ts';
import Html from '~shared/components/Html/Html.tsx';

export interface BlockHomepageBannerProps extends DefaultComponentProps {
	title: string;
	content: string;
	textAlign: AlignOption;
	backgroundColor: string;
	bannerColor: string;
	pageWidth?: string;
}

export const BlockHomepageBanner: FunctionComponent<BlockHomepageBannerProps> = ({
	title,
	content,
	textAlign,
	backgroundColor,
	bannerColor,
	pageWidth,
}): ReactElement => {
	return (
		<article
			className={clsx('c-block-homepage-banner', 'o-container')}
			style={
				{
					background: backgroundColor,
					'--pattern-color': bannerColor,
				} as CSSProperties
			}
		>
			<Container
				mode="horizontal"
				size={
					pageWidth?.toUpperCase() === ContentPageWidth.EXTRA_LARGE
						? undefined
						: (pageWidth?.toLowerCase() as 'medium' | 'large')
				}
			>
				<div
					className={clsx(
						'c-block-homepage-banner__content',
						`c-block-homepage-banner__content--${textAlign}`
					)}
				>
					<BlockHeading className="c-block-homepage-banner__content-title" type="h4">
						{title}
					</BlockHeading>
					<Html className="c-block-homepage-banner__content-text" content={content} type="p"></Html>
					<div
						className="c-block-homepage-banner__pattern c-block-homepage-banner__pattern--left"
						aria-hidden="true"
					/>
					<div
						className="c-block-homepage-banner__pattern c-block-homepage-banner__pattern--right"
						aria-hidden="true"
					/>
				</div>
			</Container>
		</article>
	);
};
