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
					{/*
						On desktop these patterns sit beside the text and this wrapper is a
						no-op (unpositioned, so the pattern's own position: absolute reaches
						past it to __content). On mobile the wrapper becomes the positioned,
						overflow-clipping "slot" that caps the pattern at max 1/3 or 2/3 of the
						screen width - see BlockHomepageBanner.scss for why the clipping can't
						happen on the pattern element itself. It's placed here, before the
						title, purely for source order (mobile stacks it above the text); the
						desktop position is entirely controlled by CSS.
					*/}
					<div className="c-block-homepage-banner__pattern-slot c-block-homepage-banner__pattern-slot--top">
						<div
							className="c-block-homepage-banner__pattern c-block-homepage-banner__pattern--left"
							aria-hidden="true"
						/>
					</div>
					<BlockHeading className="c-block-homepage-banner__content-title" type="h4">
						{title}
					</BlockHeading>
					<Html className="c-block-homepage-banner__content-text" content={content} type="p"></Html>
					<div className="c-block-homepage-banner__pattern-slot c-block-homepage-banner__pattern-slot--bottom">
						<div
							className="c-block-homepage-banner__pattern c-block-homepage-banner__pattern--right"
							aria-hidden="true"
						/>
					</div>
				</div>
			</Container>
		</article>
	);
};
