import React from 'react';
import { AdminLayout } from '../../../react-admin/modules/shared/layouts';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

const Dashboard = () => {
	const { t } = useTranslation();

	return (
		<AdminLayout pageTitle={t('Dashboard')}>
			<AdminLayout.Content>
				<p>{t('admin/dashboard/views/dashboard___introductie-beheer-dashboard')}</p>
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default Dashboard;
