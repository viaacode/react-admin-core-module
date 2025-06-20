export const isServerSideRendering = (): boolean => {
	return typeof window === 'undefined';
};
