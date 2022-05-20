import { ButtonAction } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { get, isFunction, kebabCase, omit } from 'lodash-es';
import moment from 'moment';
import { stringify } from 'query-string';

import { fetchWithLogout } from '../../shared/helpers/fetch-with-logout';
import { mapDeep } from '../../shared/helpers/map-deep';
import { sanitizeHtml } from '../../shared/helpers/sanitize';
import { SanitizePreset } from '../../shared/helpers/sanitize/presets';
import { dataService } from '../../shared/services/data-service';
import { ResolvedItemOrCollection } from '../components/wrappers/MediaGridWrapper/MediaGridWrapper.types';
import {
	CONTENT_RESULT_PATH,
	ITEMS_PER_PAGE,
	RichEditorStateKey,
	TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT,
} from '../const/content-page.consts';
import {
	convertToContentPageInfo,
	convertToContentPageInfos,
	convertToDatabaseContentPage,
} from '../helpers/parsers';
import { CONTENT_PAGE_QUERIES } from '../queries/content-pages.queries';
import { ContentBlockConfig } from '../types/content-block.types';
import {
	ContentOverviewTableCols,
	ContentPageDb,
	ContentPageInfo,
} from '../types/content-pages.types';

import { ContentBlockService } from './content-block.service';

import { Config, ToastType } from '~core/config';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { getOrderObject } from '~modules/shared/helpers/generate-order-gql-query';
import { performQuery } from '~modules/shared/helpers/gql';

export class ContentPageService {
	private static getQueries() {
		return CONTENT_PAGE_QUERIES[Config.getConfig().database.databaseApplicationType];
	}

	public static async getPublicContentItems(limit: number): Promise<ContentPageInfo[] | null> {
		const query = {
			query: this.getQueries().GetContentPagesDocument,
			variables: {
				limit,
				orderBy: { title: 'asc' },
				where: { is_public: { _eq: true }, is_deleted: { _eq: false } },
			},
		};

		return convertToContentPageInfos(
			(await performQuery(
				query,
				CONTENT_RESULT_PATH.GET,
				'Failed to retrieve content pages.'
			)) || []
		) as ContentPageInfo[];
	}

	public static async getPublicProjectContentItems(
		limit: number
	): Promise<ContentPageInfo[] | null> {
		const query = {
			query: this.getQueries().GetPublicProjectContentPagesDocument,
			variables: {
				limit,
				orderBy: { title: 'asc' },
			},
		};

		return (
			(await performQuery(
				query,
				CONTENT_RESULT_PATH.GET,
				'Failed to retrieve project content pages.'
			)) || []
		);
	}

	public static async getPublicContentItemsByTitle(
		title: string,
		limit?: number
	): Promise<ContentPageInfo[]> {
		const query = {
			query: this.getQueries().GetPublicContentPagesByTitleDocument,
			variables: {
				limit: limit || null,
				orderBy: { title: 'asc' },
				where: {
					title: { _ilike: `%${title}%` },
					is_public: { _eq: true },
					is_deleted: { _eq: false },
				},
			},
		};

		return (
			(await performQuery(
				query,
				CONTENT_RESULT_PATH.GET,
				'Failed to retrieve content pages by title.'
			)) || []
		);
	}

	public static async getPublicProjectContentItemsByTitle(
		title: string,
		limit: number
	): Promise<Partial<ContentPageInfo>[] | null> {
		const query = {
			query: this.getQueries().GetPublicProjectContentPagesByTitleDocument,
			variables: {
				title,
				limit,
				orderBy: { title: 'asc' },
			},
		};

		return performQuery(
			query,
			CONTENT_RESULT_PATH.GET,
			'Failed to retrieve content pages by title.'
		);
	}

	public static async getContentPageById(id: number | string): Promise<ContentPageInfo> {
		const query = {
			query: this.getQueries().GetContentByIdDocument,
			variables: {
				id,
			},
		};

		const dbContentPage: ContentPageDb | null = ((await performQuery(
			query,
			CONTENT_RESULT_PATH.GET,
			`Failed to retrieve content page by id: ${id}.`
		)) || [])[0];
		if (!dbContentPage) {
			throw new CustomError('No content page found with provided id', null, {
				id,
				code: 'NOT_FOUND',
			});
		}
		return convertToContentPageInfo(dbContentPage);
	}

	public static async getContentTypes(): Promise<
		{ value: Avo.ContentPage.Type; label: string }[] | null
	> {
		try {
			const contentTypes = await performQuery(
				{
					query: this.getQueries().GetContentTypesDocument,
				},
				['data.lookup_enum_content_types', 'data.lookup_app_content_type'],
				'Failed to retrieve content types.'
			);

			return (contentTypes || []).map(
				(obj: { value: Avo.ContentPage.Type; description?: string; comment?: string }) => ({
					value: obj.value,
					label: obj.description || obj.comment,
				})
			);
		} catch (err) {
			console.error('Failed to retrieve content types.', err, {
				query: this.getQueries().GetContentTypesDocument,
			});
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t(
					'modules/admin/content-page/services/content-page___error'
				),
				description: Config.getConfig().services.i18n.t(
					'admin/content/content___er-ging-iets-mis-tijdens-het-ophalen-van-de-content-types'
				),
				type: ToastType.ERROR,
			});

			return null;
		}
	}

	public static async fetchLabelsByContentType(
		contentType: string
	): Promise<Avo.ContentPage.Label[]> {
		let variables: any;

		try {
			variables = {
				contentType,
			};

			const response = await dataService.query({
				variables,
				query: this.getQueries().GetContentLabelsByContentTypeDocument,
			});

			if (response.errors) {
				throw new CustomError(
					'Failed to get content labels by content type from database because of graphql errors',
					null,
					{ response }
				);
			}

			const labels =
				get(response, 'data.app_content_labels') || get(response, 'data.app_content_label');

			if (!labels) {
				throw new CustomError('The response does not contain any labels', null, {
					response,
				});
			}

			return labels;
		} catch (err) {
			throw new CustomError(
				'Failed to get content labels by content type from database',
				err,
				{
					variables,
					query: 'GET_CONTENT_LABELS_BY_CONTENT_TYPE',
				}
			);
		}
	}

	public static async insertContentLabelsLinks(
		contentPageId: number | string, // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
		labelIds: (number | string)[]
	): Promise<void> {
		let variables: any;
		try {
			variables = {
				objects: labelIds.map((labelId) => ({
					content_id: contentPageId,
					label_id: labelId,
				})),
			};

			const response = await dataService.query({
				variables,
				query: this.getQueries().InsertContentLabelLinksDocument,
			});

			if (response.errors) {
				throw new CustomError('Failed due to graphql errors', null, { response });
			}
		} catch (err) {
			throw new CustomError('Failed to insert content label links in the database', err, {
				variables,
				query: 'INSERT_CONTENT_LABEL_LINKS',
			});
		}
	}

	public static async deleteContentLabelsLinks(
		contentPageId: number | string, // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
		labelIds: (number | string)[]
	): Promise<void> {
		let variables: any;

		try {
			variables = {
				labelIds,
				contentPageId,
			};

			const response = await dataService.query({
				variables,
				query: this.getQueries().DeleteContentLabelLinksDocument,
			});

			if (response.errors) {
				throw new CustomError('Failed due to graphql errors', null, { response });
			}
		} catch (err) {
			throw new CustomError('Failed to insert content label links in the database', err, {
				variables,
				query: 'DELETE_CONTENT_LABEL_LINKS',
			});
		}
	}

	public static async fetchContentPages(
		page: number,
		sortColumn: ContentOverviewTableCols,
		sortOrder: Avo.Search.OrderDirection,
		tableColumnDataType: string,
		where: any
	): Promise<[ContentPageInfo[], number]> {
		let variables: any;
		try {
			variables = {
				where,
				offset: ITEMS_PER_PAGE * page,
				limit: ITEMS_PER_PAGE,
				orderBy: getOrderObject(
					sortColumn,
					sortOrder,
					tableColumnDataType,
					TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT
				),
			};

			const response = await dataService.query({
				variables,
				query: this.getQueries().GetContentPagesDocument,
			});

			const dbContentPages: ContentPageDb[] | null =
				get(response, CONTENT_RESULT_PATH.GET[0]) ||
				get(response, CONTENT_RESULT_PATH.GET[1]) ||
				[];

			const dbContentPageCount: number =
				get(response, CONTENT_RESULT_PATH.COUNT[0]) ||
				get(response, CONTENT_RESULT_PATH.COUNT[1]) ||
				0;

			if (!dbContentPages) {
				throw new CustomError('Response did not contain any content pages', null, {
					response,
				});
			}

			return [convertToContentPageInfos(dbContentPages), dbContentPageCount];
		} catch (err) {
			throw new CustomError('Failed to get content pages from the database', err, {
				variables,
				query: 'GET_CONTENT_PAGES',
			});
		}
	}

	private static cleanupBeforeInsert(
		dbContentPage: Partial<ContentPageDb>
	): Partial<ContentPageDb> {
		return omit(dbContentPage, [
			'contentBlockssBycontentId',
			'content_blocks',
			'profile',
			'__typename',
			'content_content_labels',
			'id',
		]);
	}

	public static async insertContentPage(
		contentPage: Partial<ContentPageInfo>
	): Promise<Partial<ContentPageInfo> | null> {
		try {
			const dbContentPage = this.cleanupBeforeInsert(
				convertToDatabaseContentPage(contentPage)
			);
			const response = await dataService.query({
				query: this.getQueries().InsertContentDocument,
				variables: {
					contentPage: dbContentPage,
				},
			});

			if (response.errors) {
				throw new CustomError('Response contains errors', null, { response });
			}

			const id: number | null =
				get(response, CONTENT_RESULT_PATH.INSERT[0]) ||
				get(response, CONTENT_RESULT_PATH.INSERT[1]) ||
				null;

			if (id) {
				// Insert content-blocks
				let contentBlockConfigs: Partial<ContentBlockConfig>[] | null = null;
				if (contentPage.contentBlockConfigs && contentPage.contentBlockConfigs.length) {
					contentBlockConfigs = await ContentBlockService.insertContentBlocks(
						id,
						contentPage.contentBlockConfigs
					);

					if (!contentBlockConfigs) {
						// return null to prevent triggering success toast
						return null;
					}
				}

				return { ...contentPage, contentBlockConfigs, id } as Partial<ContentPageInfo>;
			}

			return null;
		} catch (err) {
			console.error('Failed to insert content page into the database', err);
			return null;
		}
	}

	public static async updateContentPage(
		contentPage: Partial<ContentPageInfo>,
		initialContentPage: Partial<ContentPageInfo> | undefined
	): Promise<Partial<ContentPageInfo> | null> {
		try {
			const dbContentPage = this.cleanupBeforeInsert(
				convertToDatabaseContentPage(contentPage)
			);
			const response = await dataService.query({
				query: this.getQueries().UpdateContentByIdDocument,
				variables: {
					contentPage: dbContentPage,
					id: contentPage.id,
				},
			});

			if (response.errors) {
				throw new CustomError('Response contains errors', null, { response });
			}

			const updatedContent =
				get(response, CONTENT_RESULT_PATH.UPDATE[0]) ||
				get(response, CONTENT_RESULT_PATH.UPDATE[1]) ||
				null;
			if (!updatedContent) {
				throw new CustomError(
					'Content page update returned empty response',
					null,
					response
				);
			}

			if (contentPage.contentBlockConfigs && initialContentPage) {
				await ContentBlockService.updateContentBlocks(
					contentPage.id as number,
					initialContentPage.contentBlockConfigs || [],
					contentPage.contentBlockConfigs
				);
			}

			return contentPage;
		} catch (err) {
			console.error('Failed to save content', err);
			return null;
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
					const htmlKey: string = String(key).substr(
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
					delete obj[key];
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
			contentToInsert.is_public = false;
			contentToInsert.published_at = null;
			contentToInsert.depublish_at = null;
			contentToInsert.publish_at = null;
			contentToInsert.path = null;
			contentToInsert.created_at = moment().toISOString();
			contentToInsert.updated_at = contentToInsert.created_at;
			contentToInsert.user_profile_id = profileId;

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
		try {
			const response = await dataService.query({
				variables: { id },
				query: this.getQueries().SoftDeleteContentDocument,
			});

			if (response.errors) {
				throw new CustomError('Failed due to graphql errors', null, { response });
			}
		} catch (err) {
			throw new CustomError('Failed to delete content page from the database', err, {
				id,
				query: this.getQueries().SoftDeleteContentDocument,
			});
		}
	}

	public static getDescription(
		contentPageInfo: ContentPageInfo,
		sanitizePreset: SanitizePreset = 'link'
	): string | null {
		const description = contentPageInfo.description_state
			? contentPageInfo.description_state.toHTML()
			: contentPageInfo.description_html || null;
		return description ? sanitizeHtml(description, sanitizePreset) : null;
	}

	/**
	 * Get a content page with all of its content without the user having o be logged in
	 * @param path The path to identify the content page including the leading slash. eg: /over
	 */
	public static async getContentPageByPath(path: string): Promise<ContentPageInfo | null> {
		try {
			const response = await fetchWithLogout(
				`${Config.getConfig().database.proxyUrl}/admin/content-pages?${stringify({
					path,
				})}`,
				{
					method: 'GET',
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
				// Ignore bad parse errors, error is still handled below
			}
			if (response.status < 200 || response.status >= 400) {
				throw new CustomError('Failed to get content page from /content-pages', null, {
					path,
					response,
					responseContent,
				});
			}
			if (responseContent.error) {
				return responseContent.error;
			}
			return convertToContentPageInfo(responseContent);
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
			const response = await fetchWithLogout(
				`${Config.getConfig().database.proxyUrl}/admin/content-pages/path-exist?${stringify(
					{
						path,
					}
				)}`,
				{
					method: 'GET',
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
				// Ignore bad parse errors, error is still handled below
			}
			if (response.status < 200 || response.status >= 400) {
				throw new CustomError(
					'Failed to check if content page exists from /content-pages/path-exist',
					null,
					{
						path,
						response,
						responseContent,
					}
				);
			}
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
		let url: string | undefined;
		let body: any | undefined;
		try {
			url = `${Config.getConfig().database.proxyUrl}/admin/content-pages`;
			body = {
				searchQuery,
				searchQueryLimit,
				mediaItems,
			};
			const response = await fetchWithLogout(url, {
				method: 'POST',
				body: JSON.stringify(body),
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			if (response.status < 200 || response.status >= 400) {
				throw new CustomError('response status was unexpected', null, { response });
			}
			return await response.json();
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
}
