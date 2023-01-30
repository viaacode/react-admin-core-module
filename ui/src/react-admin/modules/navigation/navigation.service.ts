import { stringifyUrl } from 'query-string';

import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { AdminConfigManager } from '~core/config';
import { NavigationItem, NavigationItemUpdate } from './navigation.types';

export class NavigationService {
	private static getBaseUrl(): string {
		return `${AdminConfigManager.getConfig().database.proxyUrl}/admin/navigations`;
	}

	public static async fetchNavigationItemById(id: string): Promise<NavigationItem | null> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl() + '/items/' + id,
				})
			);
		} catch (err) {
			throw new CustomError(`Failed to fetch navigation item by id`, err, {
				id,
			});
		}
	}

	public static async fetchNavigationBarItems(placement?: string): Promise<NavigationItem[]> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl() + (placement ? '/' + placement : ''),
				})
			);
		} catch (err) {
			throw new CustomError('Failed to fetch navigation bar items', err, {
				placement,
			});
		}
	}

	public static async fetchNavigationBars(): Promise<NavigationItem[]> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl(),
				})
			);
		} catch (err) {
			throw new CustomError('Failed to fetch navigation bars', err);
		}
	}

	public static async insertNavigationItem(
		navigationItem: Partial<NavigationItem>
	): Promise<number> {
		try {
			return fetchWithLogoutJson(this.getBaseUrl() + '/items', {
				method: 'PUT',
				body: JSON.stringify(navigationItem),
			});
		} catch (err) {
			throw new CustomError('Failed to insert navigation item', err, {
				navigationItem,
			});
		}
	}

	public static async updateNavigationItems(navigationItems: NavigationItem[]): Promise<void> {
		try {
			const promises: Promise<any>[] = navigationItems.map((navigationItem) => {
				const navigationItemUpdate: NavigationItemUpdate = {
					iconName: navigationItem.iconName,
					label: navigationItem.label,
					userGroupIds: navigationItem.userGroupIds,
					contentType: navigationItem.contentType,
					contentPath: navigationItem.contentPath,
					linkTarget: navigationItem.linkTarget,
					position: navigationItem.position,
					description: navigationItem.description,
					placement: navigationItem.placement,
					tooltip: navigationItem.tooltip,
				};

				return fetchWithLogoutJson(
					stringifyUrl({
						url: this.getBaseUrl() + '/items/' + navigationItem.id,
					}),
					{
						method: 'PATCH',
						body: JSON.stringify(navigationItemUpdate),
					}
				);
			});

			await Promise.all(promises);
			await AdminConfigManager.getConfig().services.queryCache.clear('clearNavElementsCache');
		} catch (err) {
			throw new CustomError('Failed to update navigation items', err, {
				navigationItems,
			});
		}
	}

	public static async deleteNavigationItem(id: string): Promise<void> {
		try {
			await fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl() + '/items/' + id,
				}),
				{
					method: 'DELETE',
				}
			);
			await AdminConfigManager.getConfig().services.queryCache.clear('clearNavElementsCache');
		} catch (err) {
			throw new CustomError('Failed to delete navigation item by id', err, {
				id,
			});
		}
	}
}
