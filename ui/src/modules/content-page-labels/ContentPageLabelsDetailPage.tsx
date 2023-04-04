import { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ContentPageLabelDetail from '~modules/content-page-labels/views/ContentPageLabelDetail';

const ContentPageLabelsDetailPage: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageLabelDetail contentPageLabelId={match.params.id} />
		</>
	);
};

export default withRouter(ContentPageLabelsDetailPage);
