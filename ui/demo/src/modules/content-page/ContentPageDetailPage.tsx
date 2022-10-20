import { ContentPageDetail } from '~modules/content-page';
import { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

const ContentPageDetailPage: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageDetail id={match.params.id} />
		</>
	);
};

export default withRouter(ContentPageDetailPage);
