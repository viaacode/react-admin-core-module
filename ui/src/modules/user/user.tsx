import type {FC, ReactNode} from 'react';
import {useMatch} from 'react-router';
import {Route} from 'react-router-dom';
import {AdminConfigManager} from '~core/config';
import {UserDetail} from '~modules/user/views';
import {UserOverview} from '~modules/user/views/UserOverview';
import {tText} from '~shared/helpers/translation-functions';
import {AdminLayout} from '~shared/layouts';
import {mockCommonUser} from '../../mock-common-user';

const UserOverviewPage: FC = () => {
	return (
		<AdminLayout pageTitle={tText('admin/users/views/user-overview___gebruikers')}>
			<AdminLayout.Content>
				<UserOverview />
			</AdminLayout.Content>
		</AdminLayout>
	);
};

const UserDetailPage: FC = () => {
	const match = useMatch<'id', string>(AdminConfigManager.getAdminRoute('ADMIN_USER_DETAIL'));
	const userId = match?.params.id;

	if (!userId) {
		return null;
	}
	return (
		<UserDetail id={userId} commonUser={mockCommonUser} onGoBack={() => window.history.back()} />
	);
};

export const renderAdminUserRoutes = (): ReactNode[] => {
	return [
		<Route
			key={AdminConfigManager.getAdminRoute('ADMIN_USER_OVERVIEW')}
			Component={UserOverviewPage}
			path={AdminConfigManager.getAdminRoute('ADMIN_USER_OVERVIEW')}
		/>,
		<Route
			key={AdminConfigManager.getAdminRoute('ADMIN_USER_DETAIL')}
			Component={UserDetailPage}
			path={AdminConfigManager.getAdminRoute('ADMIN_USER_DETAIL')}
		/>,
	];
};
