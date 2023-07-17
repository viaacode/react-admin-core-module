import { AdminConfigManager } from '../core/config';

// Admin Core
export type { AdminConfig } from '../core/config/config.types';
export { AdminConfigManager };
export {
	fetchWithLogoutJson,
	fetchWithLogout,
	goToLoginBecauseOfUnauthorizedError,
} from '../modules/shared/helpers/fetch-with-logout';

// Content pages
export { default as ContentPageOverview } from './content-page/views/ContentPageOverview';
export { default as ContentPageDetail } from './content-page/views/ContentPageDetail';
export { default as ContentPageEdit } from './content-page/views/ContentPageEdit';
export { default as ContentPageRenderer } from './content-page/components/ContentPageRenderer/ContentPageRenderer';
export type { ColorOption } from './content-page/components/fields/ColorSelect/ColorSelect';
export type { ContentPageInfo } from './content-page/types/content-pages.types';
export type { DbContentPage } from './content-page/types/content-pages.types';
export type { ContentPageLabel } from './content-page/types/content-pages.types';
export type { ContentPageDetailProps } from './content-page/views/ContentPageDetail';
export type { ContentPageEditProps } from './content-page/views/ContentPageEdit';
export type {
	ContentBlockConfig,
	ContentBlockErrors,
	ContentBlockField,
	DbContentBlock,
	DefaultContentBlockState,
	ImageTitleTextButtonBlockComponentState,
	KlaarBlockComponentState,
	MediaGridBlockComponentState,
	MediaGridBlockState,
} from './content-page/types/content-block.types';
export { ContentBlockEditor } from './content-page/types/content-block.types';
export { CONTENT_BLOCK_CONFIG_MAP } from './content-page/const/content-block-config-map';
export { Color } from './content-page/types/content-block.types';
export { ContentBlockType } from './content-page/types/content-block.types';
export { PublishOption } from './content-page/types/content-pages.types';
export { ContentPageService } from './content-page/services/content-page.service';
export * from './content-page/components/blocks';
export {
	convertDbContentPageToContentPageInfo,
	convertDbContentPagesToContentPageInfos,
} from './content-page/services/content-page.converters';
export { GET_ALIGN_OPTIONS } from './content-page/const/get-align-options';
export { GET_BUTTON_TYPE_OPTIONS } from './content-page/const/get-button-type-options';
export { GET_HEADING_TYPE_OPTIONS } from './content-page/const/get-heading-type-options';

// Content page labels
export { ContentPageLabelService } from './content-page-labels/content-page-label.service';
export { default as ContentPageLabelOverview } from './content-page-labels/views/ContentPageLabelOverview';
export { default as ContentPageLabelEdit } from './content-page-labels/views/ContentPageLabelEdit';
export { default as ContentPageLabelDetail } from './content-page-labels/views/ContentPageLabelDetail';

// Navigation
export { default as NavigationOverview } from './navigation/views/NavigationOverview';
export { default as NavigationEdit } from './navigation/views/NavigationEdit';
export { default as NavigationDetail } from './navigation/views/NavigationDetail';

// Alerts
export { default as AlertsOverview } from './alerts/views/AlertsOverview';

//Users
export { UserOverview } from './user/views/UserOverview';
export { UserDetail } from './user/views/UserDetail';
export { UserService } from './user/user.service';
export { useGetProfileById } from './user/hooks/use-get-profile-by-id';

// User groups and permissions
export { default as UserGroupOverview } from './user-group/views/UserGroupOverview';

// Translations
export { default as TranslationsOverview } from './translations/views/TranslationsOverview';

// Helpers
export { sanitizeHtml } from './shared/helpers/sanitize/index';
export { SanitizePreset } from './shared/helpers/sanitize/presets';

// STOPGAP
export type { DefaultComponentProps, ValueOf } from './shared';
