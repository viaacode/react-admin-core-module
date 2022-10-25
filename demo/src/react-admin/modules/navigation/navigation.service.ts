import { isNil } from 'lodash-es';

import { CustomError } from '~modules/shared/helpers/custom-error';
import { dataService } from '~modules/shared/services/data-service';
import { AdminConfigManager } from '~core/config';
import { NAVIGATION_QUERIES, NavigationQueryTypes } from './queries/navigation.queries';
import { NavigationItem } from './navigation.types';

export class NavigationService {
	private static getQueries() {
		return NAVIGATION_QUERIES[AdminConfigManager.getConfig().database.databaseApplicationType];
	}

	public static async fetchNavigationItemById(id: string): Promise<NavigationItem | null> {
		try {
			const response: any = await dataService.query<
				NavigationQueryTypes['GetNavigationItemByIdQuery'],
				NavigationQueryTypes['GetNavigationItemByIdQueryVariables']
			>({
				query: this.getQueries().GetNavigationItemByIdDocument,
				variables: { id: id.includes('-') ? id : Number(id) },
			});

			if (!response) {
				throw new CustomError('Response is undefined');
			}

			return response.app_content_nav_elements?.[0] || response.app_navigation?.[0] || null;
		} catch (err) {
			throw new CustomError(`Failed to fetch navigation item by id`, err, {
				id,
				query: 'GET_NAVIGATION_ITEM_BY_ID',
			});
		}
	}

	public static async fetchNavigationItems(placement?: string): Promise<NavigationItem[]> {
		try {
			const response: any = await dataService.query<
				| NavigationQueryTypes['GetNavigationElementsQuery']
				| NavigationQueryTypes['GetNavigationItemsByPlacementQuery'],
				| NavigationQueryTypes['GetNavigationElementsQueryVariables']
				| NavigationQueryTypes['GetNavigationItemsByPlacementQueryVariables']
			>({
				query: placement
					? this.getQueries().GetNavigationItemsByPlacementDocument
					: this.getQueries().GetNavigationElementsDocument,
				variables: placement ? { placement } : undefined,
			});

			if (!response) {
				throw new CustomError('Response is undefined');
			}

			return response.app_content_nav_elements || response.app_navigation || [];
		} catch (err) {
			throw new CustomError('Failed to fetch navigation items', err, {
				placement,
				query: ['GET_NAVIGATION_ITEMS_BY_PLACEMENT', 'GET_NAVIGATION_ELEMENTS'],
			});
		}
	}

	public static async insertNavigationItem(
		navigationItem: Partial<NavigationItem>
	): Promise<number> {
		try {
			const response = await dataService.query<
				NavigationQueryTypes['InsertNavigationItemMutation'],
				NavigationQueryTypes['InsertNavigationItemMutationVariables']
			>({
				query: this.getQueries().InsertNavigationItemDocument,
				variables: {
					navigationItem,
				},
			});
			await AdminConfigManager.getConfig().services.queryCache.clear('clearNavElementsCache');

			const id =
				(response as NavigationQueryTypes['InsertNavigationItemMutationAvo'])
					.insert_app_content_nav_elements?.returning?.[0]?.id ||
				(response as NavigationQueryTypes['InsertNavigationItemMutationHetArchief'])
					.insert_app_navigation?.returning?.[0]?.id;
			if (isNil(id)) {
				throw new CustomError('Response does not contain inserted id', null, { response });
			}
			return id;
		} catch (err) {
			throw new CustomError('Failed to insert navigation item', err, {
				navigationItem,
				query: 'INSERT_NAVIGATION_ITEM',
			});
		}
	}

	public static async updateNavigationItems(navigationItems: NavigationItem[]): Promise<void> {
		try {
			const promises: Promise<any>[] = navigationItems.map((navigationItem) => {
				return dataService.query<
					NavigationQueryTypes['UpdateNavigationItemByIdMutation'],
					NavigationQueryTypes['UpdateNavigationItemByIdMutationVariables']
				>({
					query: this.getQueries().UpdateNavigationItemByIdDocument,
					variables: {
						id: navigationItem.id,
						navigationItem: {
							...navigationItem,
							updated_at: new Date().toISOString(),
						},
					},
				});
			});
			await AdminConfigManager.getConfig().services.queryCache.clear('clearNavElementsCache');

			await Promise.all(promises);
		} catch (err) {
			throw new CustomError('Failed to update navigation items', err, {
				navigationItems,
				query: 'UPDATE_NAVIGATION_ITEM_BY_ID',
			});
		}
	}

	public static async deleteNavigationItem(id: string): Promise<void> {
		try {
			await dataService.query<
				NavigationQueryTypes['DeleteNavigationItemMutation'],
				NavigationQueryTypes['DeleteNavigationItemMutationVariables']
			>({
				query: this.getQueries().DeleteNavigationItemDocument,
				variables: { id },
			});
			await AdminConfigManager.getConfig().services.queryCache.clear('clearNavElementsCache');
		} catch (err) {
			throw new CustomError('Failed to delete navigation item by id', err, {
				id,
				query: 'DELETE_NAVIGATION_ITEM',
			});
		}
	}
}
