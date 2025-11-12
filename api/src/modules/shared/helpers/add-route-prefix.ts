export const addPrefix = (
	process: NodeJS.Process & { env?: { ADMIN_CORE_ROUTES_PREFIX?: string } },
	path: string
) => {
	const value = process.env.ADMIN_CORE_ROUTES_PREFIX
	return value ? `${value}/${path}` : path
}
