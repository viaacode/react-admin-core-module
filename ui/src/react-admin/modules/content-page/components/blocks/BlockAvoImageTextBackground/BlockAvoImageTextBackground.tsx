import clsx from 'clsx';
import type { FunctionComponent, ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import type {
	AlignOption,
	BackgroundAlignOption,
	HeadingSizeOption,
	HeadingTypeOption,
	SimpleAlignOption,
} from '~modules/content-page/types/content-block.types';
import { Color } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { BlockHeading } from '../BlockHeading';
import type { ButtonAction, ButtonType, IconName, SpacerOption } from '@viaa/avo2-components';
import { Button, Container, Image } from '@viaa/avo2-components';
import { generateSmartLink } from '~modules/shared/components/SmartLink/SmartLink';
import { Icon } from '~shared/components/Icon';
import { ContentWidth } from '~modules/content-page/types/content-pages.types';
import { isMobileWidth } from '~shared/helpers/media-query';

import './BlockAvoImageTextBackground.scss';

const FONT_SIZE_TO_VW: Record<HeadingSizeOption, number> = {
	small: 2.1,
	medium: 2.4,
	large: 2.7,
};

const TEXT_PADDING_TO_VW: Partial<Record<SpacerOption, number>> = {
	small: 0.2,
	medium: 0.3,
	large: 0.4,
	'extra-large': 0.5,
};

const IMAGE_ALIGN_TO_TEXT_ALIGN: Record<BackgroundAlignOption, AlignOption> = {
	'left-screen': 'right',
	'right-screen': 'left',
	'left-inside-page': 'right',
	'right-inside-page': 'left',
	'fill-screen': 'center',
};

const TEXT_ALIGN_TO_FLEX: Record<AlignOption, string> = {
	left: 'flex-start',
	center: 'center',
	right: 'flex-end',
};

export interface BlockAvoImageTextBackgroundProps extends DefaultComponentProps {
	heading: string;
	headingType: HeadingTypeOption;
	headingSize: HeadingSizeOption;
	content: string;
	contentWidth: number;
	contentPosition: number;
	textAlign: AlignOption;
	textPadding: SpacerOption;
	foregroundColor: Color;
	backgroundColor: Color;
	image?: string;
	backgroundAlignment?: BackgroundAlignOption;
	imageAttribution?: string;
	imageAttributionText?: string;
	buttonAction?: ButtonAction;
	buttonAltTitle?: string;
	buttonLabel: string;
	buttonType?: ButtonType;
	buttonIcon?: IconName;
	buttonIconAlignment?: SimpleAlignOption;
	pageWidth?: ContentWidth;
}

export const BlockAvoImageTextBackground: FunctionComponent<BlockAvoImageTextBackgroundProps> = ({
	className,
	heading,
	headingType,
	headingSize,
	content,
	contentWidth,
	contentPosition,
	textAlign,
	textPadding,
	foregroundColor,
	backgroundColor,
	image,
	backgroundAlignment = 'fill-screen',
	imageAttribution,
	imageAttributionText,
	buttonAction,
	buttonAltTitle,
	buttonLabel,
	buttonType,
	buttonIcon,
	buttonIconAlignment = 'left',
	pageWidth,
}): ReactElement => {
	const ref = React.createRef<HTMLDivElement>();
	const computedTextAlign = textAlign || IMAGE_ALIGN_TO_TEXT_ALIGN[backgroundAlignment];

	const [blockWidth, setBlockWidth] = useState<number | null>(null); // pixels

	useEffect(() => {
		if (ref.current) {
			setBlockWidth(ref.current.clientWidth);
		}
	}, [ref.current]);

	const renderHeadingTextAndButton = () => {
		// During editing the block width isn't 100% of the page, so the visual font size seems too big
		let fontSize =
			(FONT_SIZE_TO_VW[headingSize] * (blockWidth || window.innerWidth)) / window.innerWidth;
		let padding = TEXT_PADDING_TO_VW[textPadding] || 0;
		let lineHeightTitle = (fontSize + padding * 2) * 1.2;
		let lineHeightText = padding * 2 * 1.3;

		if (isMobileWidth()) {
			fontSize = fontSize / 3;
			padding = padding / 3;
			lineHeightTitle = fontSize + padding * 2 * 1.5;
			lineHeightText = (1.5 + padding * 2) * 1.3;
		}

		return (
			<>
				{!!heading && (
					<BlockHeading
						className="c-block-avo-image-text-background__heading"
						type={headingType}
						style={{
							textAlign: computedTextAlign,
							lineHeight: lineHeightTitle + 'vw',
						}}
					>
						<mark
							style={{
								fontSize: fontSize + 'vw',
								padding: padding + 'vw',
								backgroundColor: backgroundColor,
								boxDecorationBreak: 'clone',
								whiteSpace: 'normal',
								color: foregroundColor,
							}}
						>
							{heading}
						</mark>
					</BlockHeading>
				)}
				{!!content && (
					<p
						className="c-block-avo-image-text-background__content"
						style={{
							textAlign: computedTextAlign,
							marginTop: (heading ? 1 : 0) + 'rem',
							marginLeft: padding + 'rem',
						}}
					>
						<mark
							style={{
								padding: padding + 'rem',
								backgroundColor: backgroundColor,
								lineHeight: lineHeightText + 'rem',
								boxDecorationBreak: 'clone',
								whiteSpace: 'normal',
								color: foregroundColor,
							}}
						>
							{content}
						</mark>
					</p>
				)}

				{buttonAction &&
					generateSmartLink(
						buttonAction,
						<Button
							className={`c-block-avo-image-text-background__button c-block-avo-image-text-background__button-icon--${buttonIconAlignment}`}
							label={buttonLabel}
							type={buttonType}
							icon={buttonIcon}
							iconPosition={buttonIconAlignment}
							renderIcon={() => (buttonIcon ? <Icon name={buttonIcon} /> : null)}
							style={{
								marginTop: (heading ? 1.6 : 2.2) + 'rem',
								marginLeft:
									(backgroundColor === Color.Transparent ? padding : 0) + 'rem',
							}}
						/>,
						buttonAltTitle || buttonLabel
					)}
			</>
		);
	};

	const renderImage = () => {
		if (!image) {
			return null;
		}
		return (
			<Image
				src={image}
				className={clsx(
					'c-block-avo-image-text-background__image-wrapper',
					'c-block-avo-image-text-background__image-wrapper--' + backgroundAlignment
				)}
			/>
		);
	};

	const renderBlockContent = () => {
		if (backgroundAlignment === 'fill-screen') {
			return (
				<>
					<Container
						className={clsx(
							'c-block-avo-image-text-background__page-wrapper',
							'c-block-avo-image-text-background__page-wrapper--' + computedTextAlign
						)}
						style={{
							color: foregroundColor,
							alignItems: TEXT_ALIGN_TO_FLEX[computedTextAlign],
							left: contentPosition + '%',
							width: contentWidth + '%',
						}}
						mode="horizontal"
						size={
							pageWidth?.toUpperCase() === ContentWidth.EXTRA_LARGE
								? undefined
								: (pageWidth?.toLowerCase() as 'medium' | 'large')
						}
					>
						{renderHeadingTextAndButton()}
					</Container>

					{renderImage()}
				</>
			);
		} else if (
			backgroundAlignment === 'left-screen' ||
			backgroundAlignment === 'right-screen'
		) {
			return (
				<>
					<Container
						className="c-block-avo-image-text-background__page-wrapper"
						style={{ color: foregroundColor }}
						mode="horizontal"
						size={
							pageWidth?.toUpperCase() === ContentWidth.EXTRA_LARGE
								? undefined
								: (pageWidth?.toLowerCase() as 'medium' | 'large')
						}
					>
						<div
							className="c-block-avo-image-text-background__column-text"
							style={{
								alignItems: TEXT_ALIGN_TO_FLEX[computedTextAlign],
							}}
						>
							{renderHeadingTextAndButton()}
						</div>
					</Container>

					{renderImage()}
				</>
			);
		} else if (
			backgroundAlignment === 'left-inside-page' ||
			backgroundAlignment === 'right-inside-page'
		) {
			return (
				<>
					<Container
						className="c-block-avo-image-text-background__page-wrapper"
						style={{ color: foregroundColor }}
						mode="horizontal"
						size={
							pageWidth?.toUpperCase() === ContentWidth.EXTRA_LARGE
								? undefined
								: (pageWidth?.toLowerCase() as 'medium' | 'large')
						}
					>
						<div
							className="c-block-avo-image-text-background__column-text"
							style={{
								alignItems: TEXT_ALIGN_TO_FLEX[computedTextAlign],
							}}
						>
							{renderHeadingTextAndButton()}
						</div>
						<div className="c-block-avo-image-text-background__column-image">
							{renderImage()}
						</div>
					</Container>
				</>
			);
		} else {
			return null;
		}
	};

	return (
		<article className={clsx('c-block-avo-image-text-background', className)} ref={ref}>
			<div
				className={`c-block-avo-image-text-background-wrapper c-block-avo-image-text-background--${backgroundAlignment}`}
			>
				{renderBlockContent()}
			</div>

			{/* image author attribution */}
			{(!!imageAttribution || !!imageAttributionText) && (
				<div className="a-block-image__annotation">
					{imageAttribution && <h3>&#169; {imageAttribution}</h3>}
					{imageAttributionText && (
						<p className="a-block-image__text">{imageAttributionText}</p>
					)}
				</div>
			)}
		</article>
	);
};
