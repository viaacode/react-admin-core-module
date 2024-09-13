import { compact, isArray, isFunction, isPlainObject, sortBy } from 'lodash-es';
import { ToastType } from '~core/config';
import { CONTENT_BLOCK_CONFIG_MAP } from '~modules/content-page/const/content-block-config-map';
import { RichEditorStateKey } from '~modules/content-page/const/rich-text-editor.consts';
import type {
	ContentBlockConfig,
	ContentBlockType,
	DbContentBlock,
} from '~modules/content-page/types/content-block.types';
import type { ContentPageInfo, DbContentPage } from '~modules/content-page/types/content-pages.types';
import { CustomError } from '~shared/helpers/custom-error';
import { mapDeep } from '~shared/helpers/map-deep/map-deep';
import { sanitizeHtml } from '~shared/helpers/sanitize';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';
import { showToast } from '~shared/helpers/show-toast';
import { tText } from '~shared/helpers/translation-functions';

export function getContentPageDescriptionHtml(
	contentPageInfo: Partial<ContentPageInfo> | undefined,
	sanitizePreset: SanitizePreset = SanitizePreset.link
): string | null {
	const descriptionHtml = contentPageInfo?.description_state
		? contentPageInfo?.description_state.toHTML()
		: contentPageInfo?.description || null;
	return descriptionHtml ? sanitizeHtml(descriptionHtml, sanitizePreset) : null;
}

/**
 * Remove rich text editor states, since they are also saved as html,
 * and we don't want those states to end up in the database
 * @param blockConfigs
 */
export function convertRichTextEditorStatesToHtml(
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
					SanitizePreset.full
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
		content_blocks: convertDbContentBlockToContentBlockConfig(dbContentPage.content_blocks),
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
	const dbContentPage = {
		...contentPageInfo,
		description: getContentPageDescriptionHtml(contentPageInfo),
		content_blocks: convertRichTextEditorStatesToHtml(contentPageInfo.content_blocks || []).map(
			(contentBlock): DbContentBlock => {
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
			}
		),
	} as DbContentPage;
	delete dbContentPage.description_state;
	return dbContentPage;
}
