import { isAfter, isBefore, isWithinInterval, parseISO } from 'date-fns';
import { ContentPageInfo, PublishOption } from '../types/content-pages.types';

export function getPublishedState(
	contentPage: ContentPageInfo | Partial<ContentPageInfo> | undefined | null
): PublishOption {
	if (!contentPage) {
		return PublishOption.private;
	}

	const { isPublic, publishAt, depublishAt } = contentPage;

	if (publishAt || depublishAt) {
		return PublishOption.timebound;
	}

	if (isPublic) {
		return PublishOption.public;
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
		if (
			isWithinInterval(new Date(), { start: parseISO(publishAt), end: parseISO(depublishAt) })
		) {
			return publishAt;
		}
		return null;
	}

	if (publishAt) {
		if (isAfter(new Date(), parseISO(publishAt))) {
			return publishAt;
		}
		return null;
	}

	if (depublishAt) {
		if (isBefore(new Date(), parseISO(depublishAt))) {
			return new Date().toISOString();
		}
		return null;
	}

	return null;
}

export function isPublic(contentPage: Partial<ContentPageInfo> | undefined | null): boolean {
	return !!getPublishedDate(contentPage);
}
