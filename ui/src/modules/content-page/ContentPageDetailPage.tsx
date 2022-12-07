import { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ContentPageDetail from '~modules/content-page/views/ContentPageDetail';

const ContentPageDetailPage: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageDetail id={match.params.id} />
		</>
	);
};

export default withRouter(ContentPageDetailPage);
