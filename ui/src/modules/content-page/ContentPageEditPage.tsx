import { ContentPageEdit } from '~modules/content-page';
import { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

const ContentPageEditPage: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageEdit id={match.params.id} />
		</>
	);
};

export default withRouter(ContentPageEditPage);
