import type { FC } from 'react';
import type { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router';
import { ContentPageDetail } from '~modules/content-page/views/ContentPageDetail';
import { getMockCommonUser } from '../../mock-common-user';

const ContentPageDetailPage: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageDetail
				id={match.params.id}
				commonUser={getMockCommonUser()}
				onGoBack={() => window.history.back()}
			/>
		</>
	);
};

export default withRouter(ContentPageDetailPage);
