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

export enum QUERY_KEYS {
	GET_CONTENT_PAGE_OVERVIEW = 'GET_CONTENT_PAGE_OVERVIEW',
	GET_CONTENT_PAGE_BY_PATH = 'GET_CONTENT_PAGE_BY_PATH',
	GET_ALL_PERMISSIONS = 'GET_ALL_PERMISSIONS',
	GET_PROFILES = 'GET_PROFILES',
	GET_PROFILE_BY_ID = 'GET_PROFILE_BY_ID',
	GET_USER_GROUPS_WITH_PERMISSIONS = 'GET_USER_GROUPS_WITH_PERMISSIONS',
	GET_USER_GROUPS = 'GET_USER_GROUPS',
	GET_NAVIGATION_ITEM = 'GET_NAVIGATION_ITEM',
	GET_NAVIGATIONS = 'GET_NAVIGATIONS',
	GET_IDPS = 'GET_IDPS',
}
