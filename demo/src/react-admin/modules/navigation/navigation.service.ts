import { get, isNil } from 'lodash-es';

import { CustomError } from '~modules/shared/helpers/custom-error';
import { dataService } from '~modules/shared/services/data-service';
import { AdminConfigManager } from '~core/config';
import { NAVIGATION_QUERIES } from './queries/navigation.queries';
import {
	DeleteNavigationItemMutation,
	GetNavigationItemByIdQuery as GetNavigationItemByIdQueryAvo,
	InsertNavigationItemMutation,
	UpdateNavigationItemByIdMutation,
} from '~generated/graphql-db-types-avo';
import { NavigationItem } from './navigation.types';

export class NavigationService {
	private static getQueries() {
		return NAVIGATION_QUERIES[AdminConfigManager.getConfig().database.databaseApplicationType];
	}

	public static async fetchNavigationItemById(id: string): Promise<NavigationItem | null> {
		try {
			const response = await dataService.query<GetNavigationItemByIdQueryAvo>({
				query: this.getQueries().GetNavigationItemByIdDocument,
				variables: { id: id.includes('-') ? id : Number(id) },
			});

			if (!response) {
				throw new CustomError('Response is undefined');
			}
			if (response.errors) {
				throw new CustomError('Response contains errors', null, { response });
			}

			return (
				get(response, `data.app_content_nav_elements[0]`) ||
				get(response, `data.app_navigation[0]`) ||
				null
			);
		} catch (err) {
			throw new CustomError(`Failed to fetch navigation item by id`, err, {
				id,
				query: 'GET_NAVIGATION_ITEM_BY_ID',
			});
		}
	}

	public static async fetchNavigationItems(placement?: string): Promise<NavigationItem[]> {
		try {
			const queryOptions = {
				query: placement
					? this.getQueries().GetNavigationItemsByPlacementDocument
					: this.getQueries().GetNavigationElementsDocument,
				variables: placement ? { placement } : {},
			};
			const response = await dataService.query(queryOptions);

			if (!response) {
				throw new CustomError('Response is undefined');
			}
			if (response.errors) {
				throw new CustomError('Response contains errors', null, { response });
			}

			return (
				get(response, `data.app_content_nav_elements`) ||
				get(response, `data.app_navigation`) ||
				[]
			);
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
			const response = await dataService.query<InsertNavigationItemMutation>({
				query: this.getQueries().InsertNavigationItemDocument,
				variables: {
					navigationItem,
				},
			});
			await AdminConfigManager.getConfig().services.queryCache.clear('clearNavElementsCache');

			if (response.errors) {
				throw new CustomError('GraphQL response contains errors', null, { response });
			}
			const id =
				get(response, 'data.insert_app_content_nav_elements.returning[0].id') ||
				get(response, 'data.insert_app_navigation.returning[0].id');
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
				return dataService.query<UpdateNavigationItemByIdMutation>({
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
			const response = await dataService.query<DeleteNavigationItemMutation>({
				query: this.getQueries().DeleteNavigationItemDocument,
				variables: { id },
			});
			await AdminConfigManager.getConfig().services.queryCache.clear('clearNavElementsCache');

			if (!response) {
				throw new CustomError('Response is undefined');
			}
			if (response.errors) {
				throw new CustomError('Response contains errors', null, { response });
			}
		} catch (err) {
			throw new CustomError('Failed to delete navigation item by id', err, {
				id,
				query: 'DELETE_NAVIGATION_ITEM',
			});
		}
	}
}
