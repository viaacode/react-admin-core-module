import type { Avo } from '@viaa/avo2-types';
import { compact } from 'lodash-es';
import { stringifyUrl } from 'query-string';

import { LABELS_PER_PAGE } from '~modules/content-page-labels/content-page-label.const';
import {
	ContentPageLabel,
	ContentPageLabelOverviewTableCols,
} from '~modules/content-page-labels/content-page-label.types';
import { LabelObj } from '~content-blocks/BlockPageOverview/BlockPageOverview.types';
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
		sortOrder: Avo.Search.OrderDirection,
		where: any,
		itemsPerPage: number = LABELS_PER_PAGE
	): Promise<[ContentPageLabel[], number]> {
		try {
			return fetchWithLogoutJson(
				stringifyUrl({
					url: this.getBaseUrl(),
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
			return fetchWithLogoutJson(this.getBaseUrl() + '/' + String(id), {
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
			return fetchWithLogoutJson(this.getBaseUrl(), {
				method: 'PUT',
				body: JSON.stringify(
					contentPageLabels.map((labelObj) => ({
						label: labelObj.label,
						content_type: labelObj.content_type,
						language: labelObj.language,
						link_to: labelObj.link_to,
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
			return fetchWithLogoutJson(this.getBaseUrl(), {
				method: 'PATCH',
				body: JSON.stringify({
					id: contentPageLabelInfo.id,
					label: contentPageLabelInfo.label,
					content_type: contentPageLabelInfo.content_type,
					language: contentPageLabelInfo.language,
					link_to: contentPageLabelInfo.link_to,
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
			return fetchWithLogoutJson(this.getBaseUrl() + '/' + String(id), {
				method: 'DELETE',
			});
		} catch (err) {
			throw new CustomError('Failed to delete content page label from the database', err, {
				route: this.getBaseUrl() + '/' + String(id),
				id,
			});
		}
	}

	static async getContentPageLabelsByTypeAndLabels(
		contentType: Avo.ContentPage.Type,
		labels: string[]
	): Promise<LabelObj[]> {
		try {
			return fetchWithLogoutJson(this.getBaseUrl(), {
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
		contentType: Avo.ContentPage.Type,
		labelIds: number[] | string[]
	): Promise<LabelObj[]> {
		try {
			return fetchWithLogoutJson(this.getBaseUrl(), {
				method: 'POST',
				body: JSON.stringify({
					contentType,
					labelIds: compact(labelIds as any[]),
				}),
			});
		} catch (err) {
			throw new CustomError(
				'Failed to get content page labels by content type and label ids',
				err,
				{
					contentType,
					labelIds: compact(labelIds as any[]),
				}
			);
		}
	}
}
