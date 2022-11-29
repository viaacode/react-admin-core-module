import moment from 'moment';

import { ContentPageInfo, PublishOption } from '../types/content-pages.types';

export function getPublishedState(
	contentPage: ContentPageInfo | Partial<ContentPageInfo> | undefined | null
): PublishOption {
	if (!contentPage) {
		return PublishOption.private;
	}

	const { isPublic, publishAt, depublishAt } = contentPage;

	if (isPublic) {
		return PublishOption.public;
	}

	if (publishAt || depublishAt) {
		return PublishOption.timebound;
	}

	return PublishOption.private;
}

export function getPublishedDate(
	contentPage: Partial<ContentPageInfo> | undefined | null
): string | null {
	if (!contentPage) {
		return null;
	}

	const { isPublic, publishedAt, publishAt, depublishAt } = contentPage;

	if (isPublic && publishedAt) {
		return publishedAt;
	}

	if (publishAt && depublishAt) {
		if (moment().isBetween(moment(publishAt), moment(depublishAt))) {
			return publishAt;
		}
		return null;
	}

	if (publishAt) {
		if (moment().isAfter(moment(publishAt))) {
			return publishAt;
		}
		return null;
	}

	if (depublishAt) {
		if (moment().isBefore(moment(depublishAt))) {
			return new Date().toISOString();
		}
		return null;
	}

	return null;
}

export function isPublic(contentPage: Partial<ContentPageInfo> | undefined | null): boolean {
	return !!getPublishedDate(contentPage);
}
