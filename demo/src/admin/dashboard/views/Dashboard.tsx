import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { AdminLayout } from '../../../react-admin/modules/shared/layouts';

const Dashboard = () => {
	const [t] = useTranslation();

	return (
		<AdminLayout pageTitle={t('Dashboard')}>
			<AdminLayout.Content>
				<p>
					<Trans i18nKey="admin/dashboard/views/dashboard___introductie-beheer-dashboard">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam ducimus odio
						sunt quidem, sint libero corporis natus hic dolor omnis veniam laborum,
						aliquid enim dolorum laudantium delectus obcaecati rem. Mollitia?
					</Trans>
				</p>
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default Dashboard;
