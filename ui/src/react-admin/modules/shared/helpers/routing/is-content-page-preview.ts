import { CONTENT_PAGE_PREVIEW_QUERY_PARAM } from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer.consts';
import { isServerSideRendering } from '~shared/helpers/routing/is-server-side-rendering';

export function isContentPagePreview(): boolean {
	if (isServerSideRendering()) {
		return false;
	}
	return window.location.search.includes(`${CONTENT_PAGE_PREVIEW_QUERY_PARAM}=`);
}
