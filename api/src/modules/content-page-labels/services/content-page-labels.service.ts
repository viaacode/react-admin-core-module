import { forwardRef, Inject } from '@nestjs/common';
import type { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { isNil, uniq } from 'lodash';
import type { ContentPageLabel, ContentPageType, LabelObj } from '../../content-pages';
import { DataService } from '../../data';
import {
	GetContentPageLabelTranslationsDocument,
	type GetContentPageLabelTranslationsQuery,
	type GetContentPageLabelTranslationsQueryVariables,
	type Lookup_Languages_Enum,
	UpdateContentPageLabelTranslationsDocument,
	type UpdateContentPageLabelTranslationsMutation,
	type UpdateContentPageLabelTranslationsMutationVariables,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { CustomError } from '../../shared/helpers/error';
import { getDatabaseType } from '../../shared/helpers/get-database-type';
import { isAvo } from '../../shared/helpers/is-avo';
import { isHetArchief } from '../../shared/helpers/is-hetarchief';
import type { Locale } from '../../translations';
import type {
	ContentPageLabelOverviewTableCols,
	HetArchiefContentPageLabel,
	HetArchiefContentPageLabelById,
} from '../content-page-labels.types';
import type {
	ContentPageLabelDto,
	InsertContentPageLabelDto,
	UpdateContentPageLabelDto,
} from '../dto/content-page-label.dto';
import {
	CONTENT_PAGE_LABEL_QUERIES,
	type ContentPageLabelQueryTypes,
} from '../queries/content-page-label.queries';

export class ContentPageLabelsService {
	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {}

	public async fetchContentPageLabels(
		offset: number,
		limit: number,
		sortColumn: ContentPageLabelOverviewTableCols,
		sortOrder: AvoSearchOrderDirection,
		// biome-ignore lint/suspicious/noExplicitAny: where can by complex object
		where: any
	): Promise<[ContentPageLabel[], number]> {
		let variables: ContentPageLabelQueryTypes['GetContentPageLabelsQueryVariables'] | null = null;
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
			>(CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()].GetContentPageLabelsDocument, variables);

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
					// Only hetarchief content page labels have a color and a link to their dutch version
					color: (labelObj as HetArchiefContentPageLabel)?.color,
					nl_parent_label_id: (labelObj as HetArchiefContentPageLabel)?.nl_parent_label_id,
					nl_parent_label: (labelObj as HetArchiefContentPageLabel)?.nl_parent_label,
					translated_labels: (labelObj as HetArchiefContentPageLabel)?.translated_labels,
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
				throw new CustomError('Response does not contain any content page labels', null, {
					response,
				});
			}

			return [contentPageLabels, contentPageLabelCount];
		} catch (err) {
			throw new CustomError('Failed to get content page labels from the database', err, {
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
				id: isAvo() ? parseInt(id, 10) : id,
			};
			const response = await this.dataService.execute<
				ContentPageLabelQueryTypes['GetContentPageLabelByIdQuery'],
				ContentPageLabelQueryTypes['GetContentPageLabelByIdQueryVariables']
			>(CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()].GetContentPageLabelByIdDocument, variables);

			/* istanbul ignore next */
			const contentPageLabelRaw =
				(response as ContentPageLabelQueryTypes['GetContentPageLabelByIdQueryAvo'])
					.app_content_labels?.[0] ||
				(response as ContentPageLabelQueryTypes['GetContentPageLabelByIdQueryHetArchief'])
					.app_content_label?.[0] ||
				null;

			if (!contentPageLabelRaw) {
				throw new CustomError('Response does not contain any content page labels', null, {
					response,
				});
			}
			return {
				label: contentPageLabelRaw.label,
				content_type: contentPageLabelRaw.content_type as ContentPageType,
				id: contentPageLabelRaw.id,
				language: contentPageLabelRaw.language,
				link_to: contentPageLabelRaw.link_to,
				// Only hetarchief content page labels have a color and a link to their dutch version
				color: (contentPageLabelRaw as HetArchiefContentPageLabelById).color,
				nl_parent_label_id: (contentPageLabelRaw as HetArchiefContentPageLabelById)
					.nl_parent_label_id,
				nl_parent_label: (contentPageLabelRaw as HetArchiefContentPageLabelById).nl_parent_label,
				translated_labels: (contentPageLabelRaw as HetArchiefContentPageLabelById)
					.translated_labels,
				created_at: contentPageLabelRaw.created_at,
				updated_at: contentPageLabelRaw.updated_at,
			};
		} catch (err) {
			throw new CustomError('Failed to get content page labels from the database', err, {
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
					// biome-ignore lint/suspicious/noExplicitAny: locale from other repo complains about types
					language: contentPageLabel.language as any,
					link_to: contentPageLabel.link_to || null,
					// The color and nl_parent_label_id columns only exist on hetarchief
					...(isHetArchief()
						? {
								color: contentPageLabel.color,
								nl_parent_label_id: contentPageLabel.nl_parent_label_id || null,
							}
						: {}),
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
				throw new CustomError(
					'Response from database does not contain the inserted content page labels',
					null,
					{ response }
				);
			}
			// Link the translations of the new dutch labels
			await Promise.all(
				contentPageLabels.map((contentPageLabel, index) =>
					this.updateTranslatedLabels(
						String(contentPageLabelsResponse[index]?.id),
						contentPageLabel.language,
						contentPageLabel.translated_label_ids
					)
				)
			);
			return contentPageLabelsResponse as ContentPageLabelDto[];
		} catch (err) {
			throw new CustomError('Failed to insert content page labels in the database', err, {
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
					// biome-ignore lint/suspicious/noExplicitAny: Differences in avo <-> hetarchief
					content_type: contentPageLabelInfo.content_type as any,
					language: contentPageLabelInfo.language,
					link_to: contentPageLabelInfo.link_to || null,
					// The color and nl_parent_label_id columns only exist on hetarchief
					...(isHetArchief()
						? {
								color: contentPageLabelInfo.color,
								nl_parent_label_id: contentPageLabelInfo.nl_parent_label_id || null,
							}
						: {}),
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
				throw new CustomError(
					'Response from database does not contain the id of the inserted content page label',
					null,
					{ response }
				);
			}
			await this.updateTranslatedLabels(
				contentPageLabelInfo.id,
				contentPageLabelInfo.language,
				contentPageLabelInfo.translated_label_ids
			);
			return contentPageLabelResponse as ContentPageLabelDto;
		} catch (err) {
			throw new CustomError('Failed to update content page label in the database', err, {
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
				id: isAvo() ? parseInt(id, 10) : id,
			});
		} catch (err) {
			throw new CustomError('Failed to delete content page label from the database', err, {
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
		>(CONTENT_PAGE_LABEL_QUERIES[getDatabaseType()].GetContentPageLabelsByTypeAndLabelsDocument, {
			contentType,
			labels,
		});

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
			// biome-ignore lint/suspicious/noExplicitAny: avo vs hetarchief number vs uuid
			labelIds: labelIds as any,
		});

		return (
			(response as ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndIdsQueryHetArchief'])
				.app_content_label ||
			(response as ContentPageLabelQueryTypes['GetContentPageLabelsByTypeAndIdsQueryAvo'])
				.app_content_labels ||
			[]
		);
	}

	/**
	 * Link the given labels in other languages to a dutch label and unlink its previous translations (ARC-4200)
	 * Only for dutch labels on hetarchief, undefined translatedLabelIds leaves the links unchanged
	 * @param nlLabelId
	 * @param language the language of the label with id nlLabelId
	 * @param translatedLabelIds
	 */
	private async updateTranslatedLabels(
		nlLabelId: string,
		language: Locale,
		translatedLabelIds: string[] | undefined
	): Promise<void> {
		if (!isHetArchief() || (language as string) !== 'nl' || !translatedLabelIds) {
			return;
		}
		try {
			await this.dataService.execute<
				UpdateContentPageLabelTranslationsMutation,
				UpdateContentPageLabelTranslationsMutationVariables
			>(UpdateContentPageLabelTranslationsDocument, {
				nlLabelId,
				translatedLabelIds: translatedLabelIds.filter((id) => !!id && id !== nlLabelId),
			});
		} catch (err) {
			throw new CustomError('Failed to update the translations of the content page label', err, {
				nlLabelId,
				translatedLabelIds,
				query: 'updateContentPageLabelTranslations',
			});
		}
	}

	/**
	 * Translate content page label values to another language, using the optional link between a label and its dutch version (ARC-4200)
	 * eg: ['Achter de schermen'] from nl to en => ['Behind the scenes']
	 * Labels without a linked translation in the target language are left out,
	 * so the page overview shows all items in the new language instead of items in the old language
	 * Only hetarchief has links between labels, avo always returns an empty list
	 * @param labels label values in the fromLanguage
	 * @param fromLanguage
	 * @param toLanguage
	 */
	public async translateContentPageLabels(
		labels: string[],
		fromLanguage: Locale,
		toLanguage: Locale
	): Promise<string[]> {
		if (!labels.length || !isHetArchief()) {
			return [];
		}
		if (fromLanguage === toLanguage) {
			return labels;
		}
		try {
			const response = await this.dataService.execute<
				GetContentPageLabelTranslationsQuery,
				GetContentPageLabelTranslationsQueryVariables
			>(GetContentPageLabelTranslationsDocument, {
				labels,
				language: fromLanguage as unknown as Lookup_Languages_Enum,
			});

			const translatedLabels = (response.app_content_label || []).flatMap((labelObj) => {
				// A dutch label is linked from its translations, another language links to its dutch parent label
				const candidates = [
					...(labelObj.translated_labels || []),
					...(labelObj.nl_parent_label ? [labelObj.nl_parent_label] : []),
					...(labelObj.nl_parent_label?.translated_labels || []),
				];
				return candidates
					.filter((candidate) => (candidate.language as string) === (toLanguage as string))
					.map((candidate) => candidate.label);
			});
			return uniq(translatedLabels);
		} catch (err) {
			throw new CustomError('Failed to translate content page labels', err, {
				labels,
				fromLanguage,
				toLanguage,
				query: 'getContentPageLabelTranslations',
			});
		}
	}
}
