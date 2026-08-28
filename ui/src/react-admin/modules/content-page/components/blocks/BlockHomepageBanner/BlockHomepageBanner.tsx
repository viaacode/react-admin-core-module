import React, { type CSSProperties, type FunctionComponent, type ReactElement } from 'react';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockHomepageBanner.scss';
import { Container } from '@viaa/avo2-components';
import clsx from 'clsx';
import { BlockHeading } from '~content-blocks/BlockHeading';
import {
	type AlignOption,
	Color,
	ColorSelectGradientColors,
	CustomBackground,
} from '~modules/content-page/types/content-block.types';
import { ContentPageWidth } from '~modules/content-page/types/content-pages.types.ts';
import Html from '~shared/components/Html/Html.tsx';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';

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
	const patternColor =
		bannerColor === CustomBackground.MeemooLogo
			? Color.Transparent
			: ((ColorSelectGradientColors as Record<string, string>)[bannerColor] ?? bannerColor);

	return (
		<article
			className={clsx('c-block-homepage-banner', 'o-container')}
			style={
				{
					background: backgroundColor,
					'--pattern-color': patternColor,
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
					{/* No-op on desktop (patterns sit beside the text via CSS); on mobile this
					    is the clip box that caps the pattern at 1/3 screen width - see .scss.
					    Placed here (before the title) only for mobile's source order. */}
					<div className="c-block-homepage-banner__pattern-slot c-block-homepage-banner__pattern-slot--top">
						<div
							className="c-block-homepage-banner__pattern c-block-homepage-banner__pattern--left"
							aria-hidden="true"
						/>
					</div>
					<BlockHeading className="c-block-homepage-banner__content-title" type="h4">
						{title}
					</BlockHeading>
					{/* c-rich-text-editor__content gives the rich text output its standard styling,
					    paragraph spacing included - see BlockRichText */}
					<Html
						className={clsx(
							'c-block-homepage-banner__content-text',
							'u-background-text-secondary',
							'u-background-text-links'
						)}
						content={content}
						sanitizePreset={SanitizePreset.full}
						type="p"
					/>
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
