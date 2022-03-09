import React, { FC } from 'react';

import { AdminLayoutProps } from './AdminLayout.types';

const AdminLayout: FC<AdminLayoutProps> = ({ children, pageTitle }) => {
	return (
		<div className="l-admin-layout">
			<h1 className="l-admin-layout__title">{pageTitle}</h1>
			{children}
		</div>
	);
};

export default AdminLayout;
