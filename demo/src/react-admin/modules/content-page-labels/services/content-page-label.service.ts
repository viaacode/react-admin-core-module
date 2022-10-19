import { LabelObj } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { ContentPageTypeSchema } from '@viaa/avo2-types/types/content-page';
import { compact, isNil } from 'lodash-es';
import { GetContentPageLabelsQuery as GetContentPageLabelsQueryAvo } from '~generated/graphql-db-types-avo';
import { GetContentPageLabelsQuery as GetContentPageLabelsQueryHetArchief } from '~generated/graphql-db-types-hetarchief';

import { CustomError } from '../../shared/helpers/custom-error';
import { fetchWithLogout } from '../../shared/helpers/fetch-with-logout';
import { dataService } from '../../shared/services/data-service';
import { ITEMS_PER_PAGE } from '../content-page-label.const';
import { ContentPageLabel, ContentPageLabelOverviewTableCols } from '../content-page-label.types';
import {
	CONTENT_PAGE_LABEL_QUERIES,
	ContentPageLabelQueryTypes,
} from '../queries/content-page-label.queries';

import { AdminConfigManager } from '~core/config';

export class ContentPageLabelService {
	private static getQueries() {
		return CONTENT_PAGE_LABEL_QUERIES[
			AdminConfigManager.getConfig().database.databaseApplicationType
		];
	}

	public static async fetchContentPageLabels(
		page: number,
		sortColumn: ContentPageLabelOverviewTableCols,
		sortOrder: Avo.Search.OrderDirection,
		where: any,
		itemsPerPage: number = ITEMS_PER_PAGE
	): Promise<[ContentPageLabel[], number]> {
		let variables: ContentPageLabelQueryTypes['GetContentPageLabelsQueryVariables'] | null =
			null;
		try {
			variables = {
				where,
				offset: itemsPerPage * page,
				limit: itemsPerPage,
				orderBy: [{ [sortColumn]: sortOrder }],
			};
			const response = await dataService.query<
				ContentPageLabelQueryTypes['GetContentPageLabelsQuery'],
				ContentPageLabelQueryTypes['GetContentPageLabelsQueryVariables']
			>({
				query: this.getQueries().GetContentPageLabelsDocument,
				variables,
			});

			/* istanbul ignore next */
			const contentPageLabel: ContentPageLabel[] = (
				(response as GetContentPageLabelsQueryAvo)?.app_content_labels ||
				(response as GetContentPageLabelsQueryHetArchief)?.app_content_label ||
				[]
			).map(
				(labelObj): ContentPageLabel => ({
					label: labelObj?.label,
					content_type: labelObj?.content_type as ContentPageTypeSchema,
					id: labelObj?.id,
					link_to: labelObj?.link_to,
					created_at: labelObj?.created_at,
					updated_at: labelObj?.updated_at,
				})
			);
			const contentPageLabelCount: number =
				(response as GetContentPageLabelsQueryAvo)?.app_content_labels_aggregate?.aggregate
					?.count ||
				(response as GetContentPageLabelsQueryHetArchief)?.app_content_label_aggregate
					?.aggregate?.count ||
				0;

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

	public static async insertContentPageLabel(
		contentPageLabel: ContentPageLabel
	): Promise<number> {
		try {
			const response = await dataService.query<
				ContentPageLabelQueryTypes['InsertContentPageLabelMutation'],
				ContentPageLabelQueryTypes['InsertContentPageLabelMutationVariables']
			>({
				query: this.getQueries().InsertContentPageLabelDocument,
				variables: {
					contentPageLabel: {
						label: contentPageLabel.label,
						content_type: contentPageLabel.content_type,
					} as Partial<ContentPageLabel>,
				},
			});
			const contentPageLabelId =
				(response as ContentPageLabelQueryTypes['InsertContentPageLabelMutationAvo'])
					.insert_app_content_labels?.returning?.[0]?.id ||
				(response as ContentPageLabelQueryTypes['InsertContentPageLabelMutationHetArchief'])
					.insert_app_content_label?.returning?.[0]?.id;
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
			await dataService.query<
				ContentPageLabelQueryTypes['UpdateContentPageLabelMutation'],
				ContentPageLabelQueryTypes['UpdateContentPageLabelMutationVariables']
			>({
				query: this.getQueries().UpdateContentPageLabelDocument,
				variables: {
					contentPageLabel: {
						label: contentPageLabelInfo.label,
						content_type: contentPageLabelInfo.content_type,
						link_to: contentPageLabelInfo.link_to,
					} as Partial<ContentPageLabel>,
					contentPageLabelId: contentPageLabelInfo.id,
				},
			});
		} catch (err) {
			throw new CustomError('Failed to update content page label in the database', err, {
				contentPageLabel: contentPageLabelInfo,
				query: 'UPDATE_CONTENT_PAGE_LABEL',
			});
		}
	}

	static async getContentPageLabelsByTypeAndLabels(
		contentType: Avo.ContentPage.Type,
		labels: string[]
	): Promise<LabelObj[]> {
		try {
			const reply = await fetchWithLogout(
				`${AdminConfigManager.getConfig().database.proxyUrl}/admin/content-pages/labels`,
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

			return await reply.json();
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
				`${AdminConfigManager.getConfig().database.proxyUrl}/admin/content-pages/labels`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({
						contentType,
						labelIds: compact(labelIds),
					}),
				}
			);

			return await reply.json();
		} catch (err) {
			throw new CustomError(
				'Failed to get content page labels by content type and label ids',
				err,
				{
					contentType,
					labelIds: compact(labelIds),
				}
			);
		}
	}
}
