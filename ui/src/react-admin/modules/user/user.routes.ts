import { ROUTE_PARTS } from '~modules/shared/consts/routes';

export const USER_PATH = (parts = ROUTE_PARTS) => {
	return {
		USER_OVERVIEW: `/${parts.admin}/${parts.user}`,
		USER_DETAIL: `/${parts.admin}/${parts.user}/:id`,
		USER_EDIT: `/${parts.admin}/${parts.user}/:id/${parts.edit}`,
	};
};
