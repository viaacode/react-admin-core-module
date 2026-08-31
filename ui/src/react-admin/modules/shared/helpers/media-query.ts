import { useEffect, useState } from 'react';
import { isServerSideRendering } from '~shared/helpers/routing/is-server-side-rendering';

function isMobileWidth() {
	if (isServerSideRendering()) {
		return false; // Server side rendering doesn't have access to the window object
	}
	return window.innerWidth < 700;
}

// isMobileWidth() only reads window.innerWidth once at render time, so callers don't
// re-render when the window is resized. This hook subscribes to the resize event instead.
export function useIsMobileWidth(): boolean {
	const [isMobile, setIsMobile] = useState(isMobileWidth());

	useEffect(() => {
		if (isServerSideRendering()) {
			return; // Server side rendering doesn't have access to the window object
		}

		const handleResize = () => setIsMobile(isMobileWidth());
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return isMobile;
}
