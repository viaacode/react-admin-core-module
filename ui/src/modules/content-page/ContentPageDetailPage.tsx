import { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ContentPageDetail from '~modules/content-page/views/ContentPageDetail';
import { mockCommonUser } from '../../mock-common-user';

const ContentPageDetailPage: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageDetail id={match.params.id} commonUser={mockCommonUser} />
		</>
	);
};

export default withRouter(ContentPageDetailPage);
