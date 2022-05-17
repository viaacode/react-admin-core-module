import { ContentPageOverview } from '~modules/content-page/views';
import { CONTENT_PAGE_PATHS } from './const/content-page.consts';

export const CONTENT_PAGE_ROUTES = [
	{ path: CONTENT_PAGE_PATHS.overview, component: ContentPageOverview },
];

export { default as ContentPageOverview } from './views/ContentPageOverview';
export { default as ContentPageDetail } from './views/ContentPageDetail';
export { default as ContentPageEdit } from './views/ContentPageEdit';