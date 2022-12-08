import { FC } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { AdminConfigManager } from '~core/config';
import ContentPage from '~modules/content-page/components/ContentPage/ContentPage';

const ContentPageWrapper: FC<RouteComponentProps<{ path: string }>> = ({ match }) => {
	return (
		<>
			<ContentPage
				path={'/' + match.params.path}
				userGroupId={AdminConfigManager.getConfig().user?.userGroup?.id}
			/>
		</>
	);
};

export default withRouter(ContentPageWrapper);
