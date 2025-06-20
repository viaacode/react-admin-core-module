import { useSlot } from '@meemoo/react-components';
import React from 'react';

import './AdminLayout.scss';
import {
	AdminActions,
	AdminBack,
	AdminContent,
	AdminFiltersLeft,
	AdminFiltersRight,
} from './AdminLayout.slots';
import type { AdminLayoutComponent } from './AdminLayout.types';

export const AdminLayout: AdminLayoutComponent = ({ children, pageTitle, className }) => {
	const actions = useSlot(AdminActions, children);
	const back = useSlot(AdminBack, children);
	const content = useSlot(AdminContent, children);
	const filtersLeft = useSlot(AdminFiltersLeft, children);
	const filtersRight = useSlot(AdminFiltersRight, children);

	return (
		<div className={`c-admin${` ${className}`}`}>
			<header className="c-admin__header">
				<div className="c-admin__back">{back}</div>
				<h2 className="c-admin__page-title">{pageTitle}</h2>
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
AdminLayout.Back = AdminBack;
AdminLayout.Content = AdminContent;
AdminLayout.FiltersLeft = AdminFiltersLeft;
AdminLayout.FiltersRight = AdminFiltersRight;
