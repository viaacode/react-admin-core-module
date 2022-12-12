import { AdminConfigManager } from '~core/config/config.class';

// Admin Core
export { ROUTE_PARTS } from '~modules/shared';
export type { AdminConfig } from '~core/config/config.types';
export { AdminConfigManager };

// Content pages
export { default as ContentPageOverview } from './content-page/views/ContentPageOverview';
export { default as ContentPageDetail } from './content-page/views/ContentPageDetail';
export { default as ContentPageEdit } from '~modules/content-page/views/ContentPageEdit';
export { default as ContentPageRenderer } from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
export { default as ContentPage } from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
export { Color } from '~modules/content-page/types/content-block.types';
export type { ContentBlockErrors } from '~modules/content-page/types/content-block.types';
export { ColorSelect } from './content-page/components/fields';
export type { ColorOption } from './content-page/components/fields/ColorSelect/ColorSelect';
export { CONTENT_PAGE_PATH } from './content-page/const/content-page.consts';
export { getPublishedDate } from '~modules/content-page/helpers';
export { useContentTypes } from '~modules/content-page/hooks/useContentTypes';
export { ContentPageService } from '~modules/content-page/services/content-page.service';
export type { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
export type { DbContentPage } from '~modules/content-page/types/content-pages.types';
export type { ContentPageLabel } from '~modules/content-page/types/content-pages.types';
export { ContentBlockType } from '~modules/content-page/types/content-block.types';

// Navigation
export { default as NavigationOverview } from './navigation/views/NavigationOverview';
export { default as NavigationEdit } from '~modules/navigation/views/NavigationEdit';

// Users
export { UserOverview } from '~modules/user/views/UserOverview';
export type { CommonUser } from '~modules/user/user.types';

// User groups and permissions
export { default as UserGroupOverview } from '~modules/user-group/views/UserGroupOverview';

// Translations
export { TranslationsOverview } from '~modules/translations/views/TranslationsOverview';
