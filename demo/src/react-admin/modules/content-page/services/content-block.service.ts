import { Avo } from '@viaa/avo2-types';
import { compact, has, omit, without } from 'lodash-es';

import { CustomError } from '../../shared/helpers/custom-error';
import { dataService } from '../../shared/services/data-service';
import {
	convertBlocksToDatabaseFormat,
	convertBlockToDatabaseFormat,
} from '../helpers/get-published-state';
import { CONTENT_PAGE_QUERIES, ContentPageQueryTypes } from '../queries/content-pages.queries';
import { ContentBlockConfig } from '../types/content-block.types';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { UpdateContentBlockMutationVariables as UpdateContentBlockMutationVariablesAvo } from '~generated/graphql-db-types-avo';

export class ContentBlockService {
	private static getQueries() {
		return CONTENT_PAGE_QUERIES[
			AdminConfigManager.getConfig().database.databaseApplicationType
		];
	}

	/**
	 * Update content block.
	 *
	 * @param contentBlockConfig updated state of content block
	 */
	public static async updateContentBlock(contentBlockConfig: ContentBlockConfig): Promise<void> {
		try {
			const contentBlock = convertBlockToDatabaseFormat(contentBlockConfig);

			await dataService.query<
				ContentPageQueryTypes['UpdateContentBlockMutation'],
				ContentPageQueryTypes['UpdateContentBlockMutationVariables']
			>({
				query: this.getQueries().UpdateContentBlockDocument,
				variables: {
					contentBlock:
						contentBlock as UpdateContentBlockMutationVariablesAvo['contentBlock'],
					id: contentBlockConfig.id as number,
				},
			});
		} catch (err) {
			console.error(
				new CustomError('Failed to update content block', err, {
					contentBlockConfig,
				})
			);

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.tText(
					'modules/admin/content-page/services/content-block___error'
				),
				description: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/content-block___er-ging-iets-mis-tijdens-het-updaten-van-de-content-blocks'
				),
				type: ToastType.ERROR,
			});
		}
	}

	/**
	 * Delete content block.
	 *
	 * @param id content block identifier
	 */
	public static async deleteContentBlock(id: number) {
		try {
			return await dataService.query<
				ContentPageQueryTypes['DeleteContentBlockMutation'],
				ContentPageQueryTypes['DeleteContentBlockMutationVariables']
			>({
				query: this.getQueries().DeleteContentBlockDocument,
				variables: { id },
			});
		} catch (err) {
			console.error(new CustomError('Failed to delete content block', err, { id }));

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.tText(
					'modules/admin/content-page/services/content-block___error'
				),
				description: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/content-block___er-ging-iets-mis-tijdens-het-verwijderen-van-de-content-blocks'
				),
				type: ToastType.ERROR,
			});

			return null;
		}
	}

	private static cleanContentBlocksBeforeDatabaseInsert(
		dbContentBlocks: Partial<Avo.ContentPage.Block>[]
	): ContentPageQueryTypes['InsertContentBlocksMutationVariables']['contentBlocks'] {
		return (dbContentBlocks || []).map((block) =>
			omit(block, 'enum_content_block_type', '__typename', 'id')
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
	public static async insertContentBlocks(
		contentId: number,
		contentBlockConfigs: Partial<ContentBlockConfig>[]
	): Promise<Partial<ContentBlockConfig>[] | null> {
		try {
			const dbBlocks: Partial<Avo.ContentPage.Block>[] =
				convertBlocksToDatabaseFormat(contentBlockConfigs);
			(dbBlocks || []).forEach((block) => (block.content_id = contentId));

			const response = await dataService.query<
				ContentPageQueryTypes['InsertContentBlocksMutation'],
				ContentPageQueryTypes['InsertContentBlocksMutationVariables']
			>({
				query: this.getQueries().InsertContentBlocksDocument,
				variables: {
					contentBlocks: this.cleanContentBlocksBeforeDatabaseInsert(dbBlocks) as any, // TODO Figure out why type doesn't work
				},
			});
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
		} catch (err) {
			console.error(
				new CustomError('Failed to insert content blocks', err, {
					contentId,
					contentBlockConfigs,
				})
			);

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.tText(
					'modules/admin/content-page/services/content-block___error'
				),
				description: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/content-block___er-ging-iets-mis-tijdens-het-opslaan-van-de-content-blocks'
				),
				type: ToastType.ERROR,
			});

			return null;
		}
	}

	/**
	 * Update content blocks.
	 *
	 * @param contentId content page identifier
	 * @param initialContentBlocks initial state of content blocks
	 * @param contentBlockConfigs configs of content blocks to update
	 */
	public static async updateContentBlocks(
		contentId: number,
		initialContentBlocks: ContentBlockConfig[],
		contentBlockConfigs: ContentBlockConfig[]
	) {
		try {
			const initialContentBlockIds: number[] = compact(
				initialContentBlocks.map((contentBlock) => contentBlock.id)
			);
			const currentContentBlockIds = contentBlockConfigs.reduce((acc: number[], curr) => {
				if (has(curr, 'id')) {
					return [...acc, curr.id as number];
				}

				return acc;
			}, []);

			// Inserted content-blocks
			const insertPromises: Promise<any>[] = [];
			const insertedConfigs: ContentBlockConfig[] = contentBlockConfigs.filter(
				(config) => !has(config, 'id')
			);

			if (insertedConfigs.length) {
				insertPromises.push(
					ContentBlockService.insertContentBlocks(contentId, insertedConfigs)
				);
			}

			// Updated content-blocks
			const updatePromises: Promise<any>[] = [];
			const updatedConfigs = contentBlockConfigs.filter(
				(config) =>
					has(config, 'id') && initialContentBlockIds.includes(config.id as number)
			);

			updatedConfigs.forEach((config) =>
				updatePromises.push(ContentBlockService.updateContentBlock(config))
			);

			// Deleted content-blocks
			const deletePromises: Promise<any>[] = [];
			const deletedIds = without(initialContentBlockIds, ...currentContentBlockIds);

			deletedIds.forEach((id) =>
				deletePromises.push(ContentBlockService.deleteContentBlock(id))
			);

			// Run requests in parallel
			await Promise.all([
				Promise.all(insertPromises),
				Promise.all(updatePromises),
				Promise.all(deletePromises),
			]);
		} catch (err) {
			console.error(
				new CustomError('Failed to update content blocks', err, {
					contentId,
					initialContentBlocks,
					contentBlockConfigs,
				})
			);

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.tText(
					'modules/admin/content-page/services/content-block___error'
				),
				description: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/content-block___er-ging-iets-mis-tijdens-het-opslaan-van-de-content-blocks'
				),
				type: ToastType.ERROR,
			});

			return null;
		}
	}
}
