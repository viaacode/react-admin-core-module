import { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { AdminConfigManager } from '~core/config';
import ContentPageRenderer from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';

const ContentPageWrapper: FC<RouteComponentProps<{ path: string }>> = ({ match }) => {
	return (
		<>
			<ContentPageRenderer
				path={'/' + match.params.path}
				userGroupId={AdminConfigManager.getConfig().user?.userGroup?.id}
			/>
		</>
	);
};

export default withRouter(ContentPageWrapper);
