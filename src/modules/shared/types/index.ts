import { CSSProperties } from 'react';

import { User } from 'modules/user/user.types';

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
