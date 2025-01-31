import clsx from 'clsx';
import type { FunctionComponent, ReactElement } from 'react';
import type { HeadingTypeOption } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { BlockHeading } from '../BlockHeading';
import type { ButtonAction } from '@viaa/avo2-components';
import { SmartLink } from '~modules/shared/components/SmartLink/SmartLink';
import { useGetMaintainerGrid } from '~content-blocks/BlockMaintainersGrid/hooks/useGetMaintainerGrid';

export interface BlockMaintainerGridProps extends DefaultComponentProps {
	title: string;
	titleType: HeadingTypeOption;
	subtitle: string;
	buttonLabel: string;
	buttonAction?: ButtonAction;
	visibleItems: number;
	maintainers: { imageSrc: string; linkAction?: ButtonAction }[];
}

export const BlockMaintainersGrid: FunctionComponent<BlockMaintainerGridProps> = ({
	className,
	title,
	titleType,
	subtitle,
	buttonLabel,
	buttonAction,
	visibleItems,
}): ReactElement => {
	const { data } = useGetMaintainerGrid(visibleItems) || { data: [] };
	return (
		<article className={clsx('c-block-maintainers-grid', className)}>
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
				{data?.map((maintainer, index) => {
					return (
						<li key={`${maintainer.homepageUrl}-${maintainer.logoUrl}-${index}`}>
							<SmartLink
								action={{
									type: 'EXTERNAL_LINK',
									value: maintainer.homepageUrl,
								}}
							>
								<img
									src={maintainer.logoUrl}
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
