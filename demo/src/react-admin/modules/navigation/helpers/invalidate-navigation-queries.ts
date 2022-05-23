import { QueryClient } from 'react-query';
import { NAVIGATIONS_QUERY_KEYS } from '~modules/navigation/navigation.consts';

export async function invalidateNavigationQueries() {
	const client = new QueryClient();
	await client.invalidateQueries(NAVIGATIONS_QUERY_KEYS.getNavigationItem);
	await client.invalidateQueries(NAVIGATIONS_QUERY_KEYS.getNavigations);
}
