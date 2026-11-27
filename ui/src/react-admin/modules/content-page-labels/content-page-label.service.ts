import type { AvoContentPageType, AvoSearchOrderDirection } from '@viaa/avo2-types';
import { compact } from 'es-toolkit';
import queryString from 'query-string';
import type { LabelObj } from '~content-blocks/BlockPageOverview/BlockPageOverview.types';
import { LABELS_PER_PAGE } from '~modules/content-page-labels/content-page-label.const';
import type {
	ContentPageLabel,
	ContentPageLabelOverviewTableCols,
} from '~modules/content-page-labels/content-page-label.types';
import { Locale } from '~modules/translations/translations.core.types';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';

export class ContentPageLabelService {
	private static getBaseUrl(): string {
		return `${getAdminCoreApiUrl()}/admin/content-page-labels`;
	}

	public static async fetchContentPageLabels(
		page: number,
		sortColumn: ContentPageLabelOverviewTableCols,
		sortOrder: AvoSearchOrderDirection,
		// biome-ignore lint/suspicious/noExplicitAny: todo
		where: any,
		itemsPerPage: number = LABELS_PER_PAGE
	): Promise<[ContentPageLabel[], number]> {
		try {
			return fetchWithLogoutJson(
				queryString.stringifyUrl({
					url: ContentPageLabelService.getBaseUrl(),
					query: {
						offset: page * itemsPerPage,
						limit: itemsPerPage,
						sortColumn,
						sortOrder,
						where: JSON.stringify(where),
					},
				}),
				{ throwOnNullResponse: true }
			);
		} catch (err) {
			throw new CustomError('Failed to get content page labels from the database', err, {
				page,
				sortColumn,
				sortOrder,
				where,
				itemsPerPage,
			});
		}
	}

	public static async fetchContentPageLabel(id: string | number): Promise<ContentPageLabel> {
		try {
			return fetchWithLogoutJson(`${ContentPageLabelService.getBaseUrl()}/${String(id)}`, {
				throwOnNullResponse: true,
			});
		} catch (err) {
			throw new CustomError('Failed to get content page label from the database', err, {
				id,
			});
		}
	}

	public static async insertContentPageLabels(
		contentPageLabels: Omit<ContentPageLabel, 'id'>[]
	): Promise<ContentPageLabel[]> {
		try {
			return fetchWithLogoutJson(ContentPageLabelService.getBaseUrl(), {
				method: 'PUT',
				body: JSON.stringify(
					contentPageLabels.map((labelObj) => ({
						label: labelObj.label,
						content_type: labelObj.content_type,
						language: labelObj.language,
						link_to: labelObj.link_to,
						color: labelObj.color,
						nl_parent_label_id: labelObj.nl_parent_label_id || null,
						// Only dutch labels have translations, undefined leaves the links unchanged
						translated_label_ids:
							labelObj.language === Locale.Nl && labelObj.translated_labels
								? labelObj.translated_labels.map((translatedLabel) => String(translatedLabel.id))
								: undefined,
					}))
				),
			});
		} catch (err) {
			throw new CustomError('Failed to insert content page labels in the database', err, {
				contentPageLabels,
			});
		}
	}

	static async updateContentPageLabel(
		contentPageLabelInfo: ContentPageLabel
	): Promise<ContentPageLabel> {
		try {
			return fetchWithLogoutJson(ContentPageLabelService.getBaseUrl(), {
				method: 'PATCH',
				body: JSON.stringify({
					id: contentPageLabelInfo.id,
					label: contentPageLabelInfo.label,
					content_type: contentPageLabelInfo.content_type,
					language: contentPageLabelInfo.language,
					link_to: contentPageLabelInfo.link_to,
					color: contentPageLabelInfo.color,
					nl_parent_label_id: contentPageLabelInfo.nl_parent_label_id || null,
					// Only dutch labels have translations, undefined leaves the links unchanged
					translated_label_ids:
						contentPageLabelInfo.language === Locale.Nl && contentPageLabelInfo.translated_labels
							? contentPageLabelInfo.translated_labels.map((translatedLabel) =>
									String(translatedLabel.id)
								)
							: undefined,
				}),
			});
		} catch (err) {
			throw new CustomError('Failed to update content page label in the database', err, {
				contentPageLabel: contentPageLabelInfo,
				query: 'UPDATE_CONTENT_PAGE_LABEL',
			});
		}
	}

	static async deleteContentPageLabel(id: string | number) {
		try {
			return fetchWithLogoutJson(`${ContentPageLabelService.getBaseUrl()}/${String(id)}`, {
				method: 'DELETE',
			});
		} catch (err) {
			throw new CustomError('Failed to delete content page label from the database', err, {
				route: `${ContentPageLabelService.getBaseUrl()}/${String(id)}`,
				id,
			});
		}
	}

	static async getContentPageLabelsByTypeAndLabels(
		contentType: AvoContentPageType,
		labels: string[]
	): Promise<LabelObj[]> {
		try {
			return fetchWithLogoutJson(ContentPageLabelService.getBaseUrl(), {
				method: 'POST',
				body: JSON.stringify({
					contentType,
					labels,
				}),
			});
		} catch (err) {
			throw new CustomError(
				'Failed to get content page label objects by content type and labels',
				err,
				{
					contentType,
					labels,
				}
			);
		}
	}

	static async getContentPageLabelsByTypeAndIds(
		contentType: AvoContentPageType,
		labelIds: number[] | string[]
	): Promise<LabelObj[]> {
		try {
			return fetchWithLogoutJson(ContentPageLabelService.getBaseUrl(), {
				method: 'POST',
				body: JSON.stringify({
					contentType,
					// biome-ignore lint/suspicious/noExplicitAny: todo
					labelIds: compact(labelIds as any[]),
				}),
			});
		} catch (err) {
			throw new CustomError(
				'Failed to get content page labels by content type and label ids',
				err,
				{
					contentType,
					// biome-ignore lint/suspicious/noExplicitAny: todo
					labelIds: compact(labelIds as any[]),
				}
			);
		}
	}

	/**
	 * Translate content page label values to another language, using the optional link between a label and its dutch version
	 * Labels without a linked translation in the target language are left out
	 * Only hetarchief has links between labels, avo always returns an empty list
	 * eg: ['Achter de schermen'] from nl to en => ['Behind the scenes']
	 * https://meemoo.atlassian.net/browse/ARC-4200
	 */
	public static async translateContentPageLabels(
		labels: string[],
		fromLanguage: Locale,
		toLanguage: Locale
	): Promise<string[]> {
		if (!labels.length) {
			return [];
		}
		try {
			return (
				(await fetchWithLogoutJson<string[]>(`${ContentPageLabelService.getBaseUrl()}/translate`, {
					method: 'POST',
					body: JSON.stringify({ labels, fromLanguage, toLanguage }),
				})) || []
			);
		} catch (err) {
			throw new CustomError('Failed to translate content page labels', err, {
				labels,
				fromLanguage,
				toLanguage,
			});
		}
	}
}
