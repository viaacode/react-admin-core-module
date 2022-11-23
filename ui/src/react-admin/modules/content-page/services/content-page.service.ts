import { ButtonAction } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { isArray, isFunction, isPlainObject, kebabCase, omit } from 'lodash-es';
import moment from 'moment';
import { stringify } from 'query-string';

import { AvoOrHetArchief } from '../../shared/types';
import { fetchWithLogout } from '../../shared/helpers/fetch-with-logout';
import { mapDeep } from '../../shared/helpers/map-deep/map-deep';
import { sanitizeHtml } from '../../shared/helpers/sanitize';
import { SanitizePreset } from '../../shared/helpers/sanitize/presets';
import { dataService } from '../../shared/services/data-service';
import { ResolvedItemOrCollection } from '../components/wrappers/MediaGridWrapper/MediaGridWrapper.types';
import {
	ITEMS_PER_PAGE,
	TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT,
} from '../const/content-page.consts';
import {
	convertToContentPageInfo,
	convertToContentPageInfos,
	convertToDatabaseContentPage,
} from '../helpers/parsers';
import { CONTENT_PAGE_QUERIES, ContentPageQueryTypes } from '../queries/content-pages.queries';
import { ContentBlockConfig } from '../types/content-block.types';
import {
	ContentOverviewTableCols,
	ContentPageDb,
	ContentPageInfo,
} from '../types/content-pages.types';

import { ContentBlockService } from './content-block.service';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { getOrderObject } from '~modules/shared/helpers/generate-order-gql-query';
import { CONTENT_PAGE_SERVICE_BASE_URL } from '~modules/content-page/services/content-page.const';
import { RichEditorStateKey } from '~modules/content-page/const/rich-text-editor.consts';
import { Order_By } from '~generated/graphql-db-types-avo';
import { App_Content_Page_Insert_Input } from '~generated/graphql-db-types-hetarchief';

export class ContentPageService {
	private static getQueries() {
		return CONTENT_PAGE_QUERIES[
			AdminConfigManager.getConfig().database.databaseApplicationType
		];
	}

	public static async getPublicContentItems(limit: number): Promise<ContentPageInfo[] | null> {
		const response = await dataService.query<
			ContentPageQueryTypes['GetContentPagesQuery'],
			ContentPageQueryTypes['GetContentPagesQueryVariables']
		>({
			query: this.getQueries().GetContentPagesDocument,
			variables: {
				limit,
				orderBy: { title: Order_By.Asc },
				where: { is_public: { _eq: true }, is_deleted: { _eq: false } },
			},
		});

		return convertToContentPageInfos(
			(response as any).app_content || (response as any).app_content_page
		) as ContentPageInfo[];
	}

	public static async getPublicProjectContentItems(limit: number): Promise<ContentPageInfo[]> {
		const response = await dataService.query<
			ContentPageQueryTypes['GetPublicProjectContentPagesQuery'],
			ContentPageQueryTypes['GetPublicProjectContentPagesQueryVariables']
		>({
			query: this.getQueries().GetPublicProjectContentPagesDocument,
			variables: {
				limit,
				orderBy: { title: Order_By.Asc },
			},
		});
		return ((response as ContentPageQueryTypes['GetPublicProjectContentPagesQueryAvo'])
			.app_content ||
			(response as ContentPageQueryTypes['GetPublicProjectContentPagesQueryHetArchief'])
				.app_content_page ||
			[]) as ContentPageInfo[];
	}

	public static async getPublicContentItemsByTitle(
		title: string,
		limit?: number
	): Promise<ContentPageInfo[]> {
		const response = await dataService.query<
			ContentPageQueryTypes['GetPublicContentPagesByTitleQuery'],
			ContentPageQueryTypes['GetPublicContentPagesByTitleQueryVariables']
		>({
			query: this.getQueries().GetPublicContentPagesByTitleDocument,
			variables: {
				limit: limit || null,
				orderBy: { title: Order_By.Asc },
				where: {
					title: { _ilike: `%${title}%` },
					is_public: { _eq: true },
					is_deleted: { _eq: false },
				},
			},
		});

		return ((response as ContentPageQueryTypes['GetPublicContentPagesByTitleQueryAvo'])
			.app_content ||
			(response as ContentPageQueryTypes['GetPublicContentPagesByTitleQueryHetArchief'])
				.app_content_page ||
			[]) as ContentPageInfo[];
	}

	public static async getPublicProjectContentItemsByTitle(
		title: string,
		limit: number
	): Promise<Partial<ContentPageInfo>[] | null> {
		const response = await dataService.query<
			ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQuery'],
			ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQueryVariables']
		>({
			query: this.getQueries().GetPublicProjectContentPagesByTitleDocument,
			variables: {
				title,
				limit,
				orderBy: { title: Order_By.Asc },
			},
		});
		return (
			(response as ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQueryAvo'])
				.app_content ||
			(
				response as ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQueryHetArchief']
			).app_content_page
		);
	}

	public static async getContentPageById(id: number | string): Promise<ContentPageInfo> {
		const response = await dataService.query<
			ContentPageQueryTypes['GetContentByIdQuery'],
			ContentPageQueryTypes['GetContentByIdQueryVariables']
		>({
			query: this.getQueries().GetContentByIdDocument,
			variables: {
				id,
			},
		});

		const dbContentPage = ((response as ContentPageQueryTypes['GetContentByIdQueryAvo'])
			.app_content ||
			(response as ContentPageQueryTypes['GetContentByIdQueryHetArchief']).app_content_page ||
			[])?.[0];

		if (!dbContentPage) {
			throw new CustomError('No content page found with provided id', null, {
				id,
				code: 'NOT_FOUND',
			});
		}
		return convertToContentPageInfo(dbContentPage as unknown as ContentPageDb);
	}

	public static async getContentTypes(): Promise<
		{ value: Avo.ContentPage.Type; label: string }[] | null
	> {
		try {
			const response = await dataService.query<ContentPageQueryTypes['GetContentTypesQuery']>(
				{
					query: this.getQueries().GetContentTypesDocument,
				}
			);
			const contentTypes =
				(response as ContentPageQueryTypes['GetContentTypesQueryAvo'])
					.lookup_enum_content_types ||
				(response as ContentPageQueryTypes['GetContentTypesQueryHetArchief'])
					.lookup_app_content_type;

			return (contentTypes || []).map((obj) => ({
				value: obj.value,
				label: obj.description || (obj as any).comment,
			})) as { value: Avo.ContentPage.Type; label: string }[] | null;
		} catch (err) {
			console.error('Failed to retrieve content types.', err, {
				query: this.getQueries().GetContentTypesDocument,
			});
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.tText(
					'modules/admin/content-page/services/content-page___error'
				),
				description: AdminConfigManager.getConfig().services.i18n.tText(
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
		try {
			const response = await dataService.query<
				ContentPageQueryTypes['GetContentLabelsByContentTypeQuery'],
				ContentPageQueryTypes['GetContentLabelsByContentTypeQueryVariables']
			>({
				query: this.getQueries().GetContentLabelsByContentTypeDocument,
				variables: {
					contentType,
				},
			});

			const labels =
				(response as any).app_content_labels || (response as any).app_content_label;

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
					variables: {
						contentType,
					},
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

			await dataService.query<
				ContentPageQueryTypes['InsertContentLabelLinksMutation'],
				ContentPageQueryTypes['InsertContentLabelLinksMutationVariables']
			>({
				variables,
				query: this.getQueries().InsertContentLabelLinksDocument,
			});
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
		try {
			await dataService.query<
				ContentPageQueryTypes['DeleteContentLabelLinksMutation'],
				ContentPageQueryTypes['DeleteContentLabelLinksMutationVariables']
			>({
				query: this.getQueries().DeleteContentLabelLinksDocument,
				variables: {
					labelIds,
					contentPageId,
				},
			});
		} catch (err) {
			throw new CustomError('Failed to insert content label links in the database', err, {
				variables: {
					labelIds,
					contentPageId,
				},
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
		let variables: ContentPageQueryTypes['GetContentPagesQueryVariables'] | null = null;
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

			const response = await dataService.query<
				ContentPageQueryTypes['GetContentPagesQuery'],
				ContentPageQueryTypes['GetContentPagesQueryVariables']
			>({
				query: this.getQueries().GetContentPagesDocument,
				variables,
			});

			const dbContentPages = ((response as ContentPageQueryTypes['GetContentPagesQueryAvo'])
				.app_content ||
				(response as ContentPageQueryTypes['GetContentPagesQueryHetArchief'])
					.app_content_page ||
				[]) as ContentPageDb[];

			const dbContentPageCount: number =
				(response as ContentPageQueryTypes['GetContentPagesQueryAvo']).app_content_aggregate
					?.aggregate?.count ||
				(response as ContentPageQueryTypes['GetContentPagesQueryHetArchief'])
					.app_content_page_aggregate?.aggregate?.count ||
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
			const response = await dataService.query<
				ContentPageQueryTypes['InsertContentMutation'],
				ContentPageQueryTypes['InsertContentMutationVariables']
			>({
				query: this.getQueries().InsertContentDocument,
				variables: {
					contentPage: dbContentPage as App_Content_Page_Insert_Input,
				},
			});

			const id: number | null =
				(response as ContentPageQueryTypes['InsertContentMutationAvo']).insert_app_content
					?.returning?.[0]?.id ||
				(response as ContentPageQueryTypes['InsertContentMutationHetArchief'])
					.insert_app_content_page?.returning?.[0]?.id ||
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
			const response = await dataService.query<
				ContentPageQueryTypes['UpdateContentByIdMutation'],
				ContentPageQueryTypes['UpdateContentByIdMutationVariables']
			>({
				query: this.getQueries().UpdateContentByIdDocument,
				variables: {
					contentPage: dbContentPage,
					id: contentPage.id,
				},
			});

			const updatedContent =
				(response as ContentPageQueryTypes['UpdateContentByIdMutationAvo'])
					.update_app_content?.affected_rows ||
				(response as ContentPageQueryTypes['UpdateContentByIdMutationHetArchief'])
					.update_app_content_page?.affected_rows ||
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
			// query path
			const contentPage = await ContentPageService.getContentPageById(id);
			await dataService.query<
				ContentPageQueryTypes['SoftDeleteContentMutation'],
				ContentPageQueryTypes['SoftDeleteContentMutationVariables']
			>({
				variables: { id, path: `${contentPage.path}-${id}` },
				query: this.getQueries().SoftDeleteContentDocument,
			});
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
				`${
					AdminConfigManager.getConfig().database.proxyUrl
				}/${CONTENT_PAGE_SERVICE_BASE_URL}?${stringify({
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
			if (!responseContent || response.status < 200 || response.status >= 400) {
				throw new CustomError('Failed to get content page from /content-pages', null, {
					path,
					response,
					responseContent,
				});
			}
			if (responseContent?.error) {
				return responseContent?.error;
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
				`${
					AdminConfigManager.getConfig().database.proxyUrl
				}/admin/content-pages/path-exist?${stringify({
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
			switch (AdminConfigManager.getConfig().database.databaseApplicationType) {
				case AvoOrHetArchief.hetArchief:
					url = `${AdminConfigManager.getConfig().database.proxyUrl}/admin/content-pages`;
					break;

				case AvoOrHetArchief.avo:
					url = `${AdminConfigManager.getConfig().database.proxyUrl}/content-pages`;
					break;

				default:
					throw new Error('Could not determine URL to poll for content-pages');
			}

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
