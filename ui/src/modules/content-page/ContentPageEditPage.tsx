import type { FC } from 'react';
import { useMatch } from 'react-router';
import { AdminConfigManager } from '~core/config/config.class';
import { ContentPageEdit } from '~modules/content-page/views/ContentPageEdit';
import { useLocation } from '~shared/hooks/useLocation.ts';

export const ContentPageEditPage: FC<{ url?: string }> = ({ url }) => {
	const location = useLocation();
	const editMatch = useMatch<'id', string>(
		AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_EDIT')
	);
	const createMatch = useMatch(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_CREATE'));
	const contentPageId = editMatch?.params.id;

	if (!contentPageId && !createMatch) {
		return null;
	}
	return (
		<ContentPageEdit
			id={contentPageId}
			url={(url || location?.href) as string}
			onGoBack={() => window.history.back()}
		/>
	);
};
