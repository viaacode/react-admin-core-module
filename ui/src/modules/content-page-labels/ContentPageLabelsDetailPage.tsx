import type { FC } from 'react';
import { useMatch } from 'react-router';
import { AdminConfigManager } from '~core/config/config.class';
import { ContentPageLabelDetail } from '~modules/content-page-labels/views/ContentPageLabelDetail';

export const ContentPageLabelsDetailPage: FC = () => {
	const match = useMatch(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_DETAIL'));
	const contentPageLabelId = match?.params.id;

	if (!contentPageLabelId) {
		return null;
	}
	return (
		<ContentPageLabelDetail
			contentPageLabelId={contentPageLabelId}
			onGoBack={() => window.history.back()}
		/>
	);
};
