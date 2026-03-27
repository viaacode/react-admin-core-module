import { useCallback, useEffect, useState } from 'react';

export function useLocation() {
	const [location, setLocation] = useState<Location>();

	const setLocationOnInit = useCallback(() => {
		setLocation(window.location);
	}, []);

	const handlePopState = useCallback(() => {
		const { pathname, search, hash } = window.location;

		if (location?.pathname !== pathname || location?.search !== search || location?.hash !== hash) {
			setLocation(window.location);
		}
	}, [location?.pathname, location?.search, location?.hash]);

	useEffect(() => {
		setLocationOnInit();

		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	}, [handlePopState, setLocationOnInit]);

	return location;
}
