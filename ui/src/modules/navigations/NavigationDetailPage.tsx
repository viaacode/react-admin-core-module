import React, { FC } from 'react';

import { RouteComponentProps, withRouter } from 'react-router';
import { NavigationBarDetail } from '~modules/navigation/views';

const NavigationDetailPage: FC<RouteComponentProps<{ navigationBarId: string }>> = ({ match }) => {
	const navigationBarId = match.params.navigationBarId;

	return <NavigationBarDetail navigationBarId={navigationBarId} />;
};

export default withRouter(NavigationDetailPage);
