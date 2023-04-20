import { ButtonAction } from '@viaa/avo2-components';
import classnames from 'classnames';
import { isNil } from 'lodash-es';
import { FunctionComponent, ReactElement, ReactNode } from 'react';
import { Icon } from '~modules/shared/components';
import SmartLink from '~modules/shared/components/SmartLink/SmartLink';
import { DefaultComponentProps } from '~modules/shared/types/components';

export interface BlockClickableTilesProps {
	subtitle: string;
	imgSource: string;
	link?: ButtonAction;
}

export interface BlockThreeClickableTilesProps extends DefaultComponentProps {
	elements: BlockClickableTilesProps[];
}

export const BlockThreeClickableTiles: FunctionComponent<BlockThreeClickableTilesProps> = ({
	className,
	elements,
}): ReactElement => {
	const renderTile = (
		link: ButtonAction | undefined,
		subtitle: string,
		imgSource: string,
		i: number
	): ReactElement => {
		const element = (
			<div className="c-block-three-clickable-tiles__tile">
				<div
					className="c-block-three-clickable-tiles__tile-image"
					style={{
						backgroundImage: `url('${imgSource}')`,
					}}
				/>
				<div className="c-block-three-clickable-tiles__tile-subtitle">
					<h5 className="u-text-ellipsis--2">{subtitle}</h5>
					<Icon name="arrowRight" />
				</div>
			</div>
		);
		return !isNil(link) ? (
			<SmartLink
				key={`c-block-three-clickable-tiles-${i}`}
				className="c-block-three-clickable-tiles__term c-block-three-clickable-tiles__link"
				action={link}
			>
				{element}
			</SmartLink>
		) : (
			<div
				key={`c-block-three-clickable-tiles-${i}`}
				className="c-block-three-clickable-tiles__term"
			>
				{element}
			</div>
		);
	};

	return (
		<div className={classnames('c-block-three-clickable-tiles', className)}>
			{elements.map(
				({ link, subtitle, imgSource }: BlockClickableTilesProps, i: number): ReactNode =>
					renderTile(link, subtitle, imgSource, i)
			)}
		</div>
	);
};
