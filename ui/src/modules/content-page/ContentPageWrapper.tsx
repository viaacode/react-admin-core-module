import { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import ContentPageRenderer from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';

const ContentPageWrapper: FC<RouteComponentProps<{ path: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageRenderer
				path={'/' + match.params.path}
			/>
		</>
	);
};

export default withRouter(ContentPageWrapper);
