import { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ContentPageDetail from '~modules/content-page/views/ContentPageDetail';
import { mockUser } from '../../mock-user';

const ContentPageDetailPage: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageDetail id={match.params.id} commonUser={mockUser} />
		</>
	);
};

export default withRouter(ContentPageDetailPage);
