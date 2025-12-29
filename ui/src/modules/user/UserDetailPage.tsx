import type { FC } from 'react';
import { useMatch } from 'react-router';
import { AdminConfigManager } from '~core/config/config.class';
import { UserDetail } from '~modules/user/views/UserDetail';
import { getMockCommonUser } from '../../mock-common-user';

export const UserDetailPage: FC = () => {
	const match = useMatch<'id', string>(AdminConfigManager.getAdminRoute('ADMIN_USER_DETAIL'));
	const userId = match?.params.id;

	if (!userId) {
		return null;
	}
	return (
		<UserDetail
			id={userId}
			commonUser={getMockCommonUser()}
			onGoBack={() => window.history.back()}
		/>
	);
};
