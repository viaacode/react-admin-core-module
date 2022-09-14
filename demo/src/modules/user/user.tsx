import { FC, ReactNode } from 'react';
import { Route } from 'react-router-dom';

import { USER_PATH } from '~modules/shared/consts/user.const';
import { UserOverview } from '~modules/user/views/UserOverview';
import { AdminLayout } from '~modules/shared/layouts';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

const UserOverviewPage: FC = () => {
	const { tHtml } = useTranslation();

	return (
		<AdminLayout pageTitle={tHtml('admin/users/views/user-overview___gebruikers')}>
			<AdminLayout.Content>
				<UserOverview />
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export const renderAdminUserRoutes = (): ReactNode[] => {
	return [
		<Route
			key={USER_PATH.USER_OVERVIEW}
			render={() => <UserOverviewPage />}
			exact
			path={USER_PATH.USER_OVERVIEW}
		/>,
	];
};
