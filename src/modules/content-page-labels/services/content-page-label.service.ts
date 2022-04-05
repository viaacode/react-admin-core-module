import { LabelObj } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { get, isNil } from 'lodash-es';
import getConfig from 'next/config';

import { CustomError } from '../../shared/helpers/custom-error';
import { getEnv } from '../../shared/helpers/env';
import { fetchWithLogout } from '../../shared/helpers/fetch-with-logout';
import { dataService } from '../../shared/services/data-service';
import { AvoOrHetArchief } from '../../shared/types';
import { ITEMS_PER_PAGE } from '../content-page-label.const';
import { ContentPageLabel, ContentPageLabelOverviewTableCols } from '../content-page-label.types';
import { CONTENT_PAGE_LABEL_QUERIES } from '../queries/content-page-label.queries';

import { Config, ToastType } from 'core/config';

const { publicRuntimeConfig } = getConfig();

export class ContentPageLabelService {
	private static queries =
		CONTENT_PAGE_LABEL_QUERIES[getEnv('DATABASE_APPLICATION_TYPE') as AvoOrHetArchief];

	public static async fetchContentPageLabels(
		page: number,
		sortColumn: ContentPageLabelOverviewTableCols,
		sortOrder: Avo.Search.OrderDirection,
		where: any,
		itemsPerPage: number = ITEMS_PER_PAGE
	): Promise<[ContentPageLabel[], number]> {
		let variables: any;
		try {
			variables = {
				where,
				offset: itemsPerPage * page,
				limit: itemsPerPage,
				orderBy: [{ [sortColumn]: sortOrder }],
			};
			const response = await dataService.query({
				variables,
				query: this.queries.GetContentPageLabelsDocument,
			});
			const contentPageLabel = get(response, 'data.app_content_labels');
			const contentPageLabelCount = get(
				response,
				'data.app_content_labels_aggregate.aggregate.count'
			);

			if (!contentPageLabel) {
				throw new CustomError('Response does not contain any content page labels', null, {
					response,
				});
			}

			return [contentPageLabel, contentPageLabelCount];
		} catch (err) {
			throw new CustomError('Failed to get content page labels from the database', err, {
				variables,
				query: 'GET_CONTENT_PAGE_LABELS',
			});
		}
	}

	public static async fetchContentPageLabel(id: string): Promise<ContentPageLabel> {
		try {
			const response = await dataService.query({
				query: this.queries.GetContentPageLabelByIdDocument,
				variables: { id },
			});

			const contentPageLabelObj = get(response, 'data.app_content_labels[0]');

			if (!contentPageLabelObj) {
				throw new CustomError('Failed to find content page label by id', null, {
					response,
				});
			}

			return {
				id: contentPageLabelObj.id,
				label: contentPageLabelObj.label,
				content_type: contentPageLabelObj.content_type,
				link_to: contentPageLabelObj.link_to,
				created_at: contentPageLabelObj.created_at,
				updated_at: contentPageLabelObj.updated_at,
			};
		} catch (err) {
			throw new CustomError('Failed to get content page label by id', err, {
				query: 'GET_CONTENT_PAGE_LABEL_BY_ID',
				variables: { id },
			});
		}
	}

	public static async insertContentPageLabel(
		contentPageLabel: ContentPageLabel
	): Promise<number> {
		try {
			const response = await dataService.query({
				query: this.queries.InsertContentPageLabelDocument,
				variables: {
					contentPageLabel: {
						label: contentPageLabel.label,
						content_type: contentPageLabel.content_type,
					} as Partial<ContentPageLabel>,
				},
			});
			if (response.errors) {
				throw new CustomError('Failed to insert content page label in the database', null, {
					response,
					errors: response.errors,
				});
			}
			const contentPageLabelId = get(
				response,
				'data.insert_app_content_labels.returning[0].id'
			);
			if (isNil(contentPageLabelId)) {
				throw new CustomError(
					'Response from database does not contain the id of the inserted content page label',
					null,
					{ response }
				);
			}
			return contentPageLabelId;
		} catch (err) {
			throw new CustomError('Failed to insert content page label in the database', err, {
				contentPageLabel,
				query: 'INSERT_CONTENT_PAGE_LABEL',
			});
		}
	}

	static async updateContentPageLabel(contentPageLabelInfo: ContentPageLabel) {
		try {
			const response = await dataService.query({
				query: this.queries.UpdateContentPageLabelDocument,
				variables: {
					contentPageLabel: {
						label: contentPageLabelInfo.label,
						content_type: contentPageLabelInfo.content_type,
						link_to: contentPageLabelInfo.link_to,
					} as Partial<ContentPageLabel>,
					contentPageLabelId: contentPageLabelInfo.id,
				},
			});
			if (response.errors) {
				throw new CustomError('Failed to update content page label in the database', null, {
					response,
					errors: response.errors,
				});
			}
		} catch (err) {
			throw new CustomError('Failed to update content page label in the database', err, {
				contentPageLabel: contentPageLabelInfo,
				query: 'UPDATE_CONTENT_PAGE_LABEL',
			});
		}
	}

	public static async deleteContentPageLabel(contentPageLabelId: number | null | undefined) {
		try {
			if (isNil(contentPageLabelId)) {
				throw new CustomError(
					'Failed to delete content page label since the id is nil',
					null,
					{
						contentPageLabelId,
					}
				);
			}
			const response = await dataService.query({
				query: this.queries.DeleteContentPageLabelByIdDocument,
				variables: {
					id: contentPageLabelId,
				},
			});
			if (response.errors) {
				throw new CustomError(
					'Failed to delete content page label from the database',
					null,
					{
						response,
						errors: response.errors,
					}
				);
			}
		} catch (err) {
			console.error(
				new CustomError('Failed to delete content page label from the database', err, {
					contentPageLabelId,
					query: 'DELETE_CONTENT_PAGE_LABEL',
				})
			);
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t(
					'modules/admin/content-page-labels/services/content-page-label___error'
				),
				description: Config.getConfig().services.i18n.t(
					'admin/content-page-labels/content-page-label___het-verwijderen-van-de-content-pagina-label-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	}

	static async getContentPageLabelsByTypeAndLabels(
		contentType: Avo.ContentPage.Type,
		labels: string[]
	): Promise<LabelObj[]> {
		try {
			const reply = await fetchWithLogout(
				`${publicRuntimeConfig.PROXY_URL}/content-pages/labels`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({
						contentType,
						labels,
					}),
				}
			);

			const labelObj = await reply.json();
			return labelObj;
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
		labelIds: number[]
	): Promise<LabelObj[]> {
		try {
			const reply = await fetchWithLogout(
				`${publicRuntimeConfig.PROXY_URL}/content-pages/labels`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({
						contentType,
						labelIds,
					}),
				}
			);

			const labelObj = await reply.json();
			return labelObj;
		} catch (err) {
			throw new CustomError(
				'Failed to get content page labels by content type and label ids',
				err,
				{
					contentType,
					labelIds,
				}
			);
		}
	}
}
