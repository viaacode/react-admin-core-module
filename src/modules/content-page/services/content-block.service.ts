import { Avo } from '@viaa/avo2-types';
import { compact, get, has, omit, without } from 'lodash-es';
import { i18n } from 'modules/admin/shared/helpers/i18n';

import { CustomError } from '../../shared/helpers/custom-error';
import { getEnv } from '../../shared/helpers/env';
import { dataService } from '../../shared/services/data-service';
import { AvoOrHetArchief } from '../../shared/types';
import { CONTENT_BLOCKS_RESULT_PATH } from '../const/content-block.consts';
import {
	convertBlocksToDatabaseFormat,
	convertBlockToDatabaseFormat,
} from '../helpers/get-published-state';
import { CONTENT_PAGE_QUERIES } from '../queries/content-pages.queries';
import { ContentBlockConfig } from '../types/content-block.types';

import { UpdateContentBlockMutation } from '~generated/graphql-db-types-avo';

export class ContentBlockService {
	private static queries =
		CONTENT_PAGE_QUERIES[getEnv('DATABASE_APPLICATION_TYPE') as AvoOrHetArchief];

	/**
	 * Update content block.
	 *
	 * @param contentBlockConfig updated state of content block
	 */
	public static async updateContentBlock(contentBlockConfig: ContentBlockConfig): Promise<void> {
		try {
			const contentBlock = convertBlockToDatabaseFormat(contentBlockConfig);

			await dataService.query({
				query: this.queries.UpdateContentBlockDocument,
				variables: { contentBlock, id: contentBlockConfig.id },
			});
		} catch (err) {
			console.error(
				new CustomError('Failed to update content block', err, {
					contentBlockConfig,
				})
			);

			toastService.notify({
				title: i18n.t('modules/admin/content-page/services/content-block___error'),
				description: i18n.t(
					'admin/content-block/content-block___er-ging-iets-mis-tijdens-het-updaten-van-de-content-blocks'
				),
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
				query: this.queries.DeleteContentBlockDocument,
				variables: { id },
			});
		} catch (err) {
			console.error(new CustomError('Failed to delete content block', err, { id }));

			toastService.notify({
				title: i18n.t('modules/admin/content-page/services/content-block___error'),
				description: i18n.t(
					'admin/content-block/content-block___er-ging-iets-mis-tijdens-het-verwijderen-van-de-content-blocks'
				),
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
			const response = await dataService.query({
				query: this.queries.InsertContentBlocksDocument,
				variables: {
					contentBlocks: this.cleanContentBlocksBeforeDatabaseInsert(dbBlocks),
				},
			});

			const ids: number[] =
				get(response, `data.${CONTENT_BLOCKS_RESULT_PATH.INSERT}.returning`) || [];
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

			toastService.notify({
				title: i18n.t('modules/admin/content-page/services/content-block___error'),
				description: i18n.t(
					'admin/content-block/content-block___er-ging-iets-mis-tijdens-het-opslaan-van-de-content-blocks'
				),
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

			toastService.notify({
				title: i18n.t('modules/admin/content-page/services/content-block___error'),
				description: i18n.t(
					'admin/content-block/content-block___er-ging-iets-mis-tijdens-het-opslaan-van-de-content-blocks'
				),
			});

			return null;
		}
	}
}
