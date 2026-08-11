import { compact, sortBy } from 'es-toolkit';
import { isEmpty } from 'es-toolkit/compat';
import { ToastType } from '~core/config/config.types';
import { CONTENT_BLOCK_CONFIG_MAP } from '~modules/content-page/const/content-block-config-map';
import { TEMP_BLOCK_ID_PREFIX } from '~modules/content-page/const/content-page.consts';
import type {
	ContentBlockConfig,
	ContentBlockType,
	DbContentBlock,
} from '~modules/content-page/types/content-block.types';
import type {
	ContentPageInfo,
	DbContentPage,
} from '~modules/content-page/types/content-pages.types';
import { CustomError } from '~shared/helpers/custom-error';
import { sanitizeHtml } from '~shared/helpers/sanitize';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';
import { showToast } from '~shared/helpers/show-toast';
import { tText } from '~shared/helpers/translation-functions';

export function getContentPageDescriptionHtml(
	contentPageInfo: Partial<ContentPageInfo> | undefined,
	sanitizePreset: SanitizePreset = SanitizePreset.link
): string | null {
	const descriptionHtml = contentPageInfo?.description || null;
	return descriptionHtml ? sanitizeHtml(descriptionHtml, sanitizePreset) : null;
}

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
		content_blocks: convertDbContentBlockToContentBlockConfig(dbContentPage.content_blocks || []),
	};
}

export function convertDbContentBlockToContentBlockConfig(
	contentBlocks: DbContentBlock[]
): ContentBlockConfig[] {
	if (isEmpty(contentBlocks)) {
		return [];
	}
	const sortedContentBlocks = sortBy(contentBlocks, ['position']);

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
				showToast({
					title: tText('modules/admin/content-page/helpers/get-published-state___error'),
					description: tText(
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
				id: id || TEMP_BLOCK_ID_PREFIX + Date.now(),
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
	const dbContentPage = {
		...contentPageInfo,
		description: getContentPageDescriptionHtml(contentPageInfo),
		content_blocks: (contentPageInfo.content_blocks || []).map((contentBlock): DbContentBlock => {
			return {
				name: contentBlock.name,
				id: contentBlock.unsaved ? undefined : contentBlock.id,
				anchor: contentBlock.anchor,
				type: contentBlock.type,
				errors: contentBlock.errors,
				position: contentBlock.position,
				block: contentBlock.block.state,
				components: contentBlock.components.state,
			};
		}),
	} as DbContentPage;
	delete dbContentPage.description_state;
	return dbContentPage;
}
