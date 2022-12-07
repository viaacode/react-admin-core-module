import React from 'react';
import { AdminLayout } from '../../../react-admin/modules/shared/layouts';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

const Dashboard = () => {
	const { tHtml, tText } = useTranslation();

	return (
		<AdminLayout pageTitle={tText('admin/dashboard/views/dashboard___dashboard')}>
			<AdminLayout.Content>
				<p>{tHtml('admin/dashboard/views/dashboard___introductie-beheer-dashboard')}</p>
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default Dashboard;
