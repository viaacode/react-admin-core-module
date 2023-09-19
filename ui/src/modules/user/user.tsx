import type { Avo } from '@viaa/avo2-types';
import { FC, ReactNode } from 'react';
import { Route, useParams } from 'react-router-dom';
import { AdminConfigManager } from '~core/config';
import { UserDetail } from '~modules/user/views';

import { UserOverview } from '~modules/user/views/UserOverview';
import { AdminLayout } from '~shared/layouts';
import { useTranslation } from '~shared/hooks/useTranslation';
import { mockCommonUser } from '../../mock-common-user';

const UserOverviewPage: FC<{ commonUser: Avo.User.CommonUser }> = ({ commonUser }) => {
	const { tText } = useTranslation();

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

	return <UserDetail id={params.id} commonUser={mockCommonUser} />;
};

export const renderAdminUserRoutes = (): ReactNode[] => {
	return [
		<Route
			key={AdminConfigManager.getAdminRoute('USER_OVERVIEW')}
			render={() => <UserOverviewPage commonUser={mockCommonUser} />}
			exact
			path={AdminConfigManager.getAdminRoute('USER_OVERVIEW')}
		/>,
		<Route
			key={AdminConfigManager.getAdminRoute('USER_DETAIL')}
			render={() => <UserDetailPage />}
			exact
			path={AdminConfigManager.getAdminRoute('USER_DETAIL')}
		/>,
	];
};
