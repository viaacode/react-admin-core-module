import { Breadcrumbs } from '@meemoo/react-components';
import type { FC } from 'react';
import type { BlockBreadcrumbsProps } from '~content-blocks/BlockBreadcrumbs/BlockBreadcrumbs.types';
import { Icon } from '~shared/components';
import { Link } from '~shared/components/Link';

export const BlockBreadcrumbs: FC<BlockBreadcrumbsProps> = ({ foregroundColor, elements }) => {
	return (
		<Breadcrumbs
			icon={<Icon name="angleRight" />}
			items={elements.map((breadCrumb: any) => {
				return {
					label: breadCrumb.label,
					to: breadCrumb?.link?.value || '',
				};
			})}
			linkComponent={({ href, ...props }) => <Link {...props} to={href} />}
			foregroundColor={foregroundColor}
		/>
	);
};
