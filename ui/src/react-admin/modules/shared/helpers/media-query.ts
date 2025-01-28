import { isServerSideRendering } from '~shared/helpers/is-server-side-rendering';

export function isMobileWidth() {
	if (isServerSideRendering()) {
		return false; // Server side rendering doesn't have access to the window object
	}
	return window.innerWidth < 700;
}
