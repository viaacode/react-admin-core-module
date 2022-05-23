import { Avo } from '@viaa/avo2-types';
import { get } from 'lodash-es';
import moment from 'moment';

import { ContentBlockConfig } from '../types/content-block.types';
import { ContentPageInfo, PublishOption } from '../types/content-pages.types';

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

