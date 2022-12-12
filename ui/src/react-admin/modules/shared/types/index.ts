import { CSSProperties } from 'react';

export type ReactSelectOption<T = any> = {
	label: string;
	value: T;
};

export enum DatabaseType {
	avo = 'avo',
	hetArchief = 'hetArchief',
}

export const AVO = DatabaseType.avo;
export const HET_ARCHIEF = DatabaseType.hetArchief;

// Get all possible values from object
export type ValueOf<T> = T[keyof T];

export interface DefaultComponentProps {
	className?: string;
	style?: CSSProperties;
}

export enum OrderDirection {
	asc = 'asc',
	desc = 'desc',
}
