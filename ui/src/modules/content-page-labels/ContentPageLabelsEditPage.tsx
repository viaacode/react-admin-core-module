import type { FC } from 'react';
import { useMatch } from 'react-router';
import { AdminConfigManager } from '~core/config/config.class';
import { ContentPageLabelEdit } from '~modules/content-page-labels/views/ContentPageLabelEdit';

export const ContentPageLabelsEditPage: FC = () => {
	const match = useMatch<'id', string>(
		AdminConfigManager.getConfig().routes.ADMIN_CONTENT_PAGE_LABEL_EDIT
	);

	return (
		<ContentPageLabelEdit
			contentPageLabelId={match?.params.id}
			onGoBack={() => window.history.back()}
		/>
	);
};
