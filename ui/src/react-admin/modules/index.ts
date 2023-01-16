import { AdminConfigManager } from '~core/config/config.class';

// Admin Core
export { ROUTE_PARTS } from '~modules/shared';
export type { AdminConfig } from '~core/config/config.types';
export { AdminConfigManager };
export {
	fetchWithLogoutJson,
	fetchWithLogout,
	goToLoginBecauseOfUnauthorizedError,
} from '../modules/shared/helpers/fetch-with-logout';

// Content pages
export { default as ContentPageOverview } from './content-page/views/ContentPageOverview';
export { default as ContentPageDetail } from './content-page/views/ContentPageDetail';
export { default as ContentPageEdit } from '~modules/content-page/views/ContentPageEdit';
export { default as ContentPageRenderer } from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
export type { ColorOption } from './content-page/components/fields/ColorSelect/ColorSelect';
export type { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
export type { DbContentPage } from '~modules/content-page/types/content-pages.types';
export type { ContentPageLabel } from '~modules/content-page/types/content-pages.types';
export type { ContentPageOverviewParams } from '~modules/content-page/components/wrappers/PageOverviewWrapper/PageOverviewWrapper';
export type { ContentPageDetailProps } from '~modules/content-page/views/ContentPageDetail';
export type { ContentPageEditProps } from '~modules/content-page/views/ContentPageEdit';
export type {
	MediaGridBlockState,
	MediaGridBlockComponentState,
	ContentBlockConfig,
	DbContentBlock,
	ImageTitleTextButtonBlockComponentState,
	ContentBlockErrors,
} from '~modules/content-page/types/content-block.types';
export { CONTENT_PAGE_PATH } from './content-page/const/content-page.consts';
export { CONTENT_BLOCK_CONFIG_MAP } from './content-page/const/content-block-config-map';
export { Color } from '~modules/content-page/types/content-block.types';
export { ContentBlockType } from '~modules/content-page/types/content-block.types';
export { PublishOption } from '~modules/content-page/types/content-pages.types';
export {
	convertDbContentPageToContentPageInfo,
	convertDbContentPagesToContentPageInfos,
} from '~modules/content-page/services/content-page.converters';

// Navigation
export { default as NavigationOverview } from './navigation/views/NavigationOverview';
export { default as NavigationEdit } from '~modules/navigation/views/NavigationEdit';
export { default as NavigationDetail } from '~modules/navigation/views/NavigationDetail';

export { UserDetail } from '~modules/user/views/UserDetail';
export { UserEdit } from '~modules/user/views/UserEdit';
export { UserOverview } from '~modules/user/views/UserOverview';

export type { CommonUser } from '~modules/user/user.types';

// User groups and permissions
export { default as UserGroupOverview } from '~modules/user-group/views/UserGroupOverview';

// Translations
export { default as TranslationsOverview } from '~modules/translations/views/TranslationsOverview';

// Helpers
export { sanitizeHtml } from './shared/helpers/sanitize/index';
export { SanitizePreset } from './shared/helpers/sanitize/presets';

// STOPGAP
export type { DefaultComponentProps, ValueOf } from '~modules/shared';
