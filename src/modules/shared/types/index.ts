import { IconName } from '@viaa/avo2-components';
import { CSSProperties, ReactElement } from 'react';

import { User } from '~modules/user/user.types';

export type ReactSelectOption<T = any> = {
	label: string;
	value: T;
};

export interface UserProps {
	user: User | undefined;
}

export enum AvoOrHetArchief {
	avo = 'avo',
	hetArchief = 'hetArchief',
}

// Get all possible values from object
export type ValueOf<T> = T[keyof T];

export interface DefaultComponentProps {
	className?: string;
	style?: CSSProperties;
}

export type NavigationItemInfo = {
	label: string | ReactElement;
	key: string;
	location?: string;
	exact?: boolean;
	target?: string;
	component?: ReactElement;
	icon?: IconName;
	subLinks?: NavigationItemInfo[];
	tooltip?: string;
};
