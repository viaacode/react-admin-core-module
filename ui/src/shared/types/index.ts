import type { IconName } from '@viaa/avo2-components';
import type { ReactElement, ReactNode } from 'react';

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
