import { Breadcrumbs } from '@meemoo/react-components';
import type { FC } from 'react';
import type {
	BlockBreadcrumbsProps,
	BreadCrumb,
} from '~content-blocks/BlockBreadcrumbs/BlockBreadcrumbs.types.js';
import { Icon } from '~shared/components/Icon/Icon.js';
import { Link } from '~shared/components/Link/Link.js';

export const BlockBreadcrumbs: FC<BlockBreadcrumbsProps> = ({ foregroundColor, elements }) => {
	return (
		<Breadcrumbs
			icon={<Icon name="angleRight" />}
			items={elements.map((breadCrumb: BreadCrumb) => {
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
