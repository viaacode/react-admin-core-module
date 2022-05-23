import React, { FC } from 'react';

import { RouteComponentProps, withRouter } from 'react-router';
import { NavigationDetail } from '~modules/navigation/views';

const NavigationDetailPage: FC<RouteComponentProps<{ navigationBarId: string }>> = ({ match }) => {
	const navigationBarId = match.params.navigationBarId;

	return <NavigationDetail navigationBarId={navigationBarId} />;
};

export default withRouter(NavigationDetailPage);
