import type { FC } from 'react';
import { useMatch } from 'react-router';
import { AdminConfigManager } from '~core/config/config.class';
import { ContentPageDetail } from '~modules/content-page/views/ContentPageDetail';
import { getMockCommonUser } from '../../mock-common-user';

export const ContentPageDetailPage: FC = () => {
	const match = useMatch<'id', string>(
		AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_DETAIL')
	);
	const contentPageId = match?.params.id;

	if (!contentPageId) {
		return null;
	}
	return (
		<>
			<ContentPageDetail
				id={contentPageId}
				commonUser={getMockCommonUser()}
				onGoBack={() => window.history.back()}
			/>
		</>
	);
};
