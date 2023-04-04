import { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ContentPageLabelEdit from '~modules/content-page-labels/views/ContentPageLabelEdit';

const ContentPageLabelsEditPage: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageLabelEdit contentPageLabelId={match.params.id} />
		</>
	);
};

export default withRouter(ContentPageLabelsEditPage);
