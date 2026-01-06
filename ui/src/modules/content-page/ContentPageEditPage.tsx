import type { FC } from 'react';
import { useMatch } from 'react-router';
import { AdminConfigManager } from '~core/config/config.class';
import { ContentPageEdit } from '~modules/content-page/views/ContentPageEdit';

export const ContentPageEditPage: FC<{ url?: string }> = ({ url }) => {
	const match = useMatch<'id', string>(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_EDIT'));
	const contentPageId = match?.params.id;

	if (!contentPageId) {
		return null;
	}
	return (
		<ContentPageEdit
			id={contentPageId}
			url={url as string}
			onGoBack={() => window.history.back()}
		/>
	);
};
