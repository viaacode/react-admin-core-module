import {
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';

import type { IPagination } from '@studiohyperdrive/pagination';
import { Pagination } from '@studiohyperdrive/pagination';
import type { Avo } from '@viaa/avo2-types';
import * as promiseUtils from 'blend-promise-utils';
import { setHours, setMinutes } from 'date-fns';
import { Request } from 'express';
import {
	compact,
	fromPairs,
	has,
	isEmpty,
	keys,
	omit,
	set,
	without,
} from 'lodash';
import { getOrderObject } from 'src/modules/shared/helpers/generate-order-gql-query';
import { DataService } from '../../data';
import { AdminOrganisationsService, Organisation } from '../../organisations';
import { PlayerTicketService } from '../../player-ticket';

import {
	App_Content_Blocks_Insert_Input,
	GetCollectionTileByIdDocument,
	GetCollectionTileByIdQuery,
	GetCollectionTileByIdQueryVariables,
	GetItemByExternalIdDocument,
	GetItemByExternalIdQuery,
	GetItemByExternalIdQueryVariables,
	GetItemTileByIdDocument,
	GetItemTileByIdQuery,
	GetItemTileByIdQueryVariables,
	Order_By,
} from '../../shared/generated/graphql-db-types-avo';
import { CustomError } from '../../shared/helpers/custom-error';
import { getDatabaseType } from '../../shared/helpers/get-database-type';
import { isHetArchief } from '../../shared/helpers/is-hetarchief';
import { DatabaseType } from '@viaa/avo2-types';
import { ContentBlockConfig, ContentBlockType } from '../content-block.types';
import {
	DEFAULT_AUDIO_STILL,
	MEDIA_PLAYER_BLOCKS,
	TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT,
} from '../content-pages.consts';

import {
	ContentOverviewTableCols,
	ContentPage,
	ContentPageLabel,
	ContentPageOverviewResponse,
	ContentPageType,
	ContentPageUser,
	ContentWidth,
	FetchSearchQueryFunctionAvo,
	GqlAvoUser,
	GqlContentBlock,
	GqlContentPage,
	GqlHetArchiefUser,
	GqlInsertOrUpdateContentBlock,
	GqlUser,
	MediaItemResponse,
	MediaItemType,
	ResolvedItemOrCollection,
} from '../content-pages.types';
import { ContentPageOverviewParams } from '../dto/content-pages.dto';
import { MediaItemsDto } from '../dto/resolve-media-grid-blocks.dto';
import {
	CONTENT_PAGE_QUERIES,
	ContentPageQueryTypes,
} from '../queries/content-pages.queries';

@Injectable()
export class ContentPagesService {
	private logger: Logger = new Logger(ContentPagesService.name, {
		timestamp: true,
	});
	private fetchSearchQueryAvo: FetchSearchQueryFunctionAvo | null = null;
	private readonly appType: DatabaseType;

	constructor(
		@Inject(forwardRef(() => DataService)) protected dataService: DataService,
		protected playerTicketService: PlayerTicketService,
		protected organisationsService: AdminOrganisationsService,
	) {
		this.appType = getDatabaseType();
	}

	public setSearchQueryFunction(fetchSearchQuery: FetchSearchQueryFunctionAvo) {
		this.fetchSearchQueryAvo = fetchSearchQuery;
	}

	/**
	 * Adapt a space as returned by a typical graphQl response to our internal space data model
	 */
	public adaptContentBlock(
		contentBlock: GqlContentBlock,
	): ContentBlockConfig | null {
		if (!contentBlock) {
			return null;
		}
		/* istanbul ignore next */
		return {
			id: contentBlock?.id,
			name: contentBlock?.content_block_type,
			type: contentBlock?.content_block_type as unknown as ContentBlockType,
			created_at: contentBlock?.created_at,
			updated_at: contentBlock?.updated_at,
			position: contentBlock?.position,
			block: contentBlock?.variables?.blockState,
			components: contentBlock?.variables?.componentState,
		};
	}

	public adaptUser(gqlUser: GqlUser): ContentPageUser | null {
		if (!gqlUser) {
			return null;
		}
		const mergedUser = {
			gqlUser,
			...(gqlUser as GqlAvoUser)?.user,
		} as unknown as GqlHetArchiefUser & GqlAvoUser & GqlAvoUser['user'];
		/* istanbul ignore next */
		return {
			id: mergedUser?.id,
			fullName: mergedUser?.first_name + ' ' + mergedUser?.last_name,
			firstName: mergedUser?.first_name,
			lastName: mergedUser?.last_name,
			groupId: mergedUser?.role?.id || mergedUser?.group?.id,
			groupName: mergedUser?.role?.label || mergedUser?.group?.label,
		};
	}

	public adaptContentPage(gqlContentPage: GqlContentPage): ContentPage | null {
		if (!gqlContentPage) {
			return null;
		}
		const owner = this.adaptUser(
			(gqlContentPage as any)?.owner_profile ||
				(gqlContentPage as any)?.profile,
		);
		/* istanbul ignore next */
		return {
			id: gqlContentPage?.id,
			thumbnailPath: gqlContentPage?.thumbnail_path,
			title: gqlContentPage?.title,
			description: gqlContentPage?.description,
			seoDescription: gqlContentPage?.seo_description,
			metaDescription: gqlContentPage?.meta_description,
			path: gqlContentPage?.path,
			isPublic: gqlContentPage?.is_public,
			publishedAt: gqlContentPage?.published_at,
			publishAt: gqlContentPage?.publish_at,
			depublishAt: gqlContentPage?.depublish_at,
			createdAt: gqlContentPage?.created_at,
			updatedAt: gqlContentPage?.updated_at,
			isProtected: gqlContentPage?.is_protected,
			contentType: gqlContentPage?.content_type as ContentPageType,
			contentWidth: gqlContentPage?.content_width as ContentWidth,
			owner,
			userProfileId: gqlContentPage?.user_profile_id,
			userGroupIds: gqlContentPage?.user_group_ids,
			content_blocks: (
				(gqlContentPage as any)?.content_blocks ||
				(gqlContentPage as any)?.contentBlockssBycontentId ||
				[]
			).map(this.adaptContentBlock),
			labels: (gqlContentPage?.content_content_labels || []).map(
				(labelObj): ContentPageLabel => ({
					id: labelObj?.content_label?.id,
					content_type: gqlContentPage?.content_type as ContentPageType,
					label: labelObj?.content_label?.label,
					link_to: labelObj?.content_label?.link_to,
					created_at: labelObj?.content_label?.created_at,
					updated_at: labelObj?.content_label?.updated_at,
				}),
			),
		};
	}

	private getLabelFilter(labelIds: (string | number)[]): any[] {
		if (labelIds.length) {
			// The user selected some block labels at the top of the page overview component
			return [
				{
					content_content_labels: {
						content_label: { id: { _in: labelIds } },
					},
				},
			];
		}
		return [];
	}

	private convertToDatabaseContentPage(
		contentPageInfo: Partial<ContentPage>,
	): GqlInsertOrUpdateContentBlock {
		return {
			id: contentPageInfo.id,
			thumbnail_path: contentPageInfo.thumbnailPath,
			title: contentPageInfo.title,
			description: contentPageInfo.description || null,
			seo_description: contentPageInfo.seoDescription || null,
			meta_description: contentPageInfo.metaDescription || null,
			is_protected: contentPageInfo.isProtected,
			is_public: contentPageInfo.isPublic,
			path: contentPageInfo.path,
			content_type: contentPageInfo.contentType,
			content_width: contentPageInfo.contentWidth,
			publish_at: contentPageInfo.publishAt || null,
			depublish_at: contentPageInfo.depublishAt || null,
			published_at: contentPageInfo.publishedAt || null,
			created_at: contentPageInfo.createdAt || null,
			updated_at: contentPageInfo.updatedAt || null,
			user_group_ids: contentPageInfo.userGroupIds,
			user_profile_id: contentPageInfo.userProfileId,
		};
	}

	public async getContentPagesForOverview(
		inputQuery: ContentPageOverviewParams,
		userGroupIds: string[],
	): Promise<
		IPagination<ContentPage> & { labelCounts: Record<string, number> }
	> {
		const {
			withBlock,
			contentType,
			labelIds,
			selectedLabelIds,
			orderProp,
			orderDirection,
			page,
			size,
		} = inputQuery;
		const now = new Date().toISOString();
		const variables = {
			limit: size,
			labelIds: compact(labelIds || []),
			offset: (page - 1) * size,
			where: {
				_and: [
					{
						// Get content pages with the selected content type
						content_type: { _eq: contentType },
					},
					{
						// Get pages that are visible to the current user
						_or: userGroupIds.map((userGroupId) => ({
							user_group_ids: { _contains: userGroupId },
						})),
					},
					...this.getLabelFilter(selectedLabelIds || []),
					// publish state
					{
						_or: [
							{ is_public: { _eq: true } },
							{ publish_at: { _is_null: true }, depublish_at: { _gte: now } },
							{ publish_at: { _lte: now }, depublish_at: { _is_null: true } },
							{ publish_at: { _lte: now }, depublish_at: { _gte: now } },
						],
					},
					{ is_deleted: { _eq: false } },
				],
			},
			orderBy: { [orderProp]: orderDirection },
			orUserGroupIds: userGroupIds.map((userGroupId) => ({
				content: { user_group_ids: { _contains: userGroupId } },
			})),
		};
		const response = await this.dataService.execute<
			| ContentPageQueryTypes['GetContentPagesWithBlocksQuery']
			| ContentPageQueryTypes['GetContentPagesQuery'],
			| ContentPageQueryTypes['GetContentPagesWithBlocksQueryVariables']
			| ContentPageQueryTypes['GetContentPagesQueryVariables']
		>(
			withBlock
				? CONTENT_PAGE_QUERIES[getDatabaseType()]
						.GetContentPagesWithBlocksDocument
				: CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentPagesDocument,
			variables,
		);

		const responseAvo = response as
			| ContentPageQueryTypes['GetContentPagesWithBlocksQueryAvo']
			| ContentPageQueryTypes['GetContentPagesQueryAvo'];
		const responseHetArchief = response as
			| ContentPageQueryTypes['GetContentPagesWithBlocksQueryHetArchief']
			| ContentPageQueryTypes['GetContentPagesQueryHetArchief'];

		const count =
			responseAvo.app_content_aggregate?.aggregate?.count ||
			responseHetArchief.app_content_page_aggregate?.aggregate?.count ||
			0;
		const contentPageLabels =
			responseAvo.app_content_labels ||
			responseHetArchief.app_content_label ||
			[];

		const contentBlocks = (
			responseAvo.app_content ||
			responseHetArchief.app_content_page ||
			[]
		).map(this.adaptContentBlock.bind(this)) as ContentPage[];

		return {
			...Pagination<ContentPage>({
				items: contentBlocks,
				page,
				size,
				total: count,
			}),
			labelCounts: fromPairs(
				contentPageLabels.map((labelInfo: any): [number, number] => [
					labelInfo?.id,
					labelInfo?.content_content_labels_aggregate?.aggregate?.count ||
						labelInfo?.content_page_content_label_aggregate?.aggregate?.count ||
						0,
				]),
			),
		};
	}

	public async getContentPageByPath(path: string): Promise<ContentPage | null> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetContentPageByPathQuery'],
			ContentPageQueryTypes['GetContentPageByPathQueryVariables']
		>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentPageByPathDocument, {
			path,
		});
		const contentPage: GqlContentPage | undefined =
			(response as ContentPageQueryTypes['GetContentPageByPathQueryHetArchief'])
				?.app_content_page?.[0] ||
			(response as ContentPageQueryTypes['GetContentPageByPathQueryAvo'])
				?.app_content?.[0];

		return this.adaptContentPage(contentPage);
	}

	public async fetchCollectionOrItem(
		type: 'ITEM' | 'COLLECTION',
		id: string,
	): Promise<MediaItemResponse | null> {
		if (isHetArchief()) {
			throw new InternalServerErrorException({
				message:
					'Trying to resolve item or collection from AvO inside the hetArchief database. Only objects are supported.',
				additionalInfo: {
					type,
					id,
				},
			});
		}
		const response = await this.dataService.execute<
			GetItemTileByIdQuery | GetCollectionTileByIdQuery,
			GetItemTileByIdQueryVariables | GetCollectionTileByIdQueryVariables
		>(
			type === 'ITEM' ? GetItemTileByIdDocument : GetCollectionTileByIdDocument,
			{ id },
		);

		const itemOrCollection = response?.obj?.[0] || null;

		return {
			...itemOrCollection,
			count:
				itemOrCollection?.view_counts_aggregate?.aggregate?.sum?.count || 0,
		};
	}

	public async fetchItemByExternalId(
		externalId: string,
	): Promise<Partial<Avo.Item.Item> | null> {
		if (isHetArchief()) {
			throw new InternalServerErrorException({
				message:
					'Trying to fetch item from AvO inside the hetArchief database. Only objects are supported.',
				additionalInfo: {
					externalId,
				},
			});
		}

		const response = await this.dataService.execute<
			GetItemByExternalIdQuery,
			GetItemByExternalIdQueryVariables
		>(GetItemByExternalIdDocument, {
			externalId,
		});

		return (response.app_item_meta?.[0] ||
			null) as Partial<Avo.Item.Item> | null;
	}

	public async updatePublishDates(): Promise<{
		published: number;
		unpublished: number;
	}> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['UpdateContentPagePublishDatesMutation'],
			ContentPageQueryTypes['UpdateContentPagePublishDatesMutationVariables']
		>(
			CONTENT_PAGE_QUERIES[getDatabaseType()]
				.UpdateContentPagePublishDatesDocument,
			{
				now: new Date().toISOString(),
				publishedAt: setMinutes(setHours(new Date(), 7), 0).toISOString(),
			},
		);
		return {
			published: response.publish_content_pages?.affected_rows || 0,
			unpublished: response.unpublish_content_pages?.affected_rows || 0,
		};
	}

	public async getContentPagesByIds(
		contentPageIds: number[],
	): Promise<ContentPage[]> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetContentByIdsQuery'],
			ContentPageQueryTypes['GetContentByIdsQueryVariables']
		>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentByIdsDocument, {
			ids: contentPageIds,
		});

		return (
			(response as ContentPageQueryTypes['GetContentByIdsQueryAvo'])
				.app_content ||
			(response as ContentPageQueryTypes['GetContentByIdsQueryHetArchief'])
				.app_content_page ||
			[]
		).map(this.adaptContentBlock.bind(this)) as ContentPage[];
	}

	public async resolveMediaTileItemsInPage(
		contentPage: ContentPage,
		request: Request,
	) {
		const mediaGridBlocks = contentPage.content_blocks.filter(
			(contentBlock) => contentBlock.type === 'MEDIA_GRID',
		);
		if (mediaGridBlocks.length) {
			const mapperFunc = async (mediaGridBlock: any) => {
				try {
					const searchQuery =
						mediaGridBlock?.variables?.blockState?.searchQuery?.value;
					const searchQueryLimit =
						mediaGridBlock?.variables?.blockState?.searchQueryLimit;
					const mediaItems = (
						mediaGridBlock?.variables?.componentState || []
					).filter((item: any) => item.mediaItem);

					const results: any[] = await this.resolveMediaTileItems(
						searchQuery,
						searchQueryLimit,
						mediaItems,
						request,
					);

					set(mediaGridBlock, 'variables.blockState.results', results);
				} catch (err) {
					this.logger.error({
						message: 'Failed to resolve media grid content',
						innerException: err,
						additionalInfo: {
							mediaGridBlocks,
							mediaGridBlock,
						},
					});
				}
			};

			await promiseUtils.mapLimit(mediaGridBlocks, 2, mapperFunc.bind(this));
		}
	}

	public async resolveMediaPlayersInPage(
		contentPage: ContentPage,
		request: Request,
	) {
		const mediaPlayerBlocks = contentPage.content_blocks.filter(
			(contentBlock) => keys(MEDIA_PLAYER_BLOCKS).includes(contentBlock.type),
		);
		if (mediaPlayerBlocks.length) {
			await promiseUtils.mapLimit(
				mediaPlayerBlocks,
				2,
				async (mediaPlayerBlock: any) => {
					try {
						const blockInfo =
							MEDIA_PLAYER_BLOCKS[mediaPlayerBlock.content_block_type];
						const externalId =
							mediaPlayerBlock?.blockInfo?.getItemExternalIdPath;
						if (externalId) {
							const itemInfo = await this.fetchItemByExternalId(externalId);
							let videoSrc: string | undefined;
							if (itemInfo && itemInfo.browse_path) {
								videoSrc = await this.playerTicketService.getPlayableUrl(
									itemInfo.browse_path,
									request.header('Referer') || 'http://localhost:3200/',
								);
							}

							// Copy all required properties to be able to render the video player without having to use the data route to fetch item information
							if (videoSrc && !mediaPlayerBlock?.blockInfo?.setVideoSrcPath) {
								set(mediaPlayerBlock, blockInfo.setVideoSrcPath, videoSrc);
							}
							[
								['external_id', 'setItemExternalIdPath'],
								['thumbnail_path', 'setPosterSrcPath'],
								['title', 'setTitlePath'],
								['description', 'setDescriptionPath'],
								['issued', 'setIssuedPath'],
								['organisation', 'setOrganisationPath'],
								['duration', 'setDurationPath'],
							].forEach((props) => {
								if (
									itemInfo &&
									(itemInfo as any)[props[0]] &&
									!mediaPlayerBlock?.blockInfo?.[props[1]]
								) {
									if (
										props[0] === 'thumbnail_path' &&
										itemInfo.type.label === 'audio'
									) {
										// Replace poster for audio items with default still
										set(
											mediaPlayerBlock,
											(blockInfo as any)[props[1]],
											DEFAULT_AUDIO_STILL,
										);
									} else {
										set(
											mediaPlayerBlock,
											(blockInfo as any)[props[1]],
											(itemInfo as any)[props[0]],
										);
									}
								}
							});
						}
					} catch (err) {
						this.logger.error({
							message: 'Failed to resolve media grid content',
							innerException: err,
							additionalInfo: {
								mediaPlayerBlocks,
								mediaPlayerBlock,
							},
						});
					}
				},
			);
		}
	}

	private async mapMediaItem(itemInfo, request) {
		const result: MediaItemResponse | null = await this.fetchCollectionOrItem(
			itemInfo.mediaItem.type === MediaItemType.BUNDLE
				? MediaItemType.COLLECTION
				: itemInfo.mediaItem.type,
			itemInfo.mediaItem.value,
		);
		if (result) {
			// Replace audio thumbnail
			if ((result as any)?.type?.label === 'audio') {
				result.thumbnailUrl = DEFAULT_AUDIO_STILL;
			}

			// Set video play url
			if ((result as any).browse_path) {
				(result as any).src = await this.getPlayableUrlByBrowsePathSilent(
					(result as any).browse_path,
					request,
				);
				delete (result as any).browse_path; // Do not expose browse_path to the world
			}
		}
		return result;
	}

	public async resolveMediaTileItems(
		searchQuery: string | undefined,
		searchQueryLimit: string | undefined,
		mediaItems: MediaItemsDto[] | undefined,
		request: Request,
	): Promise<Partial<Avo.Item.Item | Avo.Collection.Collection>[]> {
		let manualResults: any[] = [];
		let searchResults: any[] = [];

		// Check for items/collections
		const nonEmptyMediaItems = mediaItems.filter(
			(mediaItem) => !isEmpty(mediaItem),
		);
		if (nonEmptyMediaItems.length) {
			manualResults = await promiseUtils.mapLimit(
				nonEmptyMediaItems,
				10,
				(item) => this.mapMediaItem(item, request),
			);
		}

		// Check for search queries
		if (searchQuery) {
			if (!this.fetchSearchQueryAvo) {
				this.logger.warn(
					'resolveMediaTileItems through search queries is not supported for this app. Use ContentPagesController.setSearchQueryFunction to enable it',
				);
				searchResults = [];
			}
			// resolve search query to a list of results
			const parsedSearchQuery = JSON.parse(searchQuery);
			let searchQueryLimitNum: number = parseInt(searchQueryLimit, 10);
			if (isNaN(searchQueryLimitNum)) {
				searchQueryLimitNum = 8;
			}
			const searchResponse = await this.fetchSearchQueryAvo({
				from: 0,
				size: searchQueryLimitNum - manualResults.length, // Fetch less search results if the user already specified some manual results
				filters: parsedSearchQuery.filters || {},
				orderProperty: parsedSearchQuery.orderProperty || 'relevance',
				orderDirection: parsedSearchQuery.orderDirection || 'desc',
				index: 'all',
			});
			searchResults = await promiseUtils.mapLimit(
				searchResponse.results || [],
				8,
				(result) => this.mapSearchResultToItemOrCollection(result, request),
			);
		}

		return [...manualResults, ...searchResults];
	}

	private async mapSearchResultToItemOrCollection(
		searchResult: Avo.Search.ResultItem,
		request: Request,
	): Promise<ResolvedItemOrCollection> {
		const isItem =
			searchResult.administrative_type === 'video' ||
			searchResult.administrative_type === 'audio';
		const isAudio = searchResult.administrative_type === 'audio';

		if (isItem) {
			const item = {
				external_id: searchResult.external_id,
				title: searchResult.dc_title,
				created_at: searchResult.dcterms_issued,
				description: searchResult.dcterms_abstract,
				duration: searchResult.duration_time,
				lom_classification: searchResult.lom_classification,
				lom_context: searchResult.lom_context,
				lom_intended_enduser_role: searchResult.lom_intended_enduser_role,
				lom_keywords: searchResult.lom_keywords,
				lom_languages: searchResult.lom_languages,
				lom_typical_age_range: searchResult.lom_typical_age_range,
				issued: searchResult.dcterms_issued,
				thumbnail_path: isAudio
					? DEFAULT_AUDIO_STILL
					: searchResult.thumbnail_path,
				org_id: searchResult.original_cp_id,
				organisation: {
					name: searchResult.original_cp,
					or_id: searchResult.original_cp_id,
				} as Avo.Organization.Organization,
				series: searchResult.dc_titles_serie,
				type: {
					label: searchResult.administrative_type,
				} as any,
				view_counts_aggregate: {
					aggregate: {
						sum: {
							count: searchResult.views_count,
						},
					},
				},
			} as Partial<Avo.Item.Item> & { src?: string };
			if (isItem) {
				item.src = await this.getPlayableUrlByExternalIdSilent(
					searchResult.external_id,
					request,
				);
			}
			try {
				// TODO cache logos for quicker access
				const org: Organisation =
					await this.organisationsService.getOrganisation(
						searchResult.original_cp_id,
					);
				item.organisation.logo_url = org?.logo_url || null;
			} catch (err) {
				this.logger.error({
					message: 'Failed to set organization logo_url for item',
					innerException: err,
					additionalInfo: {
						external_id: searchResult.external_id,
						original_cp_id: searchResult.original_cp_id,
					},
				});
			}
			return item;
		}
		return {
			id: searchResult.id,
			title: searchResult.dc_title,
			created_at: searchResult.dcterms_issued,
			description: searchResult.dcterms_abstract,
			duration: searchResult.duration_time,
			lom_classification: searchResult.lom_classification,
			lom_context: searchResult.lom_context,
			lom_intended_enduser_role: searchResult.lom_intended_enduser_role,
			lom_keywords: searchResult.lom_keywords,
			lom_languages: searchResult.lom_languages,
			lom_typical_age_range: searchResult.lom_typical_age_range,
			issued: searchResult.dcterms_issued,
			thumbnail_path: searchResult.thumbnail_path,
			org_id: searchResult.original_cp_id,
			organisation: {
				name: searchResult.original_cp,
				or_id: searchResult.original_cp_id,
			} as Avo.Organization.Organization,
			series: searchResult.dc_titles_serie,
			type: {
				label: searchResult.administrative_type,
			} as Avo.Core.MediaType,
			collection_fragments_aggregate: {
				aggregate: {
					count: (searchResult as any).fragment_count || 0, // TODO add to typings repo after completion of: https://meemoo.atlassian.net/browse/AVO-1107
				},
			},
			view_counts_aggregate: {
				aggregate: {
					sum: {
						count: searchResult.views_count,
					},
				},
			},
		} as Partial<Avo.Collection.Collection>;
	}

	private async getPlayableUrlByExternalIdSilent(
		externalId: string,
		request: Request,
	): Promise<string | null> {
		try {
			return (
				(await this.playerTicketService.getPlayableUrl(
					externalId,
					request.header('Referer') || 'http://localhost:8080/',
				)) || null
			);
		} catch (err) {
			this.logger.error({
				message: 'Failed to get playable url for item',
				innerException: err,
				additionalInfo: {
					externalId,
				},
			});
			return null;
		}
	}

	private async getPlayableUrlByBrowsePathSilent(
		browsePath: string,
		request: Request,
	): Promise<string | null> {
		try {
			return (
				(await this.playerTicketService.getPlayableUrl(
					browsePath,
					request.header('Referer') || 'http://localhost:8080/',
				)) || null
			);
		} catch (err) {
			this.logger.error({
				message: 'Failed to get playable url for item',
				innerException: err,
				additionalInfo: {
					browsePath,
				},
			});
			return null;
		}
	}

	public async getPublicContentItems(
		limit: number,
	): Promise<
		| ContentPageQueryTypes['GetContentPagesQueryAvo']['app_content']
		| ContentPageQueryTypes['GetContentPagesQueryHetArchief']['app_content_page']
		| null
	> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetContentPagesQuery'],
			ContentPageQueryTypes['GetContentPagesQueryVariables']
		>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentPagesDocument, {
			limit,
			orderBy: { title: Order_By.Asc },
			where: { is_public: { _eq: true }, is_deleted: { _eq: false } },
		});

		return (response as any).app_content || (response as any).app_content_page;
	}

	public async getPublicProjectContentItems(
		limit: number,
	): Promise<
		| ContentPageQueryTypes['GetPublicProjectContentPagesQueryAvo']['app_content']
		| ContentPageQueryTypes['GetPublicProjectContentPagesQueryHetArchief']['app_content_page']
	> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetPublicProjectContentPagesQuery'],
			ContentPageQueryTypes['GetPublicProjectContentPagesQueryVariables']
		>(CONTENT_PAGE_QUERIES[this.appType].GetPublicProjectContentPagesDocument, {
			limit,
			orderBy: { title: Order_By.Asc },
		});
		return (
			(
				response as ContentPageQueryTypes['GetPublicProjectContentPagesQueryAvo']
			).app_content ||
			(
				response as ContentPageQueryTypes['GetPublicProjectContentPagesQueryHetArchief']
			).app_content_page ||
			[]
		);
	}

	public async getPublicContentItemsByTitle(
		title: string,
		limit?: number,
	): Promise<
		| ContentPageQueryTypes['GetPublicContentPagesByTitleQueryAvo']['app_content']
		| ContentPageQueryTypes['GetPublicContentPagesByTitleQueryHetArchief']['app_content_page']
	> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetPublicContentPagesByTitleQuery'],
			ContentPageQueryTypes['GetPublicContentPagesByTitleQueryVariables']
		>(CONTENT_PAGE_QUERIES[this.appType].GetPublicContentPagesByTitleDocument, {
			limit: limit || null,
			orderBy: { title: Order_By.Asc },
			where: {
				title: { _ilike: `%${title}%` },
				is_public: { _eq: true },
				is_deleted: { _eq: false },
			},
		});

		return (
			(
				response as ContentPageQueryTypes['GetPublicContentPagesByTitleQueryAvo']
			).app_content ||
			(
				response as ContentPageQueryTypes['GetPublicContentPagesByTitleQueryHetArchief']
			).app_content_page ||
			[]
		);
	}

	public async getPublicProjectContentItemsByTitle(
		title: string,
		limit: number,
	): Promise<
		| ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQueryAvo']['app_content']
		| ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQueryHetArchief']['app_content_page']
		| null
	> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQuery'],
			ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQueryVariables']
		>(
			CONTENT_PAGE_QUERIES[this.appType]
				.GetPublicProjectContentPagesByTitleDocument,
			{
				title,
				limit,
				orderBy: { title: Order_By.Asc },
			},
		);
		return (
			(
				response as ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQueryAvo']
			).app_content ||
			(
				response as ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQueryHetArchief']
			).app_content_page
		);
	}

	public async getContentPageById(id: string): Promise<ContentPage> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetContentByIdQuery'],
			ContentPageQueryTypes['GetContentByIdQueryVariables']
		>(CONTENT_PAGE_QUERIES[this.appType].GetContentByIdDocument, {
			id: this.appType === DatabaseType.avo ? parseInt(id) : id,
		});

		const dbContentPage = ((
			response as ContentPageQueryTypes['GetContentByIdQueryAvo']
		).app_content ||
			(response as ContentPageQueryTypes['GetContentByIdQueryHetArchief'])
				.app_content_page ||
			[])?.[0];

		if (!dbContentPage) {
			throw CustomError('No content page found with provided id', null, {
				id,
				code: 'NOT_FOUND',
			});
		}
		return this.adaptContentPage(dbContentPage);
	}

	public async getContentTypes(): Promise<
		{ value: Avo.ContentPage.Type; label: string }[] | null
	> {
		try {
			const response = await this.dataService.execute<
				ContentPageQueryTypes['GetContentTypesQuery']
			>(CONTENT_PAGE_QUERIES[this.appType].GetContentTypesDocument);
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
			throw CustomError('Failed to retrieve content types.', err, {
				query: CONTENT_PAGE_QUERIES[this.appType].GetContentTypesDocument,
			});
		}
	}

	public async fetchLabelsByContentType(
		contentType: string,
	): Promise<ContentPageLabel[]> {
		try {
			const response = await this.dataService.execute<
				ContentPageQueryTypes['GetContentLabelsByContentTypeQuery'],
				ContentPageQueryTypes['GetContentLabelsByContentTypeQueryVariables']
			>(
				CONTENT_PAGE_QUERIES[this.appType]
					.GetContentLabelsByContentTypeDocument,
				{
					contentType,
				},
			);

			const labels =
				(response as any).app_content_labels ||
				(response as any).app_content_label;

			if (!labels) {
				throw CustomError('The response does not contain any labels', null, {
					response,
				});
			}

			return labels;
		} catch (err) {
			throw CustomError(
				'Failed to get content labels by content type from database',
				err,
				{
					variables: {
						contentType,
					},
					query: 'GET_CONTENT_LABELS_BY_CONTENT_TYPE',
				},
			);
		}
	}

	public async insertContentLabelsLinks(
		contentPageId: number | string, // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
		labelIds: (number | string)[],
	): Promise<void> {
		let variables: any;
		try {
			variables = {
				objects: labelIds.map((labelId) => ({
					content_id: contentPageId,
					label_id: labelId,
				})),
			};

			await this.dataService.execute<
				ContentPageQueryTypes['InsertContentLabelLinksMutation'],
				ContentPageQueryTypes['InsertContentLabelLinksMutationVariables']
			>(
				CONTENT_PAGE_QUERIES[this.appType].InsertContentLabelLinksDocument,
				variables,
			);
		} catch (err) {
			throw CustomError(
				'Failed to insert content label links in the database',
				err,
				{
					variables,
					query: 'INSERT_CONTENT_LABEL_LINKS',
				},
			);
		}
	}

	public async deleteContentLabelsLinks(
		contentPageId: number | string, // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
		labelIds: (number | string)[],
	): Promise<void> {
		try {
			await this.dataService.execute<
				ContentPageQueryTypes['DeleteContentLabelLinksMutation'],
				ContentPageQueryTypes['DeleteContentLabelLinksMutationVariables']
			>(CONTENT_PAGE_QUERIES[this.appType].DeleteContentLabelLinksDocument, {
				labelIds,
				contentPageId,
			});
		} catch (err) {
			throw CustomError(
				'Failed to insert content label links in the database',
				err,
				{
					variables: {
						labelIds,
						contentPageId,
					},
					query: 'DELETE_CONTENT_LABEL_LINKS',
				},
			);
		}
	}

	public async fetchContentPages(
		offset: number,
		limit: number,
		sortColumn: ContentOverviewTableCols,
		sortOrder: Avo.Search.OrderDirection,
		tableColumnDataType: string,
		where: any,
	): Promise<[ContentPage[], number]> {
		let variables:
			| ContentPageQueryTypes['GetContentPagesQueryVariables']
			| null = null;
		try {
			variables = {
				where,
				offset,
				limit,
				orderBy: getOrderObject(
					sortColumn,
					sortOrder,
					tableColumnDataType,
					TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT,
				),
			};

			const response = await this.dataService.execute<
				ContentPageQueryTypes['GetContentPagesQuery'],
				ContentPageQueryTypes['GetContentPagesQueryVariables']
			>(CONTENT_PAGE_QUERIES[this.appType].GetContentPagesDocument, variables);

			const dbContentPages =
				(response as ContentPageQueryTypes['GetContentPagesQueryAvo'])
					.app_content ||
				(response as ContentPageQueryTypes['GetContentPagesQueryHetArchief'])
					.app_content_page ||
				[];

			const dbContentPageCount: number =
				(response as ContentPageQueryTypes['GetContentPagesQueryAvo'])
					.app_content_aggregate?.aggregate?.count ||
				(response as ContentPageQueryTypes['GetContentPagesQueryHetArchief'])
					.app_content_page_aggregate?.aggregate?.count ||
				0;

			if (!dbContentPages) {
				throw CustomError('Response did not contain any content pages', null, {
					response,
				});
			}

			const contentPages: ContentPage[] = dbContentPages.map(
				this.adaptContentPage.bind(this),
			);
			return [contentPages, dbContentPageCount];
		} catch (err) {
			throw CustomError('Failed to get content pages from the database', err, {
				variables,
				query: 'GET_CONTENT_PAGES',
			});
		}
	}

	public async fetchContentPagesWithOrWithoutBlocks(
		withBlock: boolean,
		userGroupIds: (string | number)[],
		contentType: string,
		labelIds: number[],
		selectedLabelIds: number[],
		orderProp: string,
		orderDirection: 'asc' | 'desc',
		offset = 0,
		limit: number,
	): Promise<ContentPageOverviewResponse> {
		const now = new Date().toISOString();
		const variables = {
			limit,
			labelIds: compact(labelIds),
			offset,
			where: {
				_and: [
					{
						// Get content pages with the selected content type
						content_type: { _eq: contentType },
					},
					{
						// Get pages that are visible to the current user
						_or: userGroupIds.map((userGroupId) => ({
							user_group_ids: { _contains: userGroupId },
						})),
					},
					...this.getLabelFilter(selectedLabelIds),
					// publish state
					{
						_or: [
							{ is_public: { _eq: true } },
							{ publish_at: { _is_null: true }, depublish_at: { _gte: now } },
							{ publish_at: { _lte: now }, depublish_at: { _is_null: true } },
							{ publish_at: { _lte: now }, depublish_at: { _gte: now } },
						],
					},
					{ is_deleted: { _eq: false } },
				],
			},
			orderBy: { [orderProp]: orderDirection },
			orUserGroupIds: userGroupIds.map((userGroupId) => ({
				content: { user_group_ids: { _contains: userGroupId } },
			})),
		};
		const response = await this.dataService.execute<
			| ContentPageQueryTypes['GetContentPagesWithBlocksQuery']
			| ContentPageQueryTypes['GetContentPagesQuery'],
			| ContentPageQueryTypes['GetContentPagesWithBlocksQueryVariables']
			| ContentPageQueryTypes['GetContentPagesQueryVariables']
		>(
			withBlock
				? CONTENT_PAGE_QUERIES[getDatabaseType()]
						.GetContentPagesWithBlocksDocument
				: CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentPagesDocument,
			variables,
		);
		const responseAvo = response as
			| ContentPageQueryTypes['GetContentPagesWithBlocksQueryAvo']
			| ContentPageQueryTypes['GetContentPagesQueryAvo'];
		const responseHetArchief = response as
			| ContentPageQueryTypes['GetContentPagesWithBlocksQueryHetArchief']
			| ContentPageQueryTypes['GetContentPagesQueryHetArchief'];
		return {
			pages: (responseAvo.app_content ||
				responseHetArchief.app_content_page ||
				[]) as unknown as ContentPage[],
			count:
				responseAvo.app_content_aggregate?.aggregate?.count ||
				responseHetArchief.app_content_page_aggregate?.aggregate?.count ||
				0,
			labelCounts: fromPairs(
				(
					responseAvo.app_content_labels ||
					responseHetArchief.app_content_label ||
					[]
				).map((labelInfo: any): [number, number] => [
					labelInfo?.id,
					labelInfo?.content_content_labels_aggregate?.aggregate?.count,
				]),
			),
		};
	}

	public async insertContentPage(
		contentPage: ContentPage,
	): Promise<ContentPage | null> {
		try {
			const dbContentPage = this.convertToDatabaseContentPage(contentPage);
			const response = await this.dataService.execute<
				ContentPageQueryTypes['InsertContentMutation'],
				ContentPageQueryTypes['InsertContentMutationVariables']
			>(CONTENT_PAGE_QUERIES[this.appType].InsertContentDocument, {
				contentPage: dbContentPage as any,
			});

			const id: number | null =
				(response as ContentPageQueryTypes['InsertContentMutationAvo'])
					.insert_app_content?.returning?.[0]?.id ||
				(response as ContentPageQueryTypes['InsertContentMutationHetArchief'])
					.insert_app_content_page?.returning?.[0]?.id ||
				null;

			if (id) {
				// Insert content-blocks
				let contentBlockConfigs: Partial<ContentBlockConfig>[] | null = null;
				if (contentPage.content_blocks && contentPage.content_blocks.length) {
					contentBlockConfigs = await this.insertContentBlocks(
						id,
						contentPage.content_blocks,
					);

					if (!contentBlockConfigs) {
						// return null to prevent triggering success toast
						return null;
					}
				}

				return {
					...contentPage,
					content_blocks: contentBlockConfigs,
					id,
				} as ContentPage;
			}

			return null;
		} catch (err) {
			console.error('Failed to insert content page into the database', err);
			return null;
		}
	}

	public async updateContentPage(
		contentPage: ContentPage,
		initialContentPage: ContentPage | undefined,
	): Promise<ContentPage | null> {
		try {
			const dbContentPage = this.convertToDatabaseContentPage(contentPage);
			const response = await this.dataService.execute<
				ContentPageQueryTypes['UpdateContentByIdMutation'],
				ContentPageQueryTypes['UpdateContentByIdMutationVariables']
			>(CONTENT_PAGE_QUERIES[this.appType].UpdateContentByIdDocument, {
				contentPage: dbContentPage,
				id: contentPage.id,
			});

			const updatedContent =
				(response as ContentPageQueryTypes['UpdateContentByIdMutationAvo'])
					.update_app_content?.affected_rows ||
				(
					response as ContentPageQueryTypes['UpdateContentByIdMutationHetArchief']
				).update_app_content_page?.affected_rows ||
				null;
			if (!updatedContent) {
				throw CustomError(
					'Content page update returned empty response',
					null,
					response,
				);
			}

			if (contentPage.content_blocks && initialContentPage) {
				await this.updateContentBlocks(
					contentPage.id as number,
					initialContentPage.content_blocks || [],
					contentPage.content_blocks,
				);
			}

			return contentPage;
		} catch (err) {
			console.error('Failed to save content', err);
			return null;
		}
	}

	public async deleteContentPage(id: string): Promise<void> {
		try {
			// query path
			const contentPage = await this.getContentPageById(id);
			await this.dataService.execute<
				ContentPageQueryTypes['SoftDeleteContentMutation'],
				ContentPageQueryTypes['SoftDeleteContentMutationVariables']
			>(CONTENT_PAGE_QUERIES[this.appType].SoftDeleteContentDocument, {
				id,
				path: `${contentPage.path}-${id}`,
			});
		} catch (err) {
			throw CustomError(
				'Failed to delete content page from the database',
				err,
				{
					id,
					query: CONTENT_PAGE_QUERIES[this.appType].SoftDeleteContentDocument,
				},
			);
		}
	}

	/**
	 * Update content block.
	 *
	 * @param contentBlockConfig updated state of content block
	 */
	public async updateContentBlock(
		contentBlockConfig: ContentPageQueryTypes['UpdateContentBlockMutationVariables']['contentBlock'],
	): Promise<void> {
		try {
			await this.dataService.execute<
				ContentPageQueryTypes['UpdateContentBlockMutation'],
				ContentPageQueryTypes['UpdateContentBlockMutationVariables']
			>(CONTENT_PAGE_QUERIES[getDatabaseType()].UpdateContentBlockDocument, {
				contentBlock: contentBlockConfig as any,
				id: contentBlockConfig.id as number,
			});
		} catch (err) {
			throw CustomError('Failed to update content block', err, {
				contentBlockConfig,
			});
		}
	}

	/**
	 * Delete content block.
	 *
	 * @param id content block identifier
	 */
	public async deleteContentBlock(id: number) {
		try {
			return await this.dataService.execute<
				ContentPageQueryTypes['DeleteContentBlockMutation'],
				ContentPageQueryTypes['DeleteContentBlockMutationVariables']
			>(CONTENT_PAGE_QUERIES[getDatabaseType()].DeleteContentBlockDocument, {
				id,
			});
		} catch (err) {
			throw CustomError('Failed to delete content block', err, { id });
		}
	}

	private cleanContentBlocksBeforeDatabaseInsert(
		dbContentBlocks: Partial<Avo.ContentPage.Block>[],
	): ContentPageQueryTypes['InsertContentBlocksMutationVariables']['contentBlocks'] {
		return (dbContentBlocks || []).map((block) =>
			omit(block, 'enum_content_block_type', '__typename', 'id'),
		) as ContentPageQueryTypes['InsertContentBlocksMutationVariables']['contentBlocks'];
	}

	/**
	 * Insert content blocks.
	 *
	 * @param contentId content page identifier
	 * @param contentBlockConfigs
	 *
	 * @return content blocks
	 */
	public async insertContentBlocks(
		contentId: number,
		contentBlockConfigs: App_Content_Blocks_Insert_Input[],
	): Promise<Partial<ContentBlockConfig>[] | null> {
		try {
			(contentBlockConfigs || []).forEach(
				(block) => (block.content_id = contentId),
			);

			const response = await this.dataService.execute<
				ContentPageQueryTypes['InsertContentBlocksMutation'],
				ContentPageQueryTypes['InsertContentBlocksMutationVariables']
			>(CONTENT_PAGE_QUERIES[getDatabaseType()].InsertContentBlocksDocument, {
				contentBlocks: this.cleanContentBlocksBeforeDatabaseInsert(
					contentBlockConfigs,
				) as any, // TODO Figure out why type doesn't work
			});
			const ids: number[] =
				(
					(response as ContentPageQueryTypes['InsertContentBlocksMutationAvo'])
						.insert_app_content_blocks ||
					(
						response as ContentPageQueryTypes['InsertContentBlocksMutationHetArchief']
					).insert_app_content_block
				)?.returning?.map((block) => block.id) || [];

			return contentBlockConfigs.map((block, index) => ({
				...block,
				id: ids[index],
			}));
		} catch (err) {
			throw CustomError('Failed to insert content blocks', err, {
				contentId,
				contentBlockConfigs,
			});
		}
	}

	/**
	 * Update content blocks.
	 *
	 * @param contentId content page identifier
	 * @param initialContentBlocks initial state of content blocks
	 * @param contentBlockConfigs configs of content blocks to update
	 */
	public async updateContentBlocks(
		contentId: number,
		initialContentBlocks: ContentBlockConfig[],
		contentBlockConfigs: ContentBlockConfig[],
	) {
		try {
			const initialContentBlockIds: number[] = compact(
				initialContentBlocks.map((contentBlock) => contentBlock.id),
			);
			const currentContentBlockIds = contentBlockConfigs.reduce(
				(acc: number[], curr) => {
					if (has(curr, 'id')) {
						return [...acc, curr.id as number];
					}

					return acc;
				},
				[],
			);

			// Inserted content-blocks
			const insertPromises: Promise<any>[] = [];
			const insertedConfigs: ContentBlockConfig[] = contentBlockConfigs.filter(
				(config) => !has(config, 'id'),
			);

			if (insertedConfigs.length) {
				insertPromises.push(
					this.insertContentBlocks(contentId, insertedConfigs),
				);
			}

			// Updated content-blocks
			const updatePromises: Promise<any>[] = [];
			const updatedConfigs = contentBlockConfigs.filter(
				(config) =>
					has(config, 'id') &&
					initialContentBlockIds.includes(config.id as number),
			);

			updatedConfigs.forEach((config) =>
				updatePromises.push(this.updateContentBlock(config)),
			);

			// Deleted content-blocks
			const deletePromises: Promise<any>[] = [];
			const deletedIds = without(
				initialContentBlockIds,
				...currentContentBlockIds,
			);

			deletedIds.forEach((id) =>
				deletePromises.push(this.deleteContentBlock(id)),
			);

			// Run requests in parallel
			await Promise.all([
				Promise.all(insertPromises),
				Promise.all(updatePromises),
				Promise.all(deletePromises),
			]);
		} catch (err) {
			throw CustomError('Failed to update content blocks', err, {
				contentId,
				initialContentBlocks,
				contentBlockConfigs,
			});
		}
	}

	/**
	 * Returns the user group ids that have access to this content page
	 * @param path
	 */
	public async getUserGroupsFromContentPage(
		path: string,
	): Promise<(string | number)[]> {
		// Check if permissions are stricter than the permissions on the content_page
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetPermissionsFromContentPageByPathQuery'],
			ContentPageQueryTypes['GetPermissionsFromContentPageByPathQueryVariables']
		>(
			CONTENT_PAGE_QUERIES[getDatabaseType()]
				.GetPermissionsFromContentPageByPathDocument,
			{
				path,
			},
		);

		return ((
			response as ContentPageQueryTypes['GetPermissionsFromContentPageByPathQueryAvo']
		).app_content ||
			(
				response as ContentPageQueryTypes['GetPermissionsFromContentPageByPathQueryHetArchief']
			).app_content_page ||
			[])[0].user_group_ids;
	}
}
