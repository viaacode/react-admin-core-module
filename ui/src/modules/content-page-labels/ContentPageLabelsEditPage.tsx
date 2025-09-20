import type {FC} from 'react';
import {useMatch} from 'react-router';
import {ContentPageLabelEdit} from '~modules/content-page-labels/views/ContentPageLabelEdit';
import {AdminConfigManager} from '../../client.mjs';

const ContentPageLabelsEditPage: FC = () => {
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

export default ContentPageLabelsEditPage;
