import { useSlot } from '@meemoo/react-components';
import React from 'react';

import './AdminLayout.scss';
import {
	AdminActions,
	AdminContent,
	AdminFiltersLeft,
	AdminFiltersRight,
} from './AdminLayout.slots';
import { AdminLayoutComponent } from './AdminLayout.types';

const AdminLayout: AdminLayoutComponent = ({ children, pageTitle }) => {
	const actions = useSlot(AdminActions, children);
	const filtersLeft = useSlot(AdminFiltersLeft, children);
	const filtersRight = useSlot(AdminFiltersRight, children);
	const content = useSlot(AdminContent, children);

	return (
		<div className="c-admin">
			<header className="c-admin__header">
				<h2 className="c-admin__page-title" title={pageTitle}>
					{pageTitle}
				</h2>
				<div className="c-admin__actions">{actions}</div>
			</header>

			<div className="c-admin__filter-bar">
				<div className="c-admin__filter-bar-left">{filtersLeft}</div>
				<div className="c-admin__filter-bar-right">{filtersRight}</div>
			</div>

			<div className="c-admin__content">{content}</div>
		</div>
	);
};

AdminLayout.Actions = AdminActions;
AdminLayout.FiltersLeft = AdminFiltersLeft;
AdminLayout.FiltersRight = AdminFiltersRight;
AdminLayout.Content = AdminContent;

export default AdminLayout;
