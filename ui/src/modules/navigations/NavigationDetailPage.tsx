import type { FC } from 'react';
import React from 'react';

import type { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router';
import { NavigationBarDetail } from '~modules/navigation/views';

const NavigationDetailPage: FC<RouteComponentProps<{ navigationBarId: string }>> = ({ match }) => {
	const navigationBarId = match.params.navigationBarId;

	return (
		<NavigationBarDetail navigationBarId={navigationBarId} onGoBack={() => window.history.back()} />
	);
};

export default withRouter(NavigationDetailPage);
