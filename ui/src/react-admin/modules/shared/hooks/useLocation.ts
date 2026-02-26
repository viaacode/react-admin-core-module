import { useCallback, useEffect, useState } from 'react';

export function useLocation() {
	const [location, setLocation] = useState<Location>();

	const setLocationOnInit = useCallback(() => {
		setLocation(window.location);
	}, []);

	const handlePopState = useCallback(() => {
		if (location?.pathname !== window.location.pathname) {
			setLocation(window.location);
		}
	}, [location?.pathname]);

	useEffect(() => {
		setLocationOnInit();

		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	}, [handlePopState, setLocationOnInit]);

	return location;
}
