import type { FC } from 'react';
import { UserOverview } from '~modules/user/views';
import { tText } from '~shared/helpers/translation-functions';
import { AdminLayout } from '~shared/layouts';

export const UserOverviewPage: FC = () => {
	return (
		<AdminLayout pageTitle={tText('admin/users/views/user-overview___gebruikers')}>
			<AdminLayout.Content>
				<UserOverview />
			</AdminLayout.Content>
		</AdminLayout>
	);
};
