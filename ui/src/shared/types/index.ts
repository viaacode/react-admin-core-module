import { ReactElement, ReactNode } from 'react';

import { IconName } from '@viaa/avo2-components';

export type NavigationItemInfo = {
	label: string | ReactNode;
	key: string;
	location?: string;
	exact?: boolean;
	target?: string;
	component?: ReactElement;
	icon?: IconName;
	subLinks?: NavigationItemInfo[];
	tooltip?: string;
};

export enum QUERY_KEYS {
	GET_CONTENT_PAGE_OVERVIEW = 'GET_CONTENT_PAGE_OVERVIEW',
	GET_CONTENT_PAGE_BY_PATH = 'GET_CONTENT_PAGE_BY_PATH',
	GET_ALL_PERMISSIONS = 'GET_ALL_PERMISSIONS',
	GET_PROFILES = 'GET_PROFILES',
}
