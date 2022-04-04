import { Avo } from '@viaa/avo2-types';
import { compact, get } from 'lodash-es';
import moment from 'moment';
import { i18n } from 'next-i18next';

import { toastService } from '@shared/services/toast-service';

import { CONTENT_BLOCK_CONFIG_MAP } from '../const/content-block.consts';
import { ContentBlockConfig, ContentBlockType } from '../types/content-block.types';
import { ContentPageInfo, PublishOption } from '../types/content-pages.types';

import { CustomError } from 'modules/admin/shared/helpers/custom-error';

export function getPublishedState(
	contentPage: ContentPageInfo | Partial<ContentPageInfo> | undefined | null
): PublishOption {
	if (!contentPage) {
		return PublishOption.private;
	}

	const { is_public, publish_at, depublish_at } = contentPage;

	if (is_public) {
		return PublishOption.public;
	}

	if (publish_at || depublish_at) {
		return PublishOption.timebound;
	}

	return PublishOption.private;
}

export function getPublishedDate(
	contentPage: ContentPageInfo | Partial<ContentPageInfo> | undefined | null
): string | null {
	if (!contentPage) {
		return null;
	}

	const { is_public, published_at, publish_at, depublish_at } = contentPage;

	if (is_public && published_at) {
		return published_at;
	}

	if (publish_at && depublish_at) {
		if (moment().isBetween(moment(publish_at), moment(depublish_at))) {
			return publish_at;
		}
		return null;
	}

	if (publish_at) {
		if (moment().isAfter(moment(publish_at))) {
			return publish_at;
		}
		return null;
	}

	if (depublish_at) {
		if (moment().isBefore(moment(depublish_at))) {
			return new Date().toISOString();
		}
		return null;
	}

	return null;
}

export function isPublic(
	contentPage: ContentPageInfo | Partial<ContentPageInfo> | undefined | null
): boolean {
	return !!getPublishedDate(contentPage);
}

// Parse content-block config to valid request body
export const convertBlockToDatabaseFormat = (
	contentBlockConfig: Partial<ContentBlockConfig>,
	contentId?: number
) => {
	const componentState = get(contentBlockConfig, 'components.state');
	const { ...blockState } = get(contentBlockConfig, 'block.state');

	return {
		position: contentBlockConfig.position,
		variables: { componentState, blockState },
		...(contentId ? { content_id: contentId } : null),
		content_block_type: contentBlockConfig.type,
	};
};

export const convertBlocksToDatabaseFormat = (
	contentBlockConfigs: Partial<ContentBlockConfig>[],
	contentId?: number
): Partial<Avo.ContentPage.Block>[] =>
	contentBlockConfigs.map((contentBlockConfig) =>
		convertBlockToDatabaseFormat(contentBlockConfig, contentId)
	);

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
				toastService.notify({
					title:
						i18n?.t('modules/admin/content-page/helpers/get-published-state___error') ||
						'',
					description:
						i18n?.t(
							'modules/admin/content-page/helpers/get-published-state___er-ging-iets-mis-bij-het-laden-van-de-pagina'
						) || '',
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
