import type { ButtonAction } from '@viaa/avo2-components';
import { Image } from '@viaa/avo2-components';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import type { FunctionComponent, ReactElement, ReactNode } from 'react';
import { BlockHeading } from '~content-blocks/BlockHeading/BlockHeading.js';
import type { HeadingTypeOption } from '~modules/content-page/types/content-block.types.js';
import { SmartLink } from '~modules/shared/components/SmartLink/SmartLink.js';
import type { DefaultComponentProps } from '~modules/shared/types/components.js';
import { Icon } from '~shared/components/Icon/Icon.js';

export interface BlockClickableTilesProps {
	title: string;
	titleType: HeadingTypeOption;
	image: string;
	link?: ButtonAction;
}

export interface BlockThreeClickableTilesProps extends DefaultComponentProps {
	elements: BlockClickableTilesProps[];
}

export const BlockThreeClickableTiles: FunctionComponent<BlockThreeClickableTilesProps> = ({
	className,
	elements,
}): ReactElement => {
	const renderTile = ({ image, title, titleType }: BlockClickableTilesProps, i: number) => (
		<article
			key={`c-block-three-clickable-tiles-${i}`}
			className="c-block-three-clickable-tiles__tile"
		>
			<Image src={image} alt={title} className="c-block-three-clickable-tiles__image" />
			<div className="c-block-three-clickable-tiles__content">
				{title && titleType && (
					<BlockHeading
						className="c-block-three-clickable-tiles__title u-text-ellipsis--2"
						type={titleType}
					>
						{title}
					</BlockHeading>
				)}
				<div className="c-block-three-clickable-tiles__icon">
					<Icon name="arrowRight" />
				</div>
			</div>
		</article>
	);

	return (
		<div className={clsx('c-block-three-clickable-tiles', className)}>
			{elements.map(
				(tile: BlockClickableTilesProps, i: number): ReactNode =>
					isNil(tile?.link) ? (
						renderTile(tile, i)
					) : (
						<SmartLink
							// biome-ignore lint/suspicious/noArrayIndexKey: We don't have a better key at this time
							key={`c-block-three-clickable-tiles-${i}`}
							className="c-block-three-clickable-tiles__link"
							action={tile.link}
						>
							{renderTile(tile, i)}
						</SmartLink>
					)
			)}
		</div>
	);
};
