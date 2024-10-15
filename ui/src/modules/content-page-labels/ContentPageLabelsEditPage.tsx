import type { FC } from 'react';
import type { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router';
import { ContentPageLabelEdit } from '~modules/content-page-labels/views/ContentPageLabelEdit';

const ContentPageLabelsEditPage: FC<RouteComponentProps<{ id: string | undefined }>> = ({
	match,
}) => (
	<ContentPageLabelEdit
		contentPageLabelId={match.params.id}
		onGoBack={() => window.history.back()}
	/>
);

export default withRouter(ContentPageLabelsEditPage);
