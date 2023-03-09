import { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ContentPageEdit from '~modules/content-page/views/ContentPageEdit';
import { mockUser } from '../../mock-user';

const ContentPageEditPage: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageEdit id={match.params.id} commonUser={mockUser} />
		</>
	);
};

export default withRouter(ContentPageEditPage);
