import { CSSProperties } from 'react';
import { App } from '~modules/translations/translations.core.types';

export type ReactSelectOption<T = any> = {
	label: string;
	value: T;
};

export const AVO = App.AVO;
export const HET_ARCHIEF = App.HET_ARCHIEF;

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
	GET_NAVIGATION_BAR_ITEMS = 'GET_NAVIGATION_BAR_ITEMS',
	GET_NAVIGATIONS = 'GET_NAVIGATIONS',
	GET_IDPS = 'GET_IDPS',
	GET_ALL_ALERTS = 'GET_ALL_ALERTS',
	GET_MAINTAINERS_BY_CONTENT = 'GET_MAINTAINERS_BY_CONTENT',
	GET_VIDEO_STILLS_FOR_CONTENT_ITEM = 'GET_VIDEO_STILLS_FOR_CONTENT_ITEM',
	GET_ALL_TRANSLATIONS = 'GET_ALL_TRANSLATIONS',
	GET_ALL_LANGUAGES = 'GET_ALL_LANGUAGES',
}
