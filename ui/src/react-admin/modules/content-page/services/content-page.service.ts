import type { IPagination } from '@studiohyperdrive/pagination';
import type { Avo } from '@viaa/avo2-types';
import { kebabCase } from 'es-toolkit';
import { stringifyUrl } from 'query-string';
import type { ContentPageOverviewParams } from '~content-blocks/BlockPageOverview/BlockPageOverview.types';

import { AdminConfigManager } from '~core/config/config.class';
import { PAGES_PER_PAGE } from '~modules/content-page/const/content-page.consts';
import { CONTENT_PAGE_SERVICE_BASE_URL } from '~modules/content-page/services/content-page.const';
import {
	convertContentPageInfoToDbContentPage,
	convertDbContentPagesToContentPageInfos,
	convertDbContentPageToContentPageInfo,
} from '~modules/content-page/services/content-page.converters';
import type { Locale } from '~modules/translations/translations.core.types';
import { CustomError } from '~shared/helpers/custom-error';

import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type {
	ContentOverviewTableCols,
	ContentPageInfo,
	ContentPageLabel,
	DbContentPage,
} from '../types/content-pages.types';

export class ContentPageService {
	private static getBaseUrl(): string {
		return `${getAdminCoreApiUrl()}${CONTENT_PAGE_SERVICE_BASE_URL}`;
	}

	public static async getContentPagesForPageOverviewBlock(
		options: ContentPageOverviewParams
	): Promise<IPagination<ContentPageInfo> & { labelCounts: Record<string, number> }> {
		const { items: dbContentPages, ...rest } = await fetchWithLogoutJson<
			IPagination<DbContentPage> & { labelCounts: Record<string, number> }
		>(`${ContentPageService.getBaseUrl()}/page-overview-block`, {
			method: 'POST',
			body: JSON.stringify(options),
			throwOnNullResponse: true,
		});
		return {
			items: convertDbContentPagesToContentPageInfos(dbContentPages) || [],
			...rest,
		};
	}

	public static async getNlParentContentPagesByTitle(
		title: string | undefined,
		limit?: number
	): Promise<ContentPageInfo[]> {
		const dbContentPages: DbContentPage[] = await fetchWithLogoutJson(
			stringifyUrl({
				url: `${ContentPageService.getBaseUrl()}/nl-parent-pages`,
				query: {
					limit: limit ?? 20,
					title,
				},
			}),
			{ throwOnNullResponse: true }
		);
		return convertDbContentPagesToContentPageInfos(dbContentPages) || [];
	}

	public static async getPublicContentItemsByTitle(
		title: string | undefined,
		contentType: string | undefined,
		limit?: number
	): Promise<ContentPageInfo[]> {
		const dbContentPages: DbContentPage[] = await fetchWithLogoutJson(
			stringifyUrl({
				url: `${ContentPageService.getBaseUrl()}/public`,
				query: {
					limit: limit ?? 20,
					title,
					contentType,
				},
			}),
			{ throwOnNullResponse: true }
		);
		return convertDbContentPagesToContentPageInfos(dbContentPages) || [];
	}

	public static async getPublicProjectContentItemsByTitle(
		title: string | undefined,
		limit: number
	): Promise<Partial<ContentPageInfo>[]> {
		const dbContentPages: DbContentPage[] | null = await fetchWithLogoutJson(
			stringifyUrl({
				url: `${ContentPageService.getBaseUrl()}/projects/public`,
				query: {
					limit,
					title,
				},
			}),
			{ throwOnNullResponse: true }
		);
		return convertDbContentPagesToContentPageInfos(dbContentPages) || [];
	}

	public static async getContentPageById(id: number | string): Promise<ContentPageInfo | null> {
		const dbContentPage: DbContentPage | null = await fetchWithLogoutJson(
			`${ContentPageService.getBaseUrl()}/${id}`,
			{ throwOnNullResponse: true }
		);
		return dbContentPage ? convertDbContentPageToContentPageInfo(dbContentPage) : null;
	}

	public static async getContentTypes(): Promise<
		{ value: Avo.ContentPage.Type; label: string }[] | null
	> {
		return fetchWithLogoutJson(`${ContentPageService.getBaseUrl()}/types`, {
			throwOnNullResponse: true,
		});
	}

	public static async fetchLabelsByContentType(contentType: string): Promise<ContentPageLabel[]> {
		return (
			(await fetchWithLogoutJson(
				stringifyUrl({
					url: `${ContentPageService.getBaseUrl()}/labels`,
					query: {
						contentType,
					},
				}),
				{ throwOnNullResponse: true }
			)) || []
		);
	}

	public static async insertContentLabelsLinks(
		contentPageId: number | string, // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
		labelIds: (number | string)[]
	): Promise<void> {
		if (!labelIds?.length) {
			return;
		}
		await fetchWithLogoutJson(`${ContentPageService.getBaseUrl()}/labels`, {
			method: 'PUT',
			body: JSON.stringify({
				contentPageId,
				labelIds,
			}),
		});
	}

	public static async deleteContentLabelsLinks(
		contentPageId: number | string, // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
		labelIds: (number | string)[]
	): Promise<void> {
		if (!labelIds?.length) {
			return;
		}
		await fetchWithLogoutJson(`${ContentPageService.getBaseUrl()}/labels`, {
			method: 'DELETE',
			body: JSON.stringify({
				contentPageId,
				labelIds,
			}),
		});
	}

	/**
	 * Get content pages for the admin dashboard content page overview
	 * @param page
	 * @param sortColumn
	 * @param sortOrder
	 * @param tableColumnDataType
	 * @param where
	 */
	public static async fetchContentPages(
		page: number,
		sortColumn: ContentOverviewTableCols,
		sortOrder: Avo.Search.OrderDirection,
		tableColumnDataType: string,
		// biome-ignore lint/suspicious/noExplicitAny: todo
		where: any
	): Promise<[ContentPageInfo[], number]> {
		const [dbContentPages, count] = await fetchWithLogoutJson<[DbContentPage[], number]>(
			stringifyUrl({
				url: ContentPageService.getBaseUrl(),
				query: {
					offset: page * PAGES_PER_PAGE,
					limit: PAGES_PER_PAGE,
					sortColumn,
					sortOrder,
					tableColumnDataType,
					where: JSON.stringify(where),
				},
			}),
			{ throwOnNullResponse: true }
		);
		return [convertDbContentPagesToContentPageInfos(dbContentPages) || [], count];
	}

	public static async insertContentPage(
		contentPage: Omit<ContentPageInfo, 'id'> & { id?: string | number }
	): Promise<ContentPageInfo | null> {
		const dbContentPage: DbContentPage = await fetchWithLogoutJson(
			ContentPageService.getBaseUrl(),
			{
				method: 'PUT',
				body: JSON.stringify(convertContentPageInfoToDbContentPage(contentPage)),
			}
		);
		return convertDbContentPageToContentPageInfo(dbContentPage);
	}

	public static async updateContentPage(contentPage: ContentPageInfo): Promise<ContentPageInfo> {
		const dbContentPage: DbContentPage = await fetchWithLogoutJson<DbContentPage>(
			ContentPageService.getBaseUrl(),
			{
				method: 'PATCH',
				body: JSON.stringify({
					contentPage: convertContentPageInfoToDbContentPage(contentPage),
				}),
			}
		);
		return convertDbContentPageToContentPageInfo(dbContentPage);
	}

	public static async duplicateContentPageImages(id: number | string): Promise<ContentPageInfo> {
		try {
			const responseContent = await fetchWithLogoutJson<DbContentPage>(
				stringifyUrl({
					// This route lives in the proxy and not in the admin-core-api, so we use content-pages/duplicate instead of admin/content-pages/duplicate
					url: `${getAdminCoreApiUrl()}/admin/content-pages/${id}/duplicate`,
				}),
				{
					method: 'POST',
				}
			);
			return convertDbContentPageToContentPageInfo(responseContent);
		} catch (err) {
			throw new CustomError('Failed to duplicate assets for content page', err, { id });
		}
	}

	public static async duplicateContentImages(
		// biome-ignore lint/suspicious/noExplicitAny: todo
		contentBlockInfo: any
		// biome-ignore lint/suspicious/noExplicitAny: todo
	): Promise<any> {
		try {
			// biome-ignore lint/suspicious/noExplicitAny: todo
			return await fetchWithLogoutJson<any>(
				stringifyUrl({
					// This route lives in the proxy and not in the admin-core-api, so we use content-pages/duplicate instead of admin/content-pages/duplicate
					url: `${getAdminCoreApiUrl()}/admin/content-pages/blocks/duplicate`,
				}),
				{
					method: 'POST',
					body: JSON.stringify(contentBlockInfo),
				}
			);
		} catch (err) {
			throw new CustomError('Failed to duplicate assets for content block json', err, {
				contentBlockInfo,
			});
		}
	}

	public static getPathOrDefault(contentPage: Partial<ContentPageInfo> | null): string {
		if (contentPage?.path && contentPage?.title) {
			return `/${kebabCase(contentPage.title)}`;
		}
		return '';
	}

	/**
	 * Add duplicate of content page
	 *
	 * @param contentPageId
	 * @param overrideValues
	 *
	 * @returns Duplicate content page.
	 */
	public static async duplicateContentPage(
		contentPageId: string | number,
		overrideValues: Partial<ContentPageInfo>
	): Promise<Partial<ContentPageInfo> | null> {
		try {
			const duplicatedContentPage = await fetchWithLogoutJson<DbContentPage | null>(
				`${ContentPageService.getBaseUrl()}/${contentPageId}/duplicate`,
				{
					method: 'POST',
					body: JSON.stringify(overrideValues),
				}
			);
			if (!duplicatedContentPage) {
				return null;
			}
			return convertDbContentPageToContentPageInfo(duplicatedContentPage);
		} catch (err) {
			throw new CustomError('Failed to duplicate content page', err, {
				contentPageId,
				overrideValues,
			});
		}
	}

	public static async deleteContentPage(id: number | string): Promise<void> {
		await fetchWithLogoutJson(`${ContentPageService.getBaseUrl()}/${id}`, {
			method: 'DELETE',
		});
	}

	/**
	 * Get a content page with all of its content without the user having to be logged in
	 * @param language The language the user is currently using the site in. eg: NL or EN
	 * @param path The path to identify the content page including the leading slash. eg: /over
	 * @param onlyInfo only include info about the content page, do not resolve media info inside the content page blocks
	 */
	public static async getContentPageByLanguageAndPath(
		language: Locale,
		path: string,
		onlyInfo = false
	): Promise<DbContentPage | null> {
		try {
			let url = `${ContentPageService.getBaseUrl()}/by-language-and-path`;
			if (
				AdminConfigManager.getConfig().services.getContentPageByLanguageAndPathEndpoint &&
				!onlyInfo
			) {
				url =
					AdminConfigManager.getConfig().services.getContentPageByLanguageAndPathEndpoint || url;
			}
			const dbContentPage = await fetchWithLogoutJson<DbContentPage | null>(
				stringifyUrl({
					url,
					query: {
						language,
						path,
						onlyInfo: onlyInfo ? 'true' : 'false',
					},
				})
			);
			if (!dbContentPage) {
				return null;
			}
			return dbContentPage;
		} catch (err) {
			throw new CustomError('Failed to get content page by language and path', err);
		}
	}

	/**
	 * Check if content page with path already exists
	 * @param language The language the user is currently using the site in. eg: NL or EN
	 * @param path The path to identify the content page including the leading slash. eg: /over
	 * @param id pass the id of the page you're trying to update, when creating a page, omi this param
	 * @return returns the title of the page if it exists, otherwise returns null
	 */
	public static async doesContentPageLanguageAndPathExist(
		language: Locale,
		path: string,
		id?: number | string // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
	): Promise<string | null> {
		try {
			const responseContent = await fetchWithLogoutJson<{
				exists: boolean;
				title: string;
				id: number;
			}>(
				stringifyUrl({
					url: `${ContentPageService.getBaseUrl()}/path-exists`,
					query: {
						language,
						path,
					},
				}),
				{ throwOnNullResponse: true }
			);
			if (id === responseContent.id) {
				return null;
			}
			return responseContent.title;
		} catch (err) {
			throw new CustomError('Failed to check if content page exists by language and path', err);
		}
	}

	public static async getUserGroupsWithAccessToContentPage(
		path: string
	): Promise<(string | number)[]> {
		return fetchWithLogoutJson(
			stringifyUrl({
				url: `${ContentPageService.getBaseUrl()}/access`,
				query: {
					path,
				},
			})
		);
	}
}
