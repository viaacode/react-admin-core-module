import type { FC } from 'react';
import type { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router';
import { ContentPageLabelDetail } from '~modules/content-page-labels/views/ContentPageLabelDetail';

const ContentPageLabelsDetailPage: FC<RouteComponentProps<{ id: string }>> = ({ match }) => (
	<ContentPageLabelDetail
		contentPageLabelId={match.params.id}
		onGoBack={() => window.history.back()}
	/>
);

export default withRouter(ContentPageLabelsDetailPage);
