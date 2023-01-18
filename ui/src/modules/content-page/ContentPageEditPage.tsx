import { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import ContentPageEdit from '~modules/content-page/views/ContentPageEdit';

const ContentPageEditPage: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageEdit id={match.params.id} />
		</>
	);
};

export default withRouter(ContentPageEditPage);
