import classnames from 'classnames';
import { FunctionComponent, ReactElement } from 'react';
import { HeadingTypeOption } from '~modules/content-page/types/content-block.types';
import { DefaultComponentProps } from '~modules/shared/types/components';
import { BlockHeading } from '../BlockHeading';
import { ButtonAction } from '@viaa/avo2-components';
import SmartLink from '~modules/shared/components/SmartLink/SmartLink';

export interface BlockMaintainerGridProps extends DefaultComponentProps {
	title: string;
	titleType: HeadingTypeOption;
	subtitle: string;
	buttonLabel: string;
	buttonAction?: ButtonAction;
	maintainers: { imageSrc: string; linkAction?: ButtonAction }[];
}

export const BlockMaintainersGrid: FunctionComponent<BlockMaintainerGridProps> = ({
	className,
	title,
	titleType,
	subtitle,
	buttonLabel,
	buttonAction,
	maintainers,
}): ReactElement => {
	return (
		<article className={classnames('c-block-maintainers-grid', className)}>
			<div className="c-block-maintainers-grid__header">
				<div>
					<BlockHeading className="c-block-maintainers-grid__title" type={titleType}>
						{title}
					</BlockHeading>
					{subtitle && <p>{subtitle}</p>}
				</div>
				{buttonLabel && (
					<div>
						<SmartLink action={buttonAction}>{buttonLabel}</SmartLink>
					</div>
				)}
			</div>
			<ul>
				{maintainers
					.filter((m) => !!m.imageSrc)
					.map((maintainer, index) => {
						return (
							<li
								key={
									maintainer.linkAction?.value +
									'--' +
									maintainer.imageSrc +
									'--' +
									index
								}
							>
								<SmartLink action={maintainer.linkAction}>
									<img
										src={maintainer.imageSrc}
										alt={'Maintainer logo link'}
										className="c-block-maintainers-grid__image"
									></img>
								</SmartLink>
							</li>
						);
					})}
			</ul>
		</article>
	);
};
