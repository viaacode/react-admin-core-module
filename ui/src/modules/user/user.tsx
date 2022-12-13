import { FC, ReactNode } from 'react';
import { Route, useParams } from 'react-router-dom';
import { UserDetail, UserEdit } from '~modules/user/views';

import { UserOverview } from '~modules/user/views/UserOverview';
import { AdminLayout } from '~modules/shared/layouts';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { USER_PATH } from '~modules/user/user.routes';

const UserOverviewPage: FC = () => {
	const { tText } = useTranslation();

	return (
		<AdminLayout pageTitle={tText('admin/users/views/user-overview___gebruikers')}>
			<AdminLayout.Content>
				<UserOverview />
			</AdminLayout.Content>
		</AdminLayout>
	);
};

const UserEditPage: FC = () => {
	const params = useParams<{ id: string }>();

	return <UserEdit id={params.id} />;
};

const UserDetailPage: FC = () => {
	const params = useParams<{ id: string }>();

	return <UserDetail id={params.id} />;
};

export const renderAdminUserRoutes = (): ReactNode[] => {
	return [
		<Route
			key={USER_PATH().USER_OVERVIEW}
			render={() => <UserOverviewPage />}
			exact
			path={USER_PATH().USER_OVERVIEW}
		/>,
		<Route
			key={USER_PATH().USER_DETAIL}
			render={() => <UserDetailPage />}
			exact
			path={USER_PATH().USER_DETAIL}
		/>,
		<Route
			key={USER_PATH().USER_EDIT}
			render={() => <UserEditPage />}
			exact
			path={USER_PATH().USER_EDIT}
		/>,
	];
};
