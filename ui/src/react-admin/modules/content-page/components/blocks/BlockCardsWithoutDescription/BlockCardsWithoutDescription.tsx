import { Image } from '@viaa/avo2-components';
import classnames from 'classnames';
import { FunctionComponent, ReactElement, ReactNode } from 'react';
import { CardWithoutDescriptionStyleOption } from '~modules/content-page/types/content-block.types';
import { DefaultComponentProps } from '~modules/shared/types/components';

export interface BlockCardWithoutDescriptionProps {
	title: string;
	image?: string;
	style: CardWithoutDescriptionStyleOption;
	textColor: string;
	backgroundColor: string;
}

export interface BlockCardsWithoutDescriptionProps extends DefaultComponentProps {
	elements: BlockCardWithoutDescriptionProps[];
}

export const BlockCardsWithoutDescription: FunctionComponent<BlockCardsWithoutDescriptionProps> = ({
	className,
	elements,
}): ReactElement => {
	const renderCard = (
		{ title, style, image, backgroundColor, textColor }: BlockCardWithoutDescriptionProps,
		i: number
	): ReactElement => (
		<div
			className="c-block-cards-without-description__card"
			key={`c-block-cards-without-description__card--${i}`}
		>
			<p
				style={{ color: textColor, backgroundColor }}
				className="c-block-cards-without-description__title"
			>
				{title}
			</p>
			{image && (
				<Image
					src={image}
					alt={title}
					className={`c-block-cards-without-description__image c-block-cards-without-description__image--${style}`}
				/>
			)}
		</div>
	);

	return (
		<div className={classnames('c-block-cards-without-description', className)}>
			{elements.map(
				(card: BlockCardWithoutDescriptionProps, i: number): ReactNode =>
					renderCard(card, i)
			)}
		</div>
	);
};
