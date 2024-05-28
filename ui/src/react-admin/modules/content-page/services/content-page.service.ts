import { IPagination } from '@studiohyperdrive/pagination';
import type { Avo } from '@viaa/avo2-types';
import { kebabCase } from 'lodash-es';
import { stringifyUrl } from 'query-string';
import { ContentPageOverviewParams } from '~content-blocks/BlockPageOverview/BlockPageOverview.types';

import { AdminConfigManager } from '~core/config';
import { PAGES_PER_PAGE } from '~modules/content-page/const/content-page.consts';
import { CONTENT_PAGE_SERVICE_BASE_URL } from '~modules/content-page/services/content-page.const';
import {
	convertContentPageInfoToDbContentPage,
	convertDbContentPagesToContentPageInfos,
	convertDbContentPageToContentPageInfo,
} from '~modules/content-page/services/content-page.converters';
import { Locale } from '~modules/translations/translations.core.types';
import { CustomError } from '~shared/helpers/custom-error';

import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import {
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
		>(this.getBaseUrl() + '/page-overview-block', {
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
				url: `${this.getBaseUrl()}/nl-parent-pages`,
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
		limit?: number
	): Promise<ContentPageInfo[]> {
		const dbContentPages: DbContentPage[] = await fetchWithLogoutJson(
			stringifyUrl({
				url: `${this.getBaseUrl()}/public`,
				query: {
					limit: limit ?? 20,
					title,
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
				url: `${this.getBaseUrl()}/projects/public`,
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
			`${this.getBaseUrl()}/${id}`,
			{ throwOnNullResponse: true }
		);
		return dbContentPage ? convertDbContentPageToContentPageInfo(dbContentPage) : null;
	}

	public static async getContentTypes(): Promise<
		{ value: Avo.ContentPage.Type; label: string }[] | null
	> {
		return fetchWithLogoutJson(`${this.getBaseUrl()}/types`, { throwOnNullResponse: true });
	}

	public static async fetchLabelsByContentType(contentType: string): Promise<ContentPageLabel[]> {
		return (
			(await fetchWithLogoutJson(
				stringifyUrl({
					url: `${this.getBaseUrl()}/labels`,
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
		await fetchWithLogoutJson(`${this.getBaseUrl()}/labels`, {
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
		await fetchWithLogoutJson(`${this.getBaseUrl()}/labels`, {
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
		where: any
	): Promise<[ContentPageInfo[], number]> {
		const [dbContentPages, count] = await fetchWithLogoutJson<[DbContentPage[], number]>(
			stringifyUrl({
				url: this.getBaseUrl(),
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
		const dbContentPage: DbContentPage = await fetchWithLogoutJson(this.getBaseUrl(), {
			method: 'PUT',
			body: JSON.stringify(convertContentPageInfoToDbContentPage(contentPage)),
		});
		return convertDbContentPageToContentPageInfo(dbContentPage);
	}

	public static async updateContentPage(contentPage: ContentPageInfo): Promise<ContentPageInfo> {
		const dbContentPage: DbContentPage = await fetchWithLogoutJson<DbContentPage>(
			this.getBaseUrl(),
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
					url: `${getAdminCoreApiUrl()}/admin/content-pages/duplicate/` + id,
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

	public static async duplicateContentImages(contentBlockInfo: any): Promise<any> {
		try {
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

	public static getPathOrDefault(contentPage: Partial<ContentPageInfo>): string {
		return contentPage.path || `/${kebabCase(contentPage.title)}`;
	}

	// TODO: Make function generic so we can combine this getTitle and the one from collections.
	/**
	 * Find name that isn't a duplicate of an existing name of a content page of this user
	 * eg: if these content pages exist:
	 * copy 1: test
	 * copy 2: test
	 * copy 4: test
	 *
	 * Then the algorithm will propose: copy 3: test
	 * @param copyPrefix
	 * @param copyRegex
	 * @param existingTitle
	 *
	 * @returns Potential title for duplicate content page.
	 */
	public static getCopyTitleForContentPage = async (
		copyPrefix: string,
		copyRegex: RegExp,
		existingTitle: string
	): Promise<string> => {
		const titleWithoutCopy = existingTitle.replace(copyRegex, '');
		const contentPages = await ContentPageService.getPublicContentItemsByTitle(
			`%${titleWithoutCopy}`
		);
		const titles = (contentPages || []).map((contentPage) => contentPage.title);

		let index = 0;
		let candidateTitle: string;

		do {
			index += 1;
			candidateTitle = copyPrefix.replace('%index%', String(index)) + titleWithoutCopy;
		} while (titles.includes(candidateTitle));

		return candidateTitle;
	};

	/**
	 * Add duplicate of content page
	 *
	 * @param contentPageInfo
	 * @param overrideValues
	 * @param copyPrefix
	 * @param copyRegex
	 * @param profileId user who will be the owner of the copy
	 *
	 * @returns Duplicate content page.
	 */
	public static async duplicateContentPage(
		contentPageInfo: ContentPageInfo,
		overrideValues: Partial<ContentPageInfo>,
		copyPrefix: string,
		copyRegex: RegExp,
		profileId: string
	): Promise<Partial<ContentPageInfo> | null> {
		try {
			const contentToInsert = {
				...(await this.duplicateContentPageImages(contentPageInfo.id)),
				...overrideValues,
			};

			// update attributes specific to duplicate
			contentToInsert.isPublic = false;
			contentToInsert.publishedAt = null;
			contentToInsert.depublishAt = null;
			contentToInsert.publishAt = null;
			contentToInsert.path = null;
			contentToInsert.createdAt = new Date().toISOString();
			contentToInsert.updatedAt = contentToInsert.createdAt;
			contentToInsert.userProfileId = profileId;

			try {
				contentToInsert.title = await this.getCopyTitleForContentPage(
					copyPrefix,
					copyRegex,
					contentToInsert.title
				);
			} catch (err) {
				const customError = new CustomError(
					'Failed to retrieve title for duplicate content page',
					err,
					{
						contentToInsert,
					}
				);

				console.error(customError);

				// fallback to simple copy title
				contentToInsert.title = `${copyPrefix.replace(' %index%', '')}${
					contentToInsert.title
				}`;
			}

			// insert duplicated collection
			return await ContentPageService.insertContentPage(contentToInsert);
		} catch (err) {
			throw new CustomError('Failed to duplicate collection', err, {
				copyPrefix,
				copyRegex,
				contentPage: contentPageInfo,
			});
		}
	}

	public static async deleteContentPage(id: number | string): Promise<void> {
		await fetchWithLogoutJson(`${this.getBaseUrl()}/${id}`, {
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
	): Promise<ContentPageInfo | null> {
		try {
			let url = this.getBaseUrl() + '/by-language-and-path';
			if (
				AdminConfigManager.getConfig().services.getContentPageByLanguageAndPathEndpoint &&
				!onlyInfo
			) {
				url =
					AdminConfigManager.getConfig().services
						.getContentPageByLanguageAndPathEndpoint || url;
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
			return convertDbContentPageToContentPageInfo(dbContentPage);
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
					url: this.getBaseUrl() + '/path-exists',
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
			throw new CustomError(
				'Failed to check if content page exists by language and path',
				err
			);
		}
	}

	public static async getUserGroupsWithAccessToContentPage(
		path: string
	): Promise<(string | number)[]> {
		return fetchWithLogoutJson(
			stringifyUrl({
				url: `${this.getBaseUrl()}/access`,
				query: {
					path,
				},
			})
		);
	}
}
