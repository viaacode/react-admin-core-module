import type { FC } from 'react';
import { useMatch } from 'react-router';
import { AdminConfigManager } from '~core/config/config.class.js';
import { ContentPageEdit } from '~modules/content-page/views/ContentPageEdit.js';
import { mockCommonUser } from '../../mock-common-user.js';

export const ContentPageEditPage: FC = () => {
	const match = useMatch<'id', string>(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_EDIT'));
	const contentPageId = match?.params.id;

	if (!contentPageId) {
		return null;
	}
	return (
		<>
			<ContentPageEdit
				id={contentPageId}
				commonUser={mockCommonUser}
				onGoBack={() => window.history.back()}
			/>
		</>
	);
};
