import React, { FC } from 'react';

import { RouteComponentProps, withRouter } from 'react-router';
import { NavigationEdit } from '~modules/navigation/views';

const NavigationEditPage: FC<
	RouteComponentProps<{ navigationItemId: string; navigationBarId: string }>
> = ({ match }) => {
	const { navigationBarId, navigationItemId } = match.params;

	return <NavigationEdit navigationBarId={navigationBarId} navigationItemId={navigationItemId} />;
};

export default withRouter(NavigationEditPage);
