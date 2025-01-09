import clsx from 'clsx';
import type { FunctionComponent, ReactElement } from 'react';
import type {
	AlignOption,
	BackgroundAlignOption,
	Color,
	HeadingSizeOption,
	HeadingTypeOption,
	SimpleAlignOption,
} from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { BlockHeading } from '../BlockHeading';
import type { ButtonAction, ButtonType, IconName, SpacerOption } from '@viaa/avo2-components';
import { Button, Container, Image } from '@viaa/avo2-components';
import { generateSmartLink } from '~modules/shared/components/SmartLink/SmartLink';
import { Icon } from '~shared/components/Icon';
import { ContentWidth } from '~modules/content-page/types/content-pages.types';

import './image-text-background.scss';

const FONT_SIZE_TO_REM: Record<HeadingSizeOption, string> = {
	small: '3.2rem',
	medium: '3.6rem',
	large: '4rem',
};

const TEXT_PADDING_TO_REM: Partial<Record<SpacerOption, string>> = {
	small: '0.5rem',
	medium: '1.5rem',
	large: '2rem',
	'extra-large': '3rem',
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

export interface BlockImageTextBackgroundProps extends DefaultComponentProps {
	heading: string;
	headingType: HeadingTypeOption;
	headingSize: HeadingSizeOption;
	content: string;
	textAlign: AlignOption;
	textPadding: SpacerOption;
	foregroundColor: Color;
	backgroundColor: Color;
	image?: string;
	imageAlignment?: BackgroundAlignOption;
	buttonAction?: ButtonAction;
	buttonAltTitle?: string;
	buttonLabel: string;
	buttonType?: ButtonType;
	buttonIcon?: IconName;
	buttonIconAlignment?: SimpleAlignOption;
	pageWidth?: ContentWidth;
}

export const BlockImageTextBackground: FunctionComponent<BlockImageTextBackgroundProps> = ({
	className,
	heading,
	headingType,
	headingSize,
	content,
	textAlign,
	textPadding,
	foregroundColor,
	backgroundColor,
	image,
	imageAlignment = 'left-screen',
	buttonAction,
	buttonAltTitle,
	buttonLabel,
	buttonType,
	buttonIcon,
	buttonIconAlignment = 'left',
	pageWidth,
}): ReactElement => {
	const computedTextAlign = textAlign || IMAGE_ALIGN_TO_TEXT_ALIGN[imageAlignment];

	const renderHeadingTextAndButton = () => {
		return (
			<>
				{!!heading && (
					<BlockHeading
						className="c-block-image-text-background__heading"
						type={headingType}
						style={{
							fontSize: FONT_SIZE_TO_REM[headingSize],
							padding: TEXT_PADDING_TO_REM[textPadding],
							backgroundColor: backgroundColor,
							textAlign: computedTextAlign,
						}}
					>
						{heading}
					</BlockHeading>
				)}
				{!!content && (
					<p
						className="c-block-image-text-background__content"
						style={{
							padding: TEXT_PADDING_TO_REM[textPadding],
							backgroundColor: backgroundColor,
							textAlign: computedTextAlign,
						}}
					>
						{content}
					</p>
				)}

				{buttonAction &&
					generateSmartLink(
						buttonAction,
						<Button
							className={`c-block-image-text-background__button c-block-image-text-background__button-icon--${buttonIconAlignment}`}
							label={buttonLabel}
							type={buttonType}
							icon={buttonIcon}
							iconPosition={buttonIconAlignment}
							renderIcon={() => (buttonIcon ? <Icon name={buttonIcon} /> : null)}
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
					'c-block-image-text-background__image-wrapper',
					'c-block-image-text-background__image-wrapper--' + imageAlignment
				)}
			/>
		);
	};

	const renderBlockContent = () => {
		if (imageAlignment === 'fill-screen') {
			return (
				<>
					<Container
						className={clsx(
							'c-block-image-text-background__page-wrapper',
							'c-block-image-text-background__page-wrapper--' + computedTextAlign
						)}
						style={{
							color: foregroundColor,
							alignItems: TEXT_ALIGN_TO_FLEX[computedTextAlign],
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
		} else if (imageAlignment === 'left-screen' || imageAlignment === 'right-screen') {
			return (
				<>
					<Container
						className="c-block-image-text-background__page-wrapper"
						style={{ color: foregroundColor }}
						mode="horizontal"
						size={
							pageWidth?.toUpperCase() === ContentWidth.EXTRA_LARGE
								? undefined
								: (pageWidth?.toLowerCase() as 'medium' | 'large')
						}
					>
						<div
							className="c-block-image-text-background__column-text"
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
			imageAlignment === 'left-inside-page' ||
			imageAlignment === 'right-inside-page'
		) {
			return (
				<>
					<Container
						className="c-block-image-text-background__page-wrapper"
						style={{ color: foregroundColor }}
						mode="horizontal"
						size={
							pageWidth?.toUpperCase() === ContentWidth.EXTRA_LARGE
								? undefined
								: (pageWidth?.toLowerCase() as 'medium' | 'large')
						}
					>
						<div
							className="c-block-image-text-background__column-text"
							style={{
								alignItems: TEXT_ALIGN_TO_FLEX[computedTextAlign],
							}}
						>
							{renderHeadingTextAndButton()}
						</div>
						<div className="c-block-image-text-background__column-image">
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
		<article
			className={clsx(
				`c-block-image-text-background c-block-image-text-background--${imageAlignment}`,
				className
			)}
		>
			{renderBlockContent()}
		</article>
	);
};
