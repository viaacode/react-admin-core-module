import type { FC } from 'react';
import type { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router';
import { ContentPageEdit } from '~modules/content-page/views/ContentPageEdit';
import { mockCommonUser } from '../../mock-common-user';

const ContentPageEditPage: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageEdit
				id={match.params.id}
				commonUser={mockCommonUser}
				onGoBack={() => window.history.back()}
			/>
		</>
	);
};

export default withRouter(ContentPageEditPage);
