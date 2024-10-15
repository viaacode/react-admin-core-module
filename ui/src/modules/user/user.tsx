import type { Avo } from '@viaa/avo2-types';
import type { FC, ReactNode } from 'react';
import { Route, useParams } from 'react-router-dom';
import { AdminConfigManager } from '~core/config';
import { UserDetail } from '~modules/user/views';

import { UserOverview } from '~modules/user/views/UserOverview';
import { AdminLayout } from '~shared/layouts';
import { tText } from '~shared/helpers/translation-functions';
import { mockCommonUser } from '../../mock-common-user';

const UserOverviewPage: FC<{ commonUser: Avo.User.CommonUser }> = ({ commonUser }) => {
	return (
		<AdminLayout pageTitle={tText('admin/users/views/user-overview___gebruikers')}>
			<AdminLayout.Content>
				<UserOverview commonUser={commonUser} />
			</AdminLayout.Content>
		</AdminLayout>
	);
};

const UserDetailPage: FC = () => {
	const params = useParams<{ id: string }>();

	return (
		<UserDetail
			id={params.id}
			commonUser={mockCommonUser}
			onGoBack={() => window.history.back()}
		/>
	);
};

export const renderAdminUserRoutes = (): ReactNode[] => {
	return [
		<Route
			key={AdminConfigManager.getAdminRoute('ADMIN_USER_OVERVIEW')}
			render={() => <UserOverviewPage commonUser={mockCommonUser} />}
			exact
			path={AdminConfigManager.getAdminRoute('ADMIN_USER_OVERVIEW')}
		/>,
		<Route
			key={AdminConfigManager.getAdminRoute('ADMIN_USER_DETAIL')}
			render={() => <UserDetailPage />}
			exact
			path={AdminConfigManager.getAdminRoute('ADMIN_USER_DETAIL')}
		/>,
	];
};
