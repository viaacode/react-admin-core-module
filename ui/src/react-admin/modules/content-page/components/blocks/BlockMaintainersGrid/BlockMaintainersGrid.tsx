import type { ButtonAction } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import clsx from 'clsx';
import type { FunctionComponent, ReactElement } from 'react';
import { useGetMaintainerGrid } from '~content-blocks/BlockMaintainersGrid/hooks/useGetMaintainerGrid';
import type { HeadingTypeOption } from '~modules/content-page/types/content-block.types';
import { SmartLink } from '~modules/shared/components/SmartLink/SmartLink';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { tText } from '~shared/helpers/translation-functions.ts';
import { BlockHeading } from '../BlockHeading/BlockHeading';

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
									type: AvoCoreContentPickerType.EXTERNAL_LINK,
									value: maintainer.homepageUrl,
								}}
								ariaLabel={tText(
									'modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___ga-naar-aanbieder-maintainer-name',
									{
										maintainerName: maintainer.name,
									}
								)}
							>
								<img
									src={maintainer.logoUrl}
									alt=""
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
