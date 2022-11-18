import { CSSProperties } from 'react';

export type ReactSelectOption<T = any> = {
	label: string;
	value: T;
};

export enum AvoOrHetArchief {
	avo = 'avo',
	hetArchief = 'hetArchief',
}

export const AVO = AvoOrHetArchief.avo;
export const HET_ARCHIEF = AvoOrHetArchief.hetArchief;

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
