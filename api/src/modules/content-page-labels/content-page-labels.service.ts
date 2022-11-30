import { forwardRef, Inject } from '@nestjs/common';
import { Avo } from '@viaa/avo2-types';
import { isNil } from 'lodash';
import { ContentPageLabel, ContentPageType, LabelObj } from '../content-pages';
import { DataService } from '../data';
import { CustomError } from '../shared/helpers/custom-error';
import { getDatabaseType } from '../shared/helpers/get-database-type';
import { ContentPageLabelOverviewTableCols } from './content-page-labels.types';
import {
	CONTENT_PAGE_LABEL_QUERIES,
	ContentPageLabelQueryTypes,
} from './queries/content-page-label.queries';

export class ContentPageLabelsService {
	constructor(
		@Inject(forwardRef(() => DataService)) protected dataService: DataService,
	) {}

	public async fetchContentPageLabels(
		offset: number,
		limit: number,
		sortColumn: ContentPageLabelOverviewTableCols,
		sortOrder: Avo.Search.OrderDirection,
		where: any,
	): Promise<[ContentPageLabel[], number]> {
		let variables:
			| ContentPageLabelQueryTypes['GetContentPageLabelsQueryVariables']
			| null = null;
		try {
			variables = {
				where,
				offset,
				limit,
				orderBy: [{ [sortColumn]: sortOrder }],
			};
			const response = await this.dataService.execute<
				ContentPageLabelQueryTypes['GetContentPageLabelsQuery'],
				ContentPageLabelQueryTypes['GetContentPageLabelsQueryVariables']
			>(
				CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()]
					.GetContentPageLabelsDocument,
				variables,
			);

			/* istanbul ignore next */
			const contentPageLabel: ContentPageLabel[] = (
				(response as ContentPageLabelQueryTypes['GetContentPageLabelsQueryAvo'])
					.app_content_labels ||
				(
					response as ContentPageLabelQueryTypes['GetContentPageLabelsQueryHetArchief']
				).app_content_label ||
				[]
			).map(
				(labelObj): ContentPageLabel => ({
					label: labelObj?.label,
					content_type: labelObj?.content_type as ContentPageType,
					id: labelObj?.id,
					link_to: labelObj?.link_to,
					created_at: labelObj?.created_at,
					updated_at: labelObj?.updated_at,
				}),
			);
			const contentPageLabelCount: number =
				(response as ContentPageLabelQueryTypes['GetContentPageLabelsQueryAvo'])
					.app_content_labels_aggregate?.aggregate?.count ||
				(
					response as ContentPageLabelQueryTypes['GetContentPageLabelsQueryHetArchief']
				).app_content_label_aggregate?.aggregate?.count ||
				0;

			if (!contentPageLabel) {
				throw CustomError(
					'Response does not contain any content page labels',
					null,
					{
						response,
					},
				);
			}

			return [contentPageLabel, contentPageLabelCount];
		} catch (err) {
			throw CustomError(
				'Failed to get content page labels from the database',
				err,
				{
					variables,
					query: 'GET_CONTENT_PAGE_LABELS',
				},
			);
		}
	}

	public async insertContentPageLabel(
		contentPageLabel: ContentPageLabel,
	): Promise<number> {
		try {
			const response = await this.dataService.execute<
				ContentPageLabelQueryTypes['InsertContentPageLabelMutation'],
				ContentPageLabelQueryTypes['InsertContentPageLabelMutationVariables']
			>(
				CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()]
					.InsertContentPageLabelDocument,
				{
					contentPageLabel: {
						label: contentPageLabel.label,
						content_type: contentPageLabel.content_type,
					} as Partial<ContentPageLabel>,
				},
			);
			const contentPageLabelId =
				(
					response as ContentPageLabelQueryTypes['InsertContentPageLabelMutationAvo']
				).insert_app_content_labels?.returning?.[0]?.id ||
				(
					response as ContentPageLabelQueryTypes['InsertContentPageLabelMutationHetArchief']
				).insert_app_content_label?.returning?.[0]?.id;
			if (isNil(contentPageLabelId)) {
				throw CustomError(
					'Response from database does not contain the id of the inserted content page label',
					null,
					{ response },
				);
			}
			return contentPageLabelId;
		} catch (err) {
			throw CustomError(
				'Failed to insert content page label in the database',
				err,
				{
					contentPageLabel,
					query: 'INSERT_CONTENT_PAGE_LABEL',
				},
			);
		}
	}

	async updateContentPageLabel(contentPageLabelInfo: ContentPageLabel) {
		try {
			await this.dataService.execute<
				ContentPageLabelQueryTypes['UpdateContentPageLabelMutation'],
				ContentPageLabelQueryTypes['UpdateContentPageLabelMutationVariables']
			>(
				CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()]
					.UpdateContentPageLabelDocument,
				{
					contentPageLabel: {
						label: contentPageLabelInfo.label,
						content_type: contentPageLabelInfo.content_type,
						link_to: contentPageLabelInfo.link_to,
					} as Partial<ContentPageLabel>,
					contentPageLabelId: contentPageLabelInfo.id,
				},
			);
		} catch (err) {
			throw CustomError(
				'Failed to update content page label in the database',
				err,
				{
					contentPageLabel: contentPageLabelInfo,
					query: 'UPDATE_CONTENT_PAGE_LABEL',
				},
			);
		}
	}

	public async getContentPageLabelsByTypeAndLabels(
		contentType: string,
		labels: string[],
	): Promise<LabelObj[]> {
		const response = await this.dataService.execute<
			ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndLabelsQuery'],
			ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndLabelsQueryVariables']
		>(
			CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()]
				.GetContentPageLabelsByTypeAndLabelsDocument,
			{
				contentType,
				labels,
			},
		);

		const responseAvo =
			response as ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndLabelsQueryAvo'];
		const responseHetArchief =
			response as ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndLabelsQueryHetArchief'];

		return (
			responseAvo.app_content_labels ||
			responseHetArchief.app_content_label ||
			[]
		);
	}

	public async getContentPageLabelsByTypeAndIds(
		contentType: string,
		labelIds: (string | number)[],
	): Promise<LabelObj[]> {
		if (!labelIds.length) {
			return [];
		}
		const response = await this.dataService.execute<
			ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndIdsQuery'],
			ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndIdsQueryVariables']
		>(
			CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()]
				.GetContentPageLabelsByTypeAndIdsDocument,
			{
				contentType,
				labelIds: labelIds as any,
			},
		);

		return (
			(
				response as ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndIdsQueryHetArchief']
			).app_content_label ||
			(
				response as ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndIdsQueryAvo']
			).app_content_labels ||
			[]
		);
	}
}
