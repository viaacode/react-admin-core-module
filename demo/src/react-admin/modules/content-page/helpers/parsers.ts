import { Avo } from '@viaa/avo2-types';

import { ContentPageDb, ContentPageInfo, ContentWidth } from '../types/content-pages.types';

import { UserService } from '~modules/user/user.service';
import { CommonUser } from '~modules/user/user.types';
import {
	ContentBlockConfig,
	ContentBlockType,
} from '~modules/content-page/types/content-block.types';
import { compact, get } from 'lodash-es';
import { CONTENT_BLOCK_CONFIG_MAP } from '~modules/content-page/const/content-block.consts';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { Config, ToastType } from '~core/config';

export function convertToContentPageInfo(dbContentPage: ContentPageDb): ContentPageInfo {
	const labels = (dbContentPage.content_content_labels || []).map(
		(labelLink: Avo.ContentPage.LabelLink) => labelLink.content_label
	);
	const contentBlockConfigs = dbContentPage.content_blocks
		? parseContentBlocks(dbContentPage.content_blocks)
		: [];

	return {
		labels,
		contentBlockConfigs,
		id: dbContentPage.id,
		thumbnail_path: dbContentPage.thumbnail_path,
		title: dbContentPage.title,
		description_html: dbContentPage.description || '',
		description_state: undefined,
		seo_description: dbContentPage.seo_description || '',
		meta_description: dbContentPage.meta_description || '',
		is_protected: dbContentPage.is_protected,
		is_public: dbContentPage.is_public,
		path: dbContentPage.path,
		content_type: dbContentPage.content_type as Avo.ContentPage.Type,
		content_width:
			dbContentPage.content_width ||
			Config.getConfig()?.contentPage?.defaultPageWidth ||
			ContentWidth.EXTRA_LARGE,
		publish_at: dbContentPage.publish_at || null,
		depublish_at: dbContentPage.depublish_at || null,
		published_at: dbContentPage.published_at || null,
		created_at: dbContentPage.created_at,
		updated_at: dbContentPage.updated_at || dbContentPage.created_at || null,
		user_group_ids: dbContentPage.user_group_ids,
		profile: UserService.adaptProfile(dbContentPage.profile) as CommonUser,
		user_profile_id: dbContentPage.user_profile_id,
	};
}

export function convertToContentPageInfos(dbContentPages: ContentPageDb[]): ContentPageInfo[] {
	return (dbContentPages || []).map(convertToContentPageInfo);
}

export function convertToDatabaseContentPage(
	contentPageInfo: Partial<ContentPageInfo>
): ContentPageDb {
	return {
		id: contentPageInfo.id,
		thumbnail_path: contentPageInfo.thumbnail_path,
		title: contentPageInfo.title,
		description:
			(contentPageInfo.description_state
				? contentPageInfo.description_state.toHTML()
				: contentPageInfo.description_html) || null,
		seo_description: contentPageInfo.seo_description || null,
		meta_description: contentPageInfo.meta_description || null,
		is_protected: contentPageInfo.is_protected,
		is_public: contentPageInfo.is_public,
		path: contentPageInfo.path,
		content_type: contentPageInfo.content_type,
		content_width: contentPageInfo.content_width,
		publish_at: contentPageInfo.publish_at || null,
		depublish_at: contentPageInfo.depublish_at || null,
		published_at: contentPageInfo.published_at || null,
		created_at: contentPageInfo.created_at || null,
		updated_at: contentPageInfo.updated_at || null,
		user_group_ids: contentPageInfo.user_group_ids,
		user_profile_id: contentPageInfo.user_profile_id,
	} as ContentPageDb;
}

// Parse content-blocks to configs
export const parseContentBlocks = (
	contentBlocks: Avo.ContentPage.Block[]
): ContentBlockConfig[] => {
	const sortedContentBlocks = contentBlocks.sort((a, b) => a.position - b.position);

	return compact(
		(sortedContentBlocks || []).map((contentBlock) => {
			const { content_block_type, id, variables } = contentBlock;
			const configForType = CONTENT_BLOCK_CONFIG_MAP[content_block_type as ContentBlockType];
			if (!configForType) {
				console.error(
					new CustomError('Failed to find content block config for type', null, {
						content_block_type,
						contentBlock,
						CONTENT_BLOCK_CONFIG_MAP,
					})
				);
				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t(
						'modules/admin/content-page/helpers/get-published-state___error'
					),
					description: Config.getConfig().services.i18n.t(
						'modules/admin/content-page/helpers/get-published-state___er-ging-iets-mis-bij-het-laden-van-de-pagina'
					),
					type: ToastType.ERROR,
				});
				return null;
			}
			const cleanConfig = configForType(contentBlock.position);

			const rawComponentState = get(variables, 'componentState', null);
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
						...get(variables, 'blockState', {}),
					},
				},
			} as ContentBlockConfig;
		})
	);
};
