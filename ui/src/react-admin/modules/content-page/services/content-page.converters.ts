import { compact, sortBy } from 'lodash-es';
import { AdminConfigManager, ToastType } from '~core/config';
import { CONTENT_BLOCK_CONFIG_MAP } from '~modules/content-page/const/content-block-config-map';
import { ContentBlockConfig, ContentBlockType, DbContentBlock } from '~modules/content-page/types/content-block.types';
import { ContentPageInfo, DbContentPage } from '~modules/content-page/types/content-pages.types';
import { CustomError } from '~modules/shared/helpers/custom-error';

export function convertDbContentPagesToContentPageInfos(
	dbContentPages: DbContentPage[] | null
): ContentPageInfo[] | null {
	if (!dbContentPages) {
		return dbContentPages;
	}
	return dbContentPages.map(convertDbContentPageToContentPageInfo);
}

export function convertDbContentPageToContentPageInfo(
	dbContentPage: DbContentPage
): ContentPageInfo {
	return {
		...dbContentPage,
		content_blocks: convertDbContentBlockToContentBlockConfig(
			dbContentPage.content_blocks
		),
	};
}

export function convertDbContentBlockToContentBlockConfig(
	contentBlocks: DbContentBlock[]
): ContentBlockConfig[] {
	const sortedContentBlocks = sortBy(contentBlocks, (c) => c.position);

	return compact(
		(sortedContentBlocks || []).map((contentBlock: DbContentBlock) => {
			const { type, id, components, block } = contentBlock;
			const configForType = CONTENT_BLOCK_CONFIG_MAP[type as ContentBlockType];
			if (!configForType) {
				console.error(
					new CustomError('Failed to find content block config for type', null, {
						type,
						contentBlock,
						CONTENT_BLOCK_CONFIG_MAP,
					})
				);
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: AdminConfigManager.getConfig().services.i18n.tText(
						'modules/admin/content-page/helpers/get-published-state___error'
					),
					description: AdminConfigManager.getConfig().services.i18n.tText(
						'modules/admin/content-page/helpers/get-published-state___er-ging-iets-mis-bij-het-laden-van-de-pagina'
					),
					type: ToastType.ERROR,
				});
				return null;
			}
			const cleanConfig = configForType(contentBlock.position);

			const rawComponentState = components;
			const componentState = Array.isArray(rawComponentState)
				? rawComponentState
				: { ...cleanConfig.components.state, ...rawComponentState };

			return {
				...cleanConfig,
				id,
				components: {
					...cleanConfig.components,
					state: componentState,
				},
				block: {
					...cleanConfig.block,
					state: {
						...cleanConfig.block.state,
						...(block || {}),
					},
				},
			} as ContentBlockConfig;
		})
	);
}

export function convertContentPageInfoToDbContentPage(
	contentPageInfo: Partial<ContentPageInfo> | undefined
): DbContentPage | undefined {
	if (!contentPageInfo) {
		return undefined;
	}
	return {
		...contentPageInfo,
		content_blocks: (contentPageInfo.content_blocks || []).map(
			(contentBlock): DbContentBlock => {
				return {
					name: contentBlock.name,
					id: contentBlock.id,
					anchor: contentBlock.anchor,
					type: contentBlock.type,
					errors: contentBlock.errors,
					position: contentBlock.position,
					block: contentBlock.block.state,
					components: contentBlock.components.state,
				};
			}
		),
	} as DbContentPage;
}
