import { RouteComponentProps } from 'react-router-dom';

import { User } from '@admin/user/user.types';

export interface DefaultSecureRouteProps<T = {}> extends RouteComponentProps<T> {
	// technically this type is incorrect, it should be Avo.User.User | undefined
	// But practically it's always Avo.User.User where we need a user and this avoids a shit ton of IF checks
	user: User;
}
