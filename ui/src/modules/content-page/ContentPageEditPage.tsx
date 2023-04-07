import { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ContentPageEdit from '~modules/content-page/views/ContentPageEdit';
import { mockCommonUser } from '../../mock-common-user';

const ContentPageEditPage: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageEdit id={match.params.id} commonUser={mockCommonUser} />
		</>
	);
};

export default withRouter(ContentPageEditPage);
