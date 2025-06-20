import type { FC } from "react";
import React from "react";

import type { RouteComponentProps } from "react-router";
import { withRouter } from "react-router";
import { NavigationItemEdit } from "~modules/navigation/views";

const NavigationEditPage: FC<
	RouteComponentProps<{ navigationItemId: string; navigationBarId: string }>
> = ({ match }) => {
	const { navigationBarId, navigationItemId } = match.params;

	return (
		<NavigationItemEdit
			navigationBarId={navigationBarId}
			navigationItemId={navigationItemId}
			onGoBack={() => window.history.back()}
		/>
	);
};

export default withRouter(NavigationEditPage);
