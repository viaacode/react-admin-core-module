import classnames from 'classnames';
import { FunctionComponent, ReactElement, ReactNode } from 'react';
import { DefaultComponentProps } from '~modules/shared/types/components';

export interface BlockCardWithoutDescriptionProps {
	title: string;
	// ToDo(Silke): add image & style
}

export interface BlockCardsWithoutDescriptionProps extends DefaultComponentProps {
	elements: BlockCardWithoutDescriptionProps[];
}

export const BlockCardsWithoutDescription: FunctionComponent<BlockCardsWithoutDescriptionProps> = ({
	className,
	elements,
}): ReactElement => {
	console.log({ elements });

	const renderCard = ({ title }: BlockCardWithoutDescriptionProps, i: number): ReactElement => (
		<article className="c-block-card-without-description__card">{title}</article>
	);

	return (
		<div className={classnames('c-block-card-without-description', className)}>
			{elements.map(
				(card: BlockCardWithoutDescriptionProps, i: number): ReactNode =>
					renderCard(card, i)
			)}
		</div>
	);
};
