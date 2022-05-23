import { Avo } from '@viaa/avo2-types';
import { compact, has, omit, without } from 'lodash-es';
import { performQuery } from '~modules/shared/helpers/gql';

import { CustomError } from '../../shared/helpers/custom-error';
import { dataService } from '../../shared/services/data-service';
import { CONTENT_BLOCKS_RESULT_PATH } from '../const/content-block.common.consts';
import {
	convertBlocksToDatabaseFormat,
	convertBlockToDatabaseFormat,
} from '../helpers/get-published-state';
import { CONTENT_PAGE_QUERIES } from '../queries/content-pages.queries';
import { ContentBlockConfig } from '../types/content-block.types';

import { Config, ToastType } from '~core/config';

export class ContentBlockService {
	private static getQueries() {
		return CONTENT_PAGE_QUERIES[Config.getConfig().database.databaseApplicationType];
	}

	/**
	 * Update content block.
	 *
	 * @param contentBlockConfig updated state of content block
	 */
	public static async updateContentBlock(contentBlockConfig: ContentBlockConfig): Promise<void> {
		try {
			const contentBlock = convertBlockToDatabaseFormat(contentBlockConfig);

			await dataService.query({
				query: this.getQueries().UpdateContentBlockDocument,
				variables: { contentBlock, id: contentBlockConfig.id },
			});
		} catch (err) {
			console.error(
				new CustomError('Failed to update content block', err, {
					contentBlockConfig,
				})
			);

			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t(
					'modules/admin/content-page/services/content-block___error'
				),
				description: Config.getConfig().services.i18n.t(
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
			return await dataService.query({
				query: this.getQueries().DeleteContentBlockDocument,
				variables: { id },
			});
		} catch (err) {
			console.error(new CustomError('Failed to delete content block', err, { id }));

			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t(
					'modules/admin/content-page/services/content-block___error'
				),
				description: Config.getConfig().services.i18n.t(
					'admin/content-block/content-block___er-ging-iets-mis-tijdens-het-verwijderen-van-de-content-blocks'
				),
				type: ToastType.ERROR,
			});

			return null;
		}
	}

	private static cleanContentBlocksBeforeDatabaseInsert(
		dbContentBlocks: Partial<Avo.ContentPage.Block>[]
	) {
		return (dbContentBlocks || []).map((block) =>
			omit(block, 'enum_content_block_type', '__typename', 'id')
		);
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
			const ids: number[] = await performQuery(
				{
					query: this.getQueries().InsertContentBlocksDocument,
					variables: {
						contentBlocks: this.cleanContentBlocksBeforeDatabaseInsert(dbBlocks),
					},
				},
				CONTENT_BLOCKS_RESULT_PATH.INSERT,
				'Failed to insert content blocks'
			);

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

			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t(
					'modules/admin/content-page/services/content-block___error'
				),
				description: Config.getConfig().services.i18n.t(
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

			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t(
					'modules/admin/content-page/services/content-block___error'
				),
				description: Config.getConfig().services.i18n.t(
					'admin/content-block/content-block___er-ging-iets-mis-tijdens-het-opslaan-van-de-content-blocks'
				),
				type: ToastType.ERROR,
			});

			return null;
		}
	}
}
