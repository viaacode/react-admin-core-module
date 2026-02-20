import { useCallback, useEffect, useState } from 'react';

export function useLocation() {
	const [location, setLocation] = useState<Location>();

	const handlePopState = useCallback(() => {
		if (location?.pathname !== window.location.pathname) {
			setLocation(window.location);
		}
	}, [location?.pathname]);

	useEffect(() => {
		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	}, [handlePopState]);

	return location;
}
