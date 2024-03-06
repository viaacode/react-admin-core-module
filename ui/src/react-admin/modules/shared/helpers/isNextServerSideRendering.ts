export function isNextServerSideRendering() {
	return typeof window === 'undefined';
}
