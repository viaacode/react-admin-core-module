import React from 'react';
import { tHtml, tText } from '~shared/helpers/translation-functions.js';
import { AdminLayout } from '~shared/layouts/AdminLayout/AdminLayout.js';

const Dashboard = () => {
	return (
		<AdminLayout pageTitle={tText('admin/dashboard/views/dashboard___dashboard')}>
			<AdminLayout.Content>
				<p>{tHtml('admin/dashboard/views/dashboard___introductie-beheer-dashboard')}</p>
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default Dashboard;
