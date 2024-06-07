import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import type { IPagination } from '@studiohyperdrive/pagination';
import { Pagination } from '@studiohyperdrive/pagination';
import type { Avo } from '@viaa/avo2-types';
import { PermissionName } from '@viaa/avo2-types';
import { mapLimit } from 'blend-promise-utils';
import {
	compact,
	escapeRegExp,
	fromPairs,
	has,
	intersection,
	keys,
	set,
	uniq,
	without,
} from 'lodash';

import { AssetsService } from '../../assets';
import { DataService } from '../../data';
import { PlayerTicketService } from '../../player-ticket';
import { SessionHelper } from '../../shared/auth/session-helper';
import {
	App_Content_Blocks_Insert_Input,
	App_Content_Blocks_Set_Input as App_Content_Blocks_Set_Input_Avo,
	GetCollectionTileByIdDocument,
	GetCollectionTileByIdQuery,
	GetCollectionTileByIdQueryVariables,
	GetItemByExternalIdDocument,
	GetItemByExternalIdQuery,
	GetItemByExternalIdQueryVariables,
	GetItemTileByIdDocument,
	GetItemTileByIdQuery,
	GetItemTileByIdQueryVariables,
	Lookup_Enum_Content_Block_Types_Enum,
	Order_By,
} from '../../shared/generated/graphql-db-types-avo';
import { App_Content_Block_Set_Input as App_Content_Block_Set_Input_HetArchief } from '../../shared/generated/graphql-db-types-hetarchief';
import { CustomError } from '../../shared/helpers/custom-error';
import { getDatabaseType } from '../../shared/helpers/get-database-type';
import { isHetArchief } from '../../shared/helpers/is-hetarchief';
import { Locale } from '../../translations';
import { ContentBlockType, DbContentBlock } from '../content-block.types';
import {
	DEFAULT_AUDIO_STILL,
	MEDIA_PLAYER_BLOCKS,
	TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT,
} from '../content-pages.consts';
import {
	ContentOverviewTableCols,
	ContentPageLabel,
	ContentPageType,
	ContentPageUser,
	ContentWidth,
	DbContentPage,
	GqlAvoUser,
	GqlContentBlock,
	GqlContentPage,
	GqlHetArchiefUser,
	GqlInsertOrUpdateContentBlock,
	GqlUser,
	MediaItemResponse,
} from '../content-pages.types';
import { ContentPageOverviewParams } from '../dto/content-pages.dto';
import { CONTENT_PAGE_QUERIES, ContentPageQueryTypes } from '../queries/content-pages.queries';

import { getOrderObject } from 'src/modules/shared/helpers/generate-order-gql-query';
import { isAvo } from 'src/modules/shared/helpers/is-avo';

@Injectable()
export class ContentPagesService {
	private logger: Logger = new Logger(ContentPagesService.name, {
		timestamp: true,
	});

	constructor(
		@Inject(forwardRef(() => DataService)) protected dataService: DataService,
		protected playerTicketService: PlayerTicketService,
		protected assetsService: AssetsService
	) {}

	/**
	 * Adapt a space as returned by a typical graphQl response to our internal space data model
	 */
	public adaptContentBlock(contentBlock: GqlContentBlock): DbContentBlock | null {
		if (!contentBlock) {
			return null;
		}
		/* istanbul ignore next */
		return {
			id: contentBlock?.id,
			name: contentBlock?.content_block_type,
			type: contentBlock?.content_block_type as unknown as ContentBlockType,
			position: contentBlock?.position,
			block: {
				...contentBlock?.variables?.blockState,
				userGroupIds: uniq(
					(contentBlock?.variables?.blockState.userGroupIds || []).map((groupId) =>
						String(groupId)
					)
				),
			},
			components: contentBlock?.variables?.componentState,
		};
	}

	public adaptUser(gqlUser: GqlUser): ContentPageUser | null {
		if (!gqlUser) {
			return null;
		}
		const mergedUser = {
			...gqlUser,
			...(gqlUser as GqlAvoUser)?.user,
		} as unknown as GqlHetArchiefUser & GqlAvoUser & GqlAvoUser['user'];
		/* istanbul ignore next */
		return {
			id: mergedUser?.uid,
			fullName: mergedUser?.full_name ?? mergedUser?.first_name + ' ' + mergedUser?.last_name,
			firstName: mergedUser?.first_name,
			lastName: mergedUser?.last_name,
			groupId: String(mergedUser?.profile_user_group?.group?.id ?? mergedUser?.group?.id),
			groupName: mergedUser?.profile_user_group?.group?.label ?? mergedUser?.group?.label,
		};
	}

	public adaptContentPage(gqlContentPage: GqlContentPage): DbContentPage | null {
		if (!gqlContentPage) {
			return null;
		}
		const owner = this.adaptUser(
			(gqlContentPage as any)?.owner_profile || (gqlContentPage as any)?.profile
		);
		/* istanbul ignore next */
		return {
			id: gqlContentPage?.id,
			thumbnailPath: gqlContentPage?.thumbnail_path,
			title: gqlContentPage?.title,
			language: gqlContentPage.language,
			nlParentPageId: gqlContentPage.nl_parent_page_id,
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
			contentType: gqlContentPage?.content_type as Avo.ContentPage.Type,
			contentWidth: gqlContentPage?.content_width as ContentWidth,
			owner,
			userProfileId: gqlContentPage?.user_profile_id,
			userGroupIds: gqlContentPage?.user_group_ids?.map((groupId) => String(groupId)),
			content_blocks: (
				(gqlContentPage as any)?.content_blocks ||
				(gqlContentPage as any)?.contentBlockssBycontentId ||
				[]
			).map(this.adaptContentBlock),
			labels: (gqlContentPage?.content_content_labels || []).map(
				(labelObj): ContentPageLabel => ({
					id: labelObj?.content_label?.id,
					content_type: gqlContentPage?.content_type as ContentPageType, // TODO eliminate either ContentPageType or Avo.ContentPage.Type
					label: labelObj?.content_label?.label,
					language: labelObj?.content_label?.language,
					link_to: labelObj?.content_label?.link_to,
					created_at: labelObj?.content_label?.created_at,
					updated_at: labelObj?.content_label?.updated_at,
				})
			),
			translatedPages: gqlContentPage.translated_content_pages.map(
				(translatedPage: GqlContentPage['translated_content_pages'][0]) => ({
					id: translatedPage.id,
					path: translatedPage.path,
					title: translatedPage.title,
					language: translatedPage.language,
					isPublic: translatedPage.is_public,
				})
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
		contentPageInfo: Partial<DbContentPage>
	): GqlInsertOrUpdateContentBlock {
		return {
			id: contentPageInfo.id,
			thumbnail_path: contentPageInfo.thumbnailPath || null,
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
			user_group_ids: contentPageInfo.userGroupIds.map((groupId) => String(groupId)),
			user_profile_id: contentPageInfo.userProfileId,
			language: contentPageInfo.language || Locale.Nl,
			nl_parent_page_id: contentPageInfo.nlParentPageId || null,
		};
	}

	public async getContentPagesForPageOverviewBlock(
		inputQuery: ContentPageOverviewParams,
		userGroupIds: string[]
	): Promise<IPagination<DbContentPage> & { labelCounts: Record<string, number> }> {
		const {
			withBlocks,
			contentType,
			labelIds,
			selectedLabelIds,
			orderProp,
			orderDirection,
			offset,
			limit,
		} = inputQuery;
		const now = new Date().toISOString();
		const variables = {
			limit: limit || 10,
			labelIds: compact(labelIds || []),
			offset: offset || 0,
			where: {
				_and: [
					{
						// Get content pages with the selected content type
						content_type: { _eq: contentType },
					},
					{
						// Get pages that are visible to the current user
						_or: userGroupIds.flatMap((userGroupId) => {
							if (isAvo()) {
								// Avo can contain both strings and numbers as user groups // TODO convert all usergroups in the avo database to strings [1, -2] => ["1", "-2"]
								return [
									{
										user_group_ids: {
											_contains: parseInt(userGroupId),
										},
									},
									{
										user_group_ids: {
											_contains: String(userGroupId),
										},
									},
								];
							} else {
								// Hetarchief can only contain uuid strings as user groups
								return {
									user_group_ids: {
										_contains: userGroupId,
									},
								};
							}
						}),
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
			orUserGroupIds: userGroupIds.flatMap((userGroupId) => {
				if (isAvo()) {
					// Avo can contain both strings and numbers as user group ids
					return [
						{
							content: {
								user_group_ids: {
									_contains: parseInt(userGroupId),
								},
							},
						},
						{
							content: {
								user_group_ids: {
									_contains: String(userGroupId),
								},
							},
						},
					];
				} else {
					// Hetarchief can only contain uuid strings as user groups
					return {
						content: {
							user_group_ids: {
								_contains: userGroupId,
							},
						},
					};
				}
			}),
		};
		const response = await this.dataService.execute<
			| ContentPageQueryTypes['GetContentPagesWithBlocksQuery']
			| ContentPageQueryTypes['GetContentPagesQuery'],
			| ContentPageQueryTypes['GetContentPagesWithBlocksQueryVariables']
			| ContentPageQueryTypes['GetContentPagesQueryVariables']
		>(
			withBlocks
				? CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentPagesWithBlocksDocument
				: CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentPagesDocument,
			variables
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
			responseAvo.app_content_labels || responseHetArchief.app_content_label || [];

		const contentPages = (
			responseAvo.app_content ||
			responseHetArchief.app_content_page ||
			[]
		).map(this.adaptContentPage.bind(this)) as DbContentPage[];

		return {
			...Pagination<DbContentPage>({
				items: contentPages,
				page: Math.floor(offset / limit),
				size: limit,
				total: count,
			}),
			labelCounts: fromPairs(
				contentPageLabels.map((labelInfo: any): [number, number] => [
					labelInfo?.id,
					labelInfo?.content_content_labels_aggregate?.aggregate?.count ||
						labelInfo?.content_page_content_label_aggregate?.aggregate?.count ||
						0,
				])
			),
		};
	}

	public async getContentPageByLanguageAndPath(
		language: Locale,
		path: string
	): Promise<DbContentPage | null> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetContentPageByPathQuery'],
			ContentPageQueryTypes['GetContentPageByPathQueryVariables']
		>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentPageByPathDocument, {
			language,
			path,
		});
		const contentPage: GqlContentPage | undefined =
			(response as ContentPageQueryTypes['GetContentPageByPathQueryHetArchief'])
				?.app_content_page?.[0] ||
			(response as ContentPageQueryTypes['GetContentPageByPathQueryAvo'])?.app_content?.[0];

		return this.adaptContentPage(contentPage);
	}

	public async getContentPageByLanguageAndPathForUser(
		language: Locale,
		path: string,
		user?: Avo.User.CommonUser,
		referrer?: string,
		ip = '',
		onlyInfo = false
	): Promise<DbContentPage | null> {
		const contentPage: DbContentPage | undefined = await this.getContentPageByLanguageAndPath(
			language,
			path
		);

		const permissions = user?.permissions || [];
		const userId = user?.userId;
		const canEditContentPage =
			permissions.includes(PermissionName.EDIT_ANY_CONTENT_PAGES) ||
			(permissions.includes(PermissionName.EDIT_OWN_CONTENT_PAGES) &&
				!!userId &&
				contentPage.owner.id === userId);

		if (!contentPage) {
			return null;
		}

		// People that can edit the content page are not restricted by the publish_at, depublish_at, is_public settings
		if (!canEditContentPage) {
			if (
				contentPage.publishAt &&
				new Date().getTime() < new Date(contentPage.publishAt).getTime()
			) {
				return null; // Not yet published
			}

			if (
				contentPage.depublishAt &&
				new Date().getTime() > new Date(contentPage.depublishAt).getTime()
			) {
				throw new BadRequestException({
					message: 'The content page was depublished',
					additionalInfo: {
						code: 'CONTENT_PAGE_DEPUBLISHED',
						contentPageType: contentPage?.contentType,
					},
				});
			}

			if (!contentPage.isPublic) {
				return null;
			}

			// Check if content page is accessible for the user who requested the content page
			const pageUserGroups = contentPage.userGroupIds.map((id) => String(id));
			const userUserGroups = SessionHelper.getUserGroupIds(user?.userGroup?.id);
			if (!intersection(pageUserGroups, userUserGroups).length) {
				return null;
			}
		}

		// Check if content page contains any media player content blocks (eg: mediaplayer, mediaPlayerTitleTextButton, hero)
		if (referrer && !onlyInfo) {
			await this.resolveMediaPlayersInPage(contentPage, referrer, ip);
		}

		return contentPage;
	}

	public async fetchCollectionOrItem(
		type: 'ITEM' | 'COLLECTION',
		id: string
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
		>(type === 'ITEM' ? GetItemTileByIdDocument : GetCollectionTileByIdDocument, { id });

		const itemOrCollection = response?.obj?.[0] || null;

		return {
			...itemOrCollection,
			count: itemOrCollection?.view_counts_aggregate?.aggregate?.sum?.count || 0,
		};
	}

	public async fetchItemByExternalId(externalId: string): Promise<Partial<Avo.Item.Item> | null> {
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

		return (response.app_item_meta?.[0] || null) as Partial<Avo.Item.Item> | null;
	}

	public async updatePublishDates(): Promise<{
		publishedCount: number;
		publishedIds: string[];
		unpublishedCount: number;
		unpublishedIds: string[];
	}> {
		const now = new Date();
		const publishedAt = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			7,
			0,
			0
		).toISOString();
		const response = await this.dataService.execute<
			ContentPageQueryTypes['UpdateContentPagePublishDatesMutation'],
			ContentPageQueryTypes['UpdateContentPagePublishDatesMutationVariables']
		>(CONTENT_PAGE_QUERIES[getDatabaseType()].UpdateContentPagePublishDatesDocument, {
			now: now.toISOString(),
			publishedAt,
		});
		return {
			publishedCount: response.publish_content_pages?.affected_rows || 0,
			publishedIds: response.publish_content_pages?.returning.map((page) => page.id),
			unpublishedCount: response.unpublish_content_pages?.affected_rows || 0,
			unpublishedIds: response.unpublish_content_pages?.returning.map((page) => page.id),
		};
	}

	public async getContentPagesByIds(contentPageIds: number[]): Promise<DbContentPage[]> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetContentByIdsQuery'],
			ContentPageQueryTypes['GetContentByIdsQueryVariables']
		>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentByIdsDocument, {
			ids: contentPageIds,
		});

		return (
			(response as ContentPageQueryTypes['GetContentByIdsQueryAvo']).app_content ||
			(response as ContentPageQueryTypes['GetContentByIdsQueryHetArchief'])
				.app_content_page ||
			[]
		).map(this.adaptContentBlock.bind(this)) as DbContentPage[];
	}

	public async resolveMediaPlayersInPage(contentPage: DbContentPage, referrer?: string, ip = '') {
		const mediaPlayerBlocks =
			contentPage?.content_blocks?.filter((contentBlock) =>
				keys(MEDIA_PLAYER_BLOCKS).includes(contentBlock.type)
			) || [];
		if (mediaPlayerBlocks.length) {
			await mapLimit(mediaPlayerBlocks, 2, async (mediaPlayerBlock: any) => {
				try {
					const blockInfo = MEDIA_PLAYER_BLOCKS[mediaPlayerBlock.content_block_type];
					const externalId = mediaPlayerBlock?.blockInfo?.getItemExternalIdPath;
					if (externalId) {
						const itemInfo = await this.fetchItemByExternalId(externalId);
						let videoSrc: string | undefined;
						if (itemInfo && itemInfo.browse_path) {
							videoSrc = await this.playerTicketService.getPlayableUrl(
								itemInfo.browse_path,
								referrer || 'http://localhost:3200/',
								ip
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
										DEFAULT_AUDIO_STILL
									);
								} else {
									set(
										mediaPlayerBlock,
										(blockInfo as any)[props[1]],
										(itemInfo as any)[props[0]]
									);
								}
							}
						});
					}
				} catch (err: any) {
					this.logger.error({
						message: 'Failed to resolve media grid content',
						innerException: err,
						additionalInfo: {
							mediaPlayerBlocks,
							mediaPlayerBlock,
						},
					});
				}
			});
		}
	}

	public async getNlParentContentPages(
		limit: number
	): Promise<
		| ContentPageQueryTypes['GetNlParentContentPagesQueryAvo']['app_content']
		| ContentPageQueryTypes['GetNlParentContentPagesQueryHetArchief']['app_content_page']
		| null
	> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetNlParentContentPagesQuery'],
			ContentPageQueryTypes['GetNlParentContentPagesQueryVariables']
		>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetNlParentContentPagesDocument, {
			limit,
		});

		return (response as any).app_content || (response as any).app_content_page;
	}

	public async getNlParentContentPagesByTitle(
		title: string,
		limit: number
	): Promise<
		| ContentPageQueryTypes['GetNlParentContentPagesByTitleQueryAvo']['app_content']
		| ContentPageQueryTypes['GetNlParentContentPagesByTitleQueryHetArchief']['app_content_page']
		| null
	> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetNlParentContentPagesByTitleQuery'],
			ContentPageQueryTypes['GetNlParentContentPagesByTitleQueryVariables']
		>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetNlParentContentPagesByTitleDocument, {
			limit,
			title,
		});

		return (response as any).app_content || (response as any).app_content_page;
	}

	public async getPublicContentItems(
		limit: number
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
		limit: number
	): Promise<
		| ContentPageQueryTypes['GetPublicProjectContentPagesQueryAvo']['app_content']
		| ContentPageQueryTypes['GetPublicProjectContentPagesQueryHetArchief']['app_content_page']
	> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetPublicProjectContentPagesQuery'],
			ContentPageQueryTypes['GetPublicProjectContentPagesQueryVariables']
		>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetPublicProjectContentPagesDocument, {
			limit,
			orderBy: { title: Order_By.Asc },
		});
		return (
			(response as ContentPageQueryTypes['GetPublicProjectContentPagesQueryAvo'])
				.app_content ||
			(response as ContentPageQueryTypes['GetPublicProjectContentPagesQueryHetArchief'])
				.app_content_page ||
			[]
		);
	}

	public async getPublicContentItemsByTitle(
		title: string,
		limit?: number
	): Promise<
		| ContentPageQueryTypes['GetPublicContentPagesByTitleQueryAvo']['app_content']
		| ContentPageQueryTypes['GetPublicContentPagesByTitleQueryHetArchief']['app_content_page']
	> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetPublicContentPagesByTitleQuery'],
			ContentPageQueryTypes['GetPublicContentPagesByTitleQueryVariables']
		>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetPublicContentPagesByTitleDocument, {
			limit: limit || null,
			orderBy: { title: Order_By.Asc },
			where: {
				title: { _ilike: `%${title}%` },
				is_public: { _eq: true },
				is_deleted: { _eq: false },
			},
		});

		return (
			(response as ContentPageQueryTypes['GetPublicContentPagesByTitleQueryAvo'])
				.app_content ||
			(response as ContentPageQueryTypes['GetPublicContentPagesByTitleQueryHetArchief'])
				.app_content_page ||
			[]
		);
	}

	public async getPublicProjectContentItemsByTitle(
		title: string,
		limit: number
	): Promise<
		| ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQueryAvo']['app_content']
		| ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQueryHetArchief']['app_content_page']
		| null
	> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQuery'],
			ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQueryVariables']
		>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetPublicProjectContentPagesByTitleDocument, {
			title,
			limit,
			orderBy: { title: Order_By.Asc },
		});
		return (
			(response as ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQueryAvo'])
				.app_content ||
			(
				response as ContentPageQueryTypes['GetPublicProjectContentPagesByTitleQueryHetArchief']
			).app_content_page
		);
	}

	public async getContentPageById(id: string): Promise<DbContentPage> {
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetContentByIdQuery'],
			ContentPageQueryTypes['GetContentByIdQueryVariables']
		>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentByIdDocument, {
			id: isAvo() ? parseInt(id) : id,
		});

		const dbContentPage = ((response as ContentPageQueryTypes['GetContentByIdQueryAvo'])
			.app_content ||
			(response as ContentPageQueryTypes['GetContentByIdQueryHetArchief']).app_content_page ||
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
			>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentTypesDocument);
			const contentTypes =
				(response as ContentPageQueryTypes['GetContentTypesQueryAvo'])
					.lookup_enum_content_types ||
				(response as ContentPageQueryTypes['GetContentTypesQueryHetArchief'])
					.lookup_app_content_type;

			return (contentTypes || []).map((obj) => ({
				value: obj.value,
				label: obj.description || (obj as any).comment,
			})) as { value: Avo.ContentPage.Type; label: string }[] | null;
		} catch (err: any) {
			throw CustomError('Failed to retrieve content types.', err, {
				query: CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentTypesDocument,
			});
		}
	}

	public async fetchLabelsByContentType(contentType: string): Promise<ContentPageLabel[]> {
		try {
			const response = await this.dataService.execute<
				ContentPageQueryTypes['GetContentLabelsByContentTypeQuery'],
				ContentPageQueryTypes['GetContentLabelsByContentTypeQueryVariables']
			>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentLabelsByContentTypeDocument, {
				contentType,
			});

			const labels =
				(response as any).app_content_labels || (response as any).app_content_label;

			if (!labels) {
				throw CustomError('The response does not contain any labels', null, {
					response,
				});
			}

			return labels;
		} catch (err: any) {
			throw CustomError('Failed to get content labels by content type from database', err, {
				variables: {
					contentType,
				},
				query: 'GET_CONTENT_LABELS_BY_CONTENT_TYPE',
			});
		}
	}

	public async insertContentLabelsLinks(
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

			await this.dataService.execute<
				ContentPageQueryTypes['InsertContentLabelLinksMutation'],
				ContentPageQueryTypes['InsertContentLabelLinksMutationVariables']
			>(CONTENT_PAGE_QUERIES[getDatabaseType()].InsertContentLabelLinksDocument, variables);
		} catch (err: any) {
			throw CustomError('Failed to insert content label links in the database', err, {
				variables,
				query: 'INSERT_CONTENT_LABEL_LINKS',
			});
		}
	}

	public async deleteContentLabelsLinks(
		contentPageId: number | string, // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
		labelIds: (number | string)[]
	): Promise<void> {
		try {
			await this.dataService.execute<
				ContentPageQueryTypes['DeleteContentLabelLinksMutation'],
				ContentPageQueryTypes['DeleteContentLabelLinksMutationVariables']
			>(CONTENT_PAGE_QUERIES[getDatabaseType()].DeleteContentLabelLinksDocument, {
				labelIds,
				contentPageId,
			});
		} catch (err: any) {
			throw CustomError('Failed to insert content label links in the database', err, {
				variables: {
					labelIds,
					contentPageId,
				},
				query: 'DELETE_CONTENT_LABEL_LINKS',
			});
		}
	}

	public async fetchContentPages(
		offset: number,
		limit: number,
		sortColumn: ContentOverviewTableCols,
		sortOrder: Avo.Search.OrderDirection,
		tableColumnDataType: string,
		where: any
	): Promise<[DbContentPage[], number]> {
		let variables: ContentPageQueryTypes['GetContentPagesQueryVariables'] | null = null;
		try {
			variables = {
				where,
				offset,
				limit,
				orderBy: getOrderObject(
					sortColumn,
					sortOrder,
					tableColumnDataType,
					TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT
				),
			};

			const response = await this.dataService.execute<
				ContentPageQueryTypes['GetContentPagesQuery'],
				ContentPageQueryTypes['GetContentPagesQueryVariables']
			>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetContentPagesDocument, variables);

			const dbContentPages =
				(response as ContentPageQueryTypes['GetContentPagesQueryAvo']).app_content ||
				(response as ContentPageQueryTypes['GetContentPagesQueryHetArchief'])
					.app_content_page ||
				[];

			const dbContentPageCount: number =
				(response as ContentPageQueryTypes['GetContentPagesQueryAvo']).app_content_aggregate
					?.aggregate?.count ||
				(response as ContentPageQueryTypes['GetContentPagesQueryHetArchief'])
					.app_content_page_aggregate?.aggregate?.count ||
				0;

			if (!dbContentPages) {
				throw CustomError('Response did not contain any content pages', null, {
					response,
				});
			}

			const contentPages: DbContentPage[] = dbContentPages.map(
				this.adaptContentPage.bind(this)
			);
			return [contentPages, dbContentPageCount];
		} catch (err: any) {
			throw CustomError('Failed to get content pages from the database', err, {
				variables,
				query: 'GET_CONTENT_PAGES',
			});
		}
	}

	public async insertContentPage(contentPage: DbContentPage): Promise<DbContentPage | null> {
		try {
			const dbContentPage = this.convertToDatabaseContentPage(contentPage);
			delete dbContentPage.id; // No id needed for new content pages (or duplicates of existing ones
			const response = await this.dataService.execute<
				ContentPageQueryTypes['InsertContentMutation'],
				ContentPageQueryTypes['InsertContentMutationVariables']
			>(CONTENT_PAGE_QUERIES[getDatabaseType()].InsertContentDocument, {
				contentPage: dbContentPage as any,
			});

			const id: number | null =
				(response as ContentPageQueryTypes['InsertContentMutationAvo']).insert_app_content
					?.returning?.[0]?.id ||
				(response as ContentPageQueryTypes['InsertContentMutationHetArchief'])
					.insert_app_content_page?.returning?.[0]?.id ||
				null;

			if (!id) {
				throw new InternalServerErrorException(
					CustomError(
						'Failed to insert content page, received no id from the database',
						null,
						{ response }
					)
				);
			}

			// Insert content-blocks
			let contentBlockConfigs: Partial<DbContentBlock>[] | null = null;
			if (contentPage.content_blocks && contentPage.content_blocks.length) {
				contentBlockConfigs = await this.insertContentBlocks(
					id,
					contentPage.content_blocks
				);

				if (!contentBlockConfigs) {
					// return null to prevent triggering success toast
					return null;
				}
			}

			return this.getContentPageById(String(id));
		} catch (err: any) {
			throw new InternalServerErrorException(
				CustomError('Failed to insert content page into the database', err, {
					contentPage,
				})
			);
		}
	}

	public async updateContentPage(contentPage: DbContentPage): Promise<DbContentPage | null> {
		try {
			const dbContentPage = this.convertToDatabaseContentPage(contentPage);
			const initialContentPage: DbContentPage = await this.getContentPageById(
				String(contentPage.id)
			);
			const response = await this.dataService.execute<
				ContentPageQueryTypes['UpdateContentByIdMutation'],
				ContentPageQueryTypes['UpdateContentByIdMutationVariables']
			>(CONTENT_PAGE_QUERIES[getDatabaseType()].UpdateContentByIdDocument, {
				contentPage: dbContentPage,
				id: contentPage.id,
			});

			const updatedContent =
				(response as ContentPageQueryTypes['UpdateContentByIdMutationAvo'])
					.update_app_content?.affected_rows ||
				(response as ContentPageQueryTypes['UpdateContentByIdMutationHetArchief'])
					.update_app_content_page?.affected_rows ||
				null;
			if (!updatedContent) {
				throw CustomError('Content page update returned empty response', null, response);
			}

			if (contentPage.content_blocks && initialContentPage) {
				await this.updateContentBlocks(
					contentPage.id as number,
					initialContentPage.content_blocks || [],
					contentPage.content_blocks
				);
			}

			// Delete images from s3 that are present in the initialContentPage and no longer present in the updated contentPage
			const originalImages = this.getImageUrlsFromJsonBlob(initialContentPage);
			const updatedImages = this.getImageUrlsFromJsonBlob(contentPage);

			const deletedImages = without(originalImages, ...updatedImages);
			await mapLimit(deletedImages, 20, (deletedImageUrl: string) =>
				this.assetsService.delete(deletedImageUrl)
			);

			return contentPage;
		} catch (err: any) {
			const error = CustomError('Failed to update content page', err, {
				contentPage,
			});
			console.error(error);
			throw new InternalServerErrorException(error);
		}
	}

	public async deleteContentPage(id: string): Promise<void> {
		try {
			// query path
			const contentPage = await this.getContentPageById(id);
			await this.dataService.execute<
				ContentPageQueryTypes['SoftDeleteContentMutation'],
				ContentPageQueryTypes['SoftDeleteContentMutationVariables']
			>(CONTENT_PAGE_QUERIES[getDatabaseType()].SoftDeleteContentDocument, {
				id,
				path: `${contentPage.path}-${id}`,
			});
		} catch (err: any) {
			throw CustomError('Failed to delete content page from the database', err, {
				id,
				query: CONTENT_PAGE_QUERIES[getDatabaseType()].SoftDeleteContentDocument,
			});
		}
	}

	/**
	 * Update content block.
	 *
	 * @param contentBlockConfig updated state of content block
	 */
	public async updateContentBlock(
		contentBlockConfig:
			| App_Content_Blocks_Set_Input_Avo
			| App_Content_Block_Set_Input_HetArchief
	): Promise<void> {
		try {
			await this.dataService.execute<
				ContentPageQueryTypes['UpdateContentBlockMutation'],
				ContentPageQueryTypes['UpdateContentBlockMutationVariables']
			>(CONTENT_PAGE_QUERIES[getDatabaseType()].UpdateContentBlockDocument, {
				contentBlock: contentBlockConfig as any,
				id: contentBlockConfig.id as number,
			});
		} catch (err: any) {
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
		} catch (err: any) {
			throw CustomError('Failed to delete content block', err, { id });
		}
	}

	private cleanContentBlocksBeforeDatabaseInsert(
		dbContentBlocks: Partial<{
			id?: number;
			name: string;
			type: string;
			errors: any;
			position: number;
			block: any;
			components: any;
			content_id: number;
		}>[]
	): ContentPageQueryTypes['InsertContentBlocksMutationVariables']['contentBlocks'] {
		return (dbContentBlocks || []).map((block) => {
			return {
				content_block_type: block.type as Lookup_Enum_Content_Block_Types_Enum,
				content_id: block.content_id,
				position: block.position,
				variables: {
					blockState: block.block,
					componentState: block.components,
				},
			};
		});
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
		contentBlockConfigs: App_Content_Blocks_Insert_Input[]
	): Promise<Partial<DbContentBlock>[] | null> {
		try {
			(contentBlockConfigs || []).forEach((block) => (block.content_id = contentId));

			const variables: ContentPageQueryTypes['InsertContentBlocksMutationVariables'] = {
				contentBlocks: this.cleanContentBlocksBeforeDatabaseInsert(
					contentBlockConfigs
				) as any, // TODO Figure out why type doesn't work
			};
			const response = await this.dataService.execute<
				ContentPageQueryTypes['InsertContentBlocksMutation'],
				ContentPageQueryTypes['InsertContentBlocksMutationVariables']
			>(CONTENT_PAGE_QUERIES[getDatabaseType()].InsertContentBlocksDocument, variables);
			const ids: number[] =
				(
					(response as ContentPageQueryTypes['InsertContentBlocksMutationAvo'])
						.insert_app_content_blocks ||
					(response as ContentPageQueryTypes['InsertContentBlocksMutationHetArchief'])
						.insert_app_content_block
				)?.returning?.map((block) => block.id) || [];

			return contentBlockConfigs.map((block, index) => ({
				...block,
				id: ids[index],
			}));
		} catch (err: any) {
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
		initialContentBlocks: DbContentBlock[],
		contentBlockConfigs: DbContentBlock[]
	) {
		try {
			const initialContentBlockIds: number[] = compact(
				initialContentBlocks.map((contentBlock) => contentBlock.id)
			);
			const currentContentBlockIds = contentBlockConfigs
				.filter((block) => has(block, 'id'))
				.map((block) => block.id);

			// Inserted content-blocks
			const insertPromises: Promise<any>[] = [];
			const insertedConfigs: DbContentBlock[] = contentBlockConfigs.filter(
				(config) => !has(config, 'id')
			);

			if (insertedConfigs.length) {
				insertPromises.push(this.insertContentBlocks(contentId, insertedConfigs));
			}

			// Updated content-blocks
			const updatePromises: Promise<any>[] = [];
			const updatedConfigs = contentBlockConfigs.filter(
				(config) =>
					has(config, 'id') && initialContentBlockIds.includes(config.id as number)
			);

			updatedConfigs.forEach((config: DbContentBlock) => {
				return updatePromises.push(
					this.updateContentBlock({
						content_block_type: config.type as any,
						id: config.id,
						position: config.position,
						variables: {
							blockState: config.block,
							componentState: config.components,
						},
						updated_at: new Date().toISOString(),
					})
				);
			});

			// Deleted content-blocks
			const deletePromises: Promise<any>[] = [];
			const deletedIds = without(initialContentBlockIds, ...currentContentBlockIds);

			deletedIds.forEach((id) => deletePromises.push(this.deleteContentBlock(id)));

			// Run requests in parallel
			await Promise.all([
				Promise.all(insertPromises),
				Promise.all(updatePromises),
				Promise.all(deletePromises),
			]);
		} catch (err: any) {
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
	public async getUserGroupsFromContentPage(path: string): Promise<(string | number)[]> {
		// Check if permissions are stricter than the permissions on the content_page
		const response = await this.dataService.execute<
			ContentPageQueryTypes['GetPermissionsFromContentPageByPathQuery'],
			ContentPageQueryTypes['GetPermissionsFromContentPageByPathQueryVariables']
		>(CONTENT_PAGE_QUERIES[getDatabaseType()].GetPermissionsFromContentPageByPathDocument, {
			path,
		});

		if (isAvo()) {
			const avoResponse =
				response as ContentPageQueryTypes['GetPermissionsFromContentPageByPathQueryAvo'];
			return avoResponse.app_content?.[0]?.user_group_ids || [];
		}

		const hetArchiefResponse =
			response as ContentPageQueryTypes['GetPermissionsFromContentPageByPathQueryHetArchief'];

		return hetArchiefResponse.app_content_page?.[0]?.user_group_ids || [];
	}

	public getImageUrlsFromJsonBlob(jsonBlob: any): string[] {
		const jsonString = JSON.stringify(jsonBlob);

		const assetUrlsRegex = new RegExp(
			`${escapeRegExp(process.env.ASSET_SERVER_ENDPOINT)}/${escapeRegExp(
				process.env.ASSET_SERVER_BUCKET_NAME
			)}/[^"\\\\]+`,
			'g'
		);
		return jsonString.match(assetUrlsRegex) || [];
	}
}
