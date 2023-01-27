import { AdminConfigManager } from '~core/config/config.class';

// Admin Core
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
export type { ContentPageDetailProps } from '~modules/content-page/views/ContentPageDetail';
export type { ContentPageEditProps } from '~modules/content-page/views/ContentPageEdit';
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
export { Color } from '~modules/content-page/types/content-block.types';
export { ContentBlockType } from '~modules/content-page/types/content-block.types';
export { PublishOption } from '~modules/content-page/types/content-pages.types';
export { ContentPageService } from '~modules/content-page/services/content-page.service';
export * from './content-page/components/blocks';
export {
	convertDbContentPageToContentPageInfo,
	convertDbContentPagesToContentPageInfos,
} from '~modules/content-page/services/content-page.converters';
export { GET_ALIGN_OPTIONS } from './content-page/const/get-align-options';
export { GET_BUTTON_TYPE_OPTIONS } from './content-page/const/get-button-type-options';
export { GET_HEADING_TYPE_OPTIONS } from './content-page/const/get-heading-type-options';

// Content page labels
export { ContentPageLabelService } from './content-page-labels/content-page-label.service';

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
