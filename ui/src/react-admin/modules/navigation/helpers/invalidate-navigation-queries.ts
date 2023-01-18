import { QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '~modules/shared/types';

export async function invalidateNavigationQueries() {
	const client = new QueryClient();
	await client.invalidateQueries([QUERY_KEYS.GET_NAVIGATION_ITEM]);
	await client.invalidateQueries([QUERY_KEYS.GET_NAVIGATIONS]);
}
