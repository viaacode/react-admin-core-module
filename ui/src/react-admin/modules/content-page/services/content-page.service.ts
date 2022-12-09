import { IPagination } from '@studiohyperdrive/pagination';
import { ButtonAction } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { isArray, isFunction, isPlainObject, kebabCase } from 'lodash-es';
import moment from 'moment';
import { stringifyUrl } from 'query-string';
import { ContentPageOverviewParams } from '~modules/content-page/components/wrappers/PageOverviewWrapper/PageOverviewWrapper';
import { PAGES_PER_PAGE } from '~modules/content-page/const/content-page.consts';
import {
	convertContentPageInfoToDbContentPage,
	convertDbContentPagesToContentPageInfos,
	convertDbContentPageToContentPageInfo
} from '~modules/content-page/services/content-page.converters';

import { fetchWithLogoutJson } from '../../shared/helpers/fetch-with-logout';
import { mapDeep } from '../../shared/helpers/map-deep/map-deep';
import { sanitizeHtml } from '../../shared/helpers/sanitize';
import { SanitizePreset } from '../../shared/helpers/sanitize/presets';
import { ResolvedItemOrCollection } from '../components/wrappers/MediaGridWrapper/MediaGridWrapper.types';
import { ContentBlockConfig } from '../types/content-block.types';

import { AdminConfigManager } from '~core/config';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { CONTENT_PAGE_SERVICE_BASE_URL } from '~modules/content-page/services/content-page.const';
import { RichEditorStateKey } from '~modules/content-page/const/rich-text-editor.consts';
import {
	ContentOverviewTableCols,
	ContentPageInfo,
	ContentPageLabel,
	DbContentPage,
} from '../types/content-pages.types';

export class ContentPageService {
	private static getBaseUrl(): string {
		return `${
			AdminConfigManager.getConfig().database.proxyUrl
		}${CONTENT_PAGE_SERVICE_BASE_URL}`;
	}

	public static async getContentPages(
		options: ContentPageOverviewParams
	): Promise<IPagination<ContentPageInfo> & { labelCounts: Record<string, number> }> {
		const { items: dbContentPages, ...rest } = await fetchWithLogoutJson(this.getBaseUrl(), {
			method: 'POST',
			body: JSON.stringify(options),
		});
		return {
			items: convertDbContentPagesToContentPageInfos(dbContentPages),
			...rest,
		};
	}

	public static async getPublicContentItems(limit: number): Promise<ContentPageInfo[] | null> {
		const dbContentPages: DbContentPage[] = await fetchWithLogoutJson(
			stringifyUrl({
				url: `${this.getBaseUrl()}/public`,
				query: {
					limit,
				},
			})
		);
		return convertDbContentPagesToContentPageInfos(dbContentPages);
	}

	public static async getPublicProjectContentItems(limit: number): Promise<ContentPageInfo[]> {
		const dbContentPages: DbContentPage[] = await fetchWithLogoutJson(
			stringifyUrl({
				url: `${this.getBaseUrl()}/projects/public`,
				query: {
					limit,
				},
			})
		);
		return convertDbContentPagesToContentPageInfos(dbContentPages) || [];
	}

	public static async getPublicContentItemsByTitle(
		title: string,
		limit?: number
	): Promise<ContentPageInfo[]> {
		const dbContentPages: DbContentPage[] = await fetchWithLogoutJson(
			stringifyUrl({
				url: `${this.getBaseUrl()}/public`,
				query: {
					limit,
					title,
				},
			})
		);
		return convertDbContentPagesToContentPageInfos(dbContentPages) || [];
	}

	public static async getPublicProjectContentItemsByTitle(
		title: string,
		limit: number
	): Promise<Partial<ContentPageInfo>[]> {
		const dbContentPages: DbContentPage[] | null = await fetchWithLogoutJson(
			stringifyUrl({
				url: `${this.getBaseUrl()}/projects/public`,
				query: {
					limit,
					title,
				},
			})
		);
		return convertDbContentPagesToContentPageInfos(dbContentPages) || [];
	}

	public static async getContentPageById(id: number | string): Promise<ContentPageInfo | null> {
		const dbContentPage: DbContentPage | null = await fetchWithLogoutJson(
			`${this.getBaseUrl()}/${id}`,
			{ throwOnNull: false }
		);
		return dbContentPage ? convertDbContentPageToContentPageInfo(dbContentPage) : null;
	}

	public static async getContentTypes(): Promise<
		{ value: Avo.ContentPage.Type; label: string }[] | null
	> {
		return fetchWithLogoutJson(`${this.getBaseUrl()}/types`);
	}

	public static async fetchLabelsByContentType(contentType: string): Promise<ContentPageLabel[]> {
		return (
			(await fetchWithLogoutJson(
				stringifyUrl({
					url: `${this.getBaseUrl()}/labels`,
					query: {
						contentType,
					},
				})
			)) || []
		);
	}

	public static async insertContentLabelsLinks(
		contentPageId: number | string, // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
		labelIds: (number | string)[]
	): Promise<void> {
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
		await fetchWithLogoutJson(`${this.getBaseUrl()}/labels`, {
			method: 'DELETE',
			body: JSON.stringify({
				contentPageId,
				labelIds,
			}),
		});
	}

	public static async fetchContentPages(
		page: number,
		sortColumn: ContentOverviewTableCols,
		sortOrder: Avo.Search.OrderDirection,
		tableColumnDataType: string,
		where: any
	): Promise<[ContentPageInfo[], number]> {
		const [dbContentPages, count] = await fetchWithLogoutJson(
			stringifyUrl({
				url: this.getBaseUrl() + '/overview',
				query: {
					offset: page * PAGES_PER_PAGE,
					limit: PAGES_PER_PAGE,
					sortColumn,
					sortOrder,
					tableColumnDataType,
					where: JSON.stringify(where),
				},
			})
		);
		return [convertDbContentPagesToContentPageInfos(dbContentPages) || [], count];
	}

	public static async insertContentPage(
		contentPage: Partial<ContentPageInfo>
	): Promise<Partial<ContentPageInfo> | null> {
		const dbContentPage: DbContentPage = await fetchWithLogoutJson(this.getBaseUrl(), {
			method: 'PUT',
			body: JSON.stringify(convertContentPageInfoToDbContentPage(contentPage)),
		});
		return convertDbContentPageToContentPageInfo(dbContentPage);
	}

	public static async updateContentPage(
		contentPage: Partial<ContentPageInfo>,
		initialContentPage: Partial<ContentPageInfo> | undefined
	): Promise<Partial<ContentPageInfo> | null> {
		const dbContentPage: DbContentPage = await fetchWithLogoutJson(this.getBaseUrl(), {
			method: 'PATCH',
			body: JSON.stringify({
				contentPage: convertContentPageInfoToDbContentPage(contentPage),
				initialContentPage: convertContentPageInfoToDbContentPage(initialContentPage),
			}),
		});
		return convertDbContentPageToContentPageInfo(dbContentPage);
	}

	public static async duplicateContentPageImages(id: number): Promise<ContentPageInfo> {
		try {
			const response = await fetchWithLogoutJson(
				stringifyUrl({
					url: `${this.getBaseUrl()}/duplicate`,
					query: {
						id,
					},
				}),
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				}
			);
			let responseContent: any;
			try {
				responseContent = await response.json();
			} catch (err) {
				// Ignore failed json parsing => will be handled by the status code not being between 200 and 400
			}
			if (response.status < 200 || response.status >= 400) {
				throw new CustomError('Failed to get content page from /content-pages', null, {
					id,
					response,
					responseContent,
				});
			}
			if (responseContent.error) {
				return responseContent.error;
			}
			return convertDbContentPageToContentPageInfo(responseContent);
		} catch (err) {
			throw new CustomError('Failed to get content page by path', err);
		}
	}

	public static getPathOrDefault(contentPage: Partial<ContentPageInfo>): string {
		return contentPage.path || `/${kebabCase(contentPage.title)}`;
	}

	/**
	 * Remove rich text editor states, since they are also saved as html,
	 * and we don't want those states to end up in the database
	 * @param blockConfigs
	 */
	public static convertRichTextEditorStatesToHtml(
		blockConfigs: ContentBlockConfig[]
	): ContentBlockConfig[] {
		return mapDeep(
			blockConfigs,
			(obj: any, key: string | number, value: any) => {
				if (String(key).endsWith(RichEditorStateKey)) {
					const htmlKey: string = String(key).substring(
						0,
						String(key).length - RichEditorStateKey.length
					);
					let htmlFromRichTextEditor = undefined;
					if (value && value.toHTML && isFunction(value.toHTML)) {
						htmlFromRichTextEditor = value.toHTML();
					}
					obj[htmlKey] = sanitizeHtml(
						htmlFromRichTextEditor || obj[htmlKey] || '',
						'full'
					);
				} else if (!isPlainObject(value) && !isArray(value)) {
					obj[key] = value;
				} else if (isPlainObject(value)) {
					obj[key] = {};
				} else {
					obj[key] = [];
				}
			},
			(key: string | number) => String(key).endsWith(RichEditorStateKey)
		);
	}

	// TODO: Make function generic so we can combine this getTitle and the one from collections.
	/**
	 * Find name that isn't a duplicate of an existing name of a content page of this user
	 * eg if these content pages exist:
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
	 * @param copyPrefix
	 * @param copyRegex
	 * @param profileId user who will be the owner of the copy
	 *
	 * @returns Duplicate content page.
	 */
	public static async duplicateContentPage(
		contentPageInfo: ContentPageInfo,
		copyPrefix: string,
		copyRegex: RegExp,
		profileId: string
	): Promise<Partial<ContentPageInfo> | null> {
		try {
			const contentToInsert = { ...contentPageInfo };

			// update attributes specific to duplicate
			contentToInsert.isPublic = false;
			contentToInsert.publishedAt = null;
			contentToInsert.depublishAt = null;
			contentToInsert.publishAt = null;
			contentToInsert.path = null;
			contentToInsert.createdAt = moment().toISOString();
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

	public static getDescription(
		contentPageInfo: ContentPageInfo,
		sanitizePreset: SanitizePreset = 'link'
	): string | null {
		const description = (contentPageInfo as any).description_state
			? (contentPageInfo as any).description_state.toHTML()
			: (contentPageInfo as any).description_html || null;
		return description ? sanitizeHtml(description, sanitizePreset) : null;
	}

	/**
	 * Get a content page with all of its content without the user having to be logged in
	 * @param path The path to identify the content page including the leading slash. eg: /over
	 */
	public static async getContentPageByPath(path: string): Promise<ContentPageInfo | null> {
		try {
			const dbContentPage = await fetchWithLogoutJson<DbContentPage | null>(
				stringifyUrl({
					url: this.getBaseUrl(),
					query: {
						path,
					},
				})
			);
			if (!dbContentPage) {
				return null;
			}
			return convertDbContentPageToContentPageInfo(
				dbContentPage
			);
		} catch (err) {
			throw new CustomError('Failed to get content page by path', err);
		}
	}

	/**
	 * Check if content page with path already exists
	 * @param path The path to identify the content page including the leading slash. eg: /over
	 * @param id pass the id of the page you're trying to update, when creating a page, omi this param
	 * @return returns the title of the page if it exists, otherwise returns null
	 */
	public static async doesContentPagePathExist(
		path: string,
		id?: number | string // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
	): Promise<string | null> {
		try {
			const responseContent = await fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl() + '/path-exists',
					query: {
						path,
					},
				})
			);
			if (id === responseContent.id) {
				return null;
			}
			return responseContent.title;
		} catch (err) {
			throw new CustomError('Failed to get content page by path', err);
		}
	}

	public static async resolveMediaItems(
		searchQuery: string | null,
		searchQueryLimit: number | undefined,
		mediaItems:
			| {
					mediaItem: ButtonAction;
			  }[]
			| undefined
	): Promise<ResolvedItemOrCollection[]> {
		let url: string | undefined = undefined;
		let body: any | undefined = undefined;
		try {
			url = this.getBaseUrl() + '/media';
			body = {
				searchQuery,
				searchQueryLimit,
				mediaItems,
			};
			return fetchWithLogoutJson(url, {
				method: 'POST',
				body: JSON.stringify(body),
			});
		} catch (err) {
			throw new CustomError('Failed to resolve media items through proxy', err, {
				searchQuery,
				searchQueryLimit,
				mediaItems,
				url,
				body,
			});
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
