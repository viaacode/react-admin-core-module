import { BlockBreadcrumbsProps } from '~content-blocks/BlockBreadcrumbs/BlockBreadcrumbs.types';
import { FC, useEffect } from 'react';
import { Breadcrumbs } from '@meemoo/react-components';
import { Icon } from '~shared/components';
import { Link } from '~shared/components/Link';

export const BlockBreadcrumbs: FC<BlockBreadcrumbsProps> = ({ foregroundColor, elements }) => {
	useEffect(() => {
		console.log(elements);
	}, [elements]);
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
