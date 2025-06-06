import { forwardRef, Inject } from '@nestjs/common';
import type { Avo } from '@viaa/avo2-types';
import { isNil } from 'lodash';

import { ContentPageLabel, ContentPageType, LabelObj } from '../../content-pages';
import { DataService } from '../../data';
import { customError } from '../../shared/helpers/custom-error';
import { getDatabaseType } from '../../shared/helpers/get-database-type';
import { isAvo } from '../../shared/helpers/is-avo';
import { ContentPageLabelOverviewTableCols } from '../content-page-labels.types';
import {
	ContentPageLabelDto,
	InsertContentPageLabelDto,
	UpdateContentPageLabelDto,
} from '../dto/content-page-label.dto';
import {
	CONTENT_PAGE_LABEL_QUERIES,
	ContentPageLabelQueryTypes,
} from '../queries/content-page-label.queries';

export class ContentPageLabelsService {
	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {}

	public async fetchContentPageLabels(
		offset: number,
		limit: number,
		sortColumn: ContentPageLabelOverviewTableCols,
		sortOrder: Avo.Search.OrderDirection,
		where: any
	): Promise<[ContentPageLabel[], number]> {
		let variables: ContentPageLabelQueryTypes['GetContentPageLabelsQueryVariables'] | null =
			null;
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
				CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()].GetContentPageLabelsDocument,
				variables
			);

			/* istanbul ignore next */
			const contentPageLabels: ContentPageLabel[] = (
				(response as ContentPageLabelQueryTypes['GetContentPageLabelsQueryAvo'])
					.app_content_labels ||
				(response as ContentPageLabelQueryTypes['GetContentPageLabelsQueryHetArchief'])
					.app_content_label ||
				[]
			).map(
				(labelObj): ContentPageLabel => ({
					label: labelObj?.label,
					content_type: labelObj?.content_type as ContentPageType,
					id: labelObj?.id,
					language: labelObj?.language,
					link_to: labelObj?.link_to,
					created_at: labelObj?.created_at,
					updated_at: labelObj?.updated_at,
				})
			);
			const contentPageLabelCount: number =
				(response as ContentPageLabelQueryTypes['GetContentPageLabelsQueryAvo'])
					.app_content_labels_aggregate?.aggregate?.count ||
				(response as ContentPageLabelQueryTypes['GetContentPageLabelsQueryHetArchief'])
					.app_content_label_aggregate?.aggregate?.count ||
				0;

			if (!contentPageLabels) {
				throw customError('Response does not contain any content page labels', null, {
					response,
				});
			}

			return [contentPageLabels, contentPageLabelCount];
		} catch (err: any) {
			throw customError('Failed to get content page labels from the database', err, {
				variables,
				query: 'GET_CONTENT_PAGE_LABELS',
			});
		}
	}

	public async fetchContentPageLabelById(id: string): Promise<ContentPageLabel> {
		let variables: ContentPageLabelQueryTypes['GetContentPageLabelByIdQueryVariables'] | null =
			null;
		try {
			variables = {
				id: isAvo() ? parseInt(id) : id,
			};
			const response = await this.dataService.execute<
				ContentPageLabelQueryTypes['GetContentPageLabelByIdQuery'],
				ContentPageLabelQueryTypes['GetContentPageLabelByIdQueryVariables']
			>(
				CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()].GetContentPageLabelByIdDocument,
				variables
			);

			/* istanbul ignore next */
			const contentPageLabelRaw =
				(response as ContentPageLabelQueryTypes['GetContentPageLabelByIdQueryAvo'])
					.app_content_labels?.[0] ||
				(response as ContentPageLabelQueryTypes['GetContentPageLabelByIdQueryHetArchief'])
					.app_content_label?.[0] ||
				null;

			if (!contentPageLabelRaw) {
				throw customError('Response does not contain any content page labels', null, {
					response,
				});
			}
			return {
				label: contentPageLabelRaw.label,
				content_type: contentPageLabelRaw.content_type as ContentPageType,
				id: contentPageLabelRaw.id,
				language: contentPageLabelRaw.language,
				link_to: contentPageLabelRaw.link_to,
				created_at: contentPageLabelRaw.created_at,
				updated_at: contentPageLabelRaw.updated_at,
			};
		} catch (err: any) {
			throw customError('Failed to get content page labels from the database', err, {
				variables,
				query: 'GET_CONTENT_PAGE_LABELS',
			});
		}
	}

	public async insertContentPageLabels(
		contentPageLabels: InsertContentPageLabelDto[]
	): Promise<ContentPageLabelDto[]> {
		try {
			const response = await this.dataService.execute<
				ContentPageLabelQueryTypes['InsertContentPageLabelMutation'],
				ContentPageLabelQueryTypes['InsertContentPageLabelMutationVariables']
			>(CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()].InsertContentPageLabelDocument, {
				contentPageLabels: contentPageLabels.map((contentPageLabel) => ({
					label: contentPageLabel.label,
					content_type: contentPageLabel.content_type,
					language: contentPageLabel.language as any,
					link_to: contentPageLabel.link_to || null,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				})),
			});
			const contentPageLabelsResponse =
				(response as ContentPageLabelQueryTypes['InsertContentPageLabelMutationAvo'])
					.insert_app_content_labels?.returning ||
				(response as ContentPageLabelQueryTypes['InsertContentPageLabelMutationHetArchief'])
					.insert_app_content_label?.returning;
			if (isNil(contentPageLabelsResponse)) {
				throw customError(
					'Response from database does not contain the inserted content page labels',
					null,
					{ response }
				);
			}
			return contentPageLabelsResponse as ContentPageLabelDto[];
		} catch (err: any) {
			throw customError('Failed to insert content page labels in the database', err, {
				contentPageLabels,
				query: 'InsertContentPageLabel',
			});
		}
	}

	async updateContentPageLabel(
		contentPageLabelInfo: UpdateContentPageLabelDto
	): Promise<ContentPageLabelDto> {
		try {
			const response = await this.dataService.execute<
				ContentPageLabelQueryTypes['UpdateContentPageLabelMutation'],
				ContentPageLabelQueryTypes['UpdateContentPageLabelMutationVariables']
			>(CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()].UpdateContentPageLabelDocument, {
				contentPageLabel: {
					label: contentPageLabelInfo.label,
					content_type: contentPageLabelInfo.content_type as any, // Differences in avo <-> hetarchief
					language: contentPageLabelInfo.language,
					link_to: contentPageLabelInfo.link_to || null,
					updated_at: new Date().toISOString(),
				},
				contentPageLabelId: contentPageLabelInfo.id,
			});
			const contentPageLabelResponse =
				(response as ContentPageLabelQueryTypes['UpdateContentPageLabelMutationAvo'])
					.update_app_content_labels?.returning?.[0] ||
				(response as ContentPageLabelQueryTypes['UpdateContentPageLabelMutationHetArchief'])
					.update_app_content_label?.returning?.[0];
			if (isNil(contentPageLabelResponse)) {
				throw customError(
					'Response from database does not contain the id of the inserted content page label',
					null,
					{ response }
				);
			}
			return contentPageLabelResponse as ContentPageLabelDto;
		} catch (err: any) {
			throw customError('Failed to update content page label in the database', err, {
				contentPageLabel: contentPageLabelInfo,
				query: 'UPDATE_CONTENT_PAGE_LABEL',
			});
		}
	}

	async deleteContentPageLabel(id: string) {
		try {
			await this.dataService.execute<
				ContentPageLabelQueryTypes['DeleteContentPageLabelByIdMutation'],
				ContentPageLabelQueryTypes['DeleteContentPageLabelByIdMutationVariables']
			>(CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()].DeleteContentPageLabelByIdDocument, {
				id: isAvo() ? parseInt(id) : id,
			});
		} catch (err: any) {
			throw customError('Failed to delete content page label from the database', err, {
				query: 'DeleteContentPageLabelByIdMutation',
				id,
			});
		}
	}

	public async getContentPageLabelsByTypeAndLabels(
		contentType: string,
		labels: string[]
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
			}
		);

		const responseAvo =
			response as ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndLabelsQueryAvo'];
		const responseHetArchief =
			response as ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndLabelsQueryHetArchief'];

		return responseAvo.app_content_labels || responseHetArchief.app_content_label || [];
	}

	public async getContentPageLabelsByTypeAndIds(
		contentType: string,
		labelIds: (string | number)[]
	): Promise<LabelObj[]> {
		if (!labelIds.length) {
			return [];
		}
		const response = await this.dataService.execute<
			ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndIdsQuery'],
			ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndIdsQueryVariables']
		>(CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()].GetContentPageLabelsByTypeAndIdsDocument, {
			contentType,
			labelIds: labelIds as any,
		});

		return (
			(
				response as ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndIdsQueryHetArchief']
			).app_content_label ||
			(response as ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndIdsQueryAvo'])
				.app_content_labels ||
			[]
		);
	}
}
