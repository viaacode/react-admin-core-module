import { QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '~shared/types';

export async function invalidateNavigationQueries() {
	const client = new QueryClient();
	await client.invalidateQueries({ queryKey: [QUERY_KEYS.GET_NAVIGATION_ITEM] });
	await client.invalidateQueries({ queryKey: [QUERY_KEYS.GET_NAVIGATIONS] });
}
