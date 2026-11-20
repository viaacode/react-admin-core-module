import type { ButtonAction } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent, ReactElement, ReactNode } from 'react';
import type { CardWithoutDescriptionStyleOption } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { OptimizedImage } from '~shared/components/OptimizedImage/OptimizedImage';
import { SmartLink } from '~shared/components/SmartLink/SmartLink';

// The image is a 15.2rem circle or square
const IMAGE_DISPLAY_WIDTH = 152;

export interface BlockCardWithoutDescriptionProps {
	title: string;
	image?: string;
	style: CardWithoutDescriptionStyleOption;
	textColor: string;
	backgroundColor: string;
	linkAction?: ButtonAction;
}

export interface BlockCardsWithoutDescriptionProps extends DefaultComponentProps {
	elements: BlockCardWithoutDescriptionProps[];
}

export const BlockCardsWithoutDescription: FunctionComponent<BlockCardsWithoutDescriptionProps> = ({
	className,
	elements,
}): ReactElement => {
	const renderCardContent = ({
		title,
		style,
		image,
		backgroundColor,
		textColor,
	}: BlockCardWithoutDescriptionProps) => {
		return (
			<>
				<p
					style={{ color: textColor, backgroundColor }}
					className="c-block-cards-without-description__title"
				>
					{title}
				</p>
				{image && (
					<OptimizedImage
						src={image}
						displayWidth={IMAGE_DISPLAY_WIDTH}
						alt=""
						className={`c-block-cards-without-description__image c-block-cards-without-description__image--${style}`}
					/>
				)}
			</>
		);
	};

	const renderCard = (
		{ linkAction, ...props }: BlockCardWithoutDescriptionProps,
		i: number
	): ReactElement => {
		if (linkAction) {
			return (
				<SmartLink
					action={linkAction}
					className="c-block-cards-without-description__card"
					key={`c-block-cards-without-description__card--${i}`}
				>
					{renderCardContent(props)}
				</SmartLink>
			);
		}
		return (
			<div
				className="c-block-cards-without-description__card"
				key={`c-block-cards-without-description__card--${i}`}
			>
				{renderCardContent(props)}
			</div>
		);
	};

	return (
		<div className={clsx('c-block-cards-without-description', className)}>
			<div className="c-block-cards-without-description__elements-wrapper">
				{elements.map(
					(card: BlockCardWithoutDescriptionProps, i: number): ReactNode => renderCard(card, i)
				)}
			</div>
		</div>
	);
};
