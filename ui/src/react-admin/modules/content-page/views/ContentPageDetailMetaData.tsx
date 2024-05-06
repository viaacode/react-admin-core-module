import {
	Container,
	Spacer,
	Table,
	TagInfo,
	TagList,
	TagOption,
	Thumbnail,
} from '@viaa/avo2-components';
import { isAfter, isBefore, parseISO } from 'date-fns';
import { compact, get } from 'lodash-es';
import React, { FunctionComponent } from 'react';
import { BlockHeading } from '~content-blocks/BlockHeading/BlockHeading';
import { AdminConfigManager } from '~core/config';

import { GET_CONTENT_PAGE_WIDTH_OPTIONS } from '~modules/content-page/const/content-page.consts';
import { useContentTypes } from '~modules/content-page/hooks/useContentTypes';
import { getContentPageDescriptionHtml } from '~modules/content-page/services/content-page.converters';
import { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { useGetAllLanguages } from '~modules/translations/hooks/use-get-all-languages';
import Html from '~shared/components/Html/Html';
import { Link } from '~shared/components/Link';
import { formatDate, formatDateString } from '~shared/helpers/formatters/date';
import { buildLink } from '~shared/helpers/link';
import {
	renderDateDetailRows,
	renderDetailRow,
	renderSimpleDetailRows,
} from '~shared/helpers/render-detail-fields';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import { UserGroup } from '~modules/user-group/types/user-group.types';

interface ContentDetailMetaDataProps {
	contentPageInfo: ContentPageInfo;
}

export const ContentPageDetailMetaData: FunctionComponent<ContentDetailMetaDataProps> = ({
	contentPageInfo,
}) => {
	const [contentTypes] = useContentTypes();
	const { data: languages } = useGetAllLanguages();
	const [allUserGroupOptions] = useUserGroupOptions('TagInfo', true, false) as [
		TagInfo[],
		UserGroup[],
		boolean,
	];

	// Methods
	const getUserGroups = (contentPageInfo: ContentPageInfo): TagOption[] => {
		const tagInfos: TagInfo[] = compact(
			(contentPageInfo.userGroupIds || []).map((userGroupId: string): TagInfo | undefined => {
				return allUserGroupOptions.find(
					(userGroup: TagInfo) => userGroup.value === userGroupId
				);
			})
		);

		const tagOptions = tagInfos.map(
			(ug: TagInfo): TagOption => ({
				id: ug.value,
				label: ug.label,
			})
		);

		if (tagOptions && tagOptions.length) {
			return tagOptions;
		}

		return [
			{
				id: -3,
				label: tText('admin/menu/components/menu-edit-form/menu-edit-form___niemand'),
			},
		];
	};

	const getContentPageWidthLabel = (contentPageInfo: ContentPageInfo): string => {
		return get(
			GET_CONTENT_PAGE_WIDTH_OPTIONS().find(
				(option) => option.value === contentPageInfo.contentWidth
			),
			'label',
			'-'
		);
	};

	const definePublishedAt = (contentPageInfo: ContentPageInfo) => {
		const { publishedAt, publishAt, depublishAt } = contentPageInfo;

		if (publishedAt) {
			return formatDate(publishedAt);
		}

		if (
			publishAt &&
			depublishAt &&
			isAfter(new Date(), parseISO(publishAt)) &&
			isBefore(new Date(), parseISO(depublishAt))
		) {
			return formatDate(publishAt);
		}

		if (!depublishAt && publishAt && isAfter(new Date(), parseISO(publishAt))) {
			return formatDate(publishAt);
		}

		if (!publishAt && depublishAt && isBefore(new Date(), parseISO(depublishAt))) {
			return tHtml('admin/content/views/content-detail-meta-data___ja');
		}

		return tHtml('admin/content/views/content-detail-meta-data___nee');
	};
	const description = getContentPageDescriptionHtml(contentPageInfo, SanitizePreset.full);
	return (
		<Container mode="vertical" size="small">
			<Container mode="horizontal">
				{!!description && (
					<Spacer margin="bottom-large">
						<BlockHeading type="h4">
							{tHtml('admin/content/views/content-detail___omschrijving')}
						</BlockHeading>
						<Html content={description || '-'} sanitizePreset={SanitizePreset.full} />
					</Spacer>
				)}

				<Table horizontal variant="invisible" className="c-table_detail-page">
					<tbody>
						{renderDetailRow(
							<div style={{ width: '400px' }}>
								<Thumbnail
									category="item"
									src={contentPageInfo.thumbnailPath || undefined}
								/>
							</div>,
							tText('admin/content/views/content-detail___cover-afbeelding')
						)}
						{renderSimpleDetailRows<ContentPageInfo>(contentPageInfo, [
							['title', tText('admin/content/views/content-detail___titel')],
						])}
						{renderDetailRow(
							description || '-',
							tText('admin/content/views/content-detail___beschrijving')
						)}
						{renderSimpleDetailRows<ContentPageInfo>(contentPageInfo, [
							[
								'seoDescription',
								tText(
									'admin/content/views/content-detail-meta-data___seo-beschrijving'
								),
							],
							[
								'metaDescription',
								tText(
									'admin/content/views/content-detail-meta-data___beschrijving-voor-export-bv-klaar-nieuwsbrief'
								),
							],
							['path', tText('admin/content/views/content-detail___pad')],
							[
								'isProtected',
								tText('admin/content/views/content-detail___beschermde-pagina'),
							],
						])}
						{renderDetailRow(
							get(
								contentTypes.find(
									(type) => type.value === contentPageInfo.contentType
								),
								'label'
							) || '-',
							tText('admin/content/views/content-detail___content-type')
						)}
						{renderDetailRow(
							getContentPageWidthLabel(contentPageInfo),
							tText('admin/content/views/content-detail___breedte')
						)}
						{renderDetailRow(
							contentPageInfo.owner?.fullName || '-',
							tText('admin/content/views/content-detail___auteur')
						)}
						{renderDetailRow(
							contentPageInfo?.owner?.groupName || '-',
							tText('admin/content/views/content-detail___auteur-rol')
						)}
						{renderDateDetailRows<ContentPageInfo>(contentPageInfo, [
							['createdAt', tText('admin/content/views/content-detail___aangemaakt')],
							[
								'updatedAt',
								tText('admin/content/views/content-detail___laatst-bewerkt'),
							],
						])}
						{renderDetailRow(
							<p>{definePublishedAt(contentPageInfo)}</p>,
							tText('admin/content/views/content-detail___gepubliceerd')
						)}
						{renderDetailRow(
							<p>
								{formatDateString(contentPageInfo.publishAt) ||
									tText('admin/content/views/content-detail-meta-data___n-v-t')}
							</p>,
							tText(
								'admin/content/views/content-detail-meta-data___wordt-gepubliceerd-op'
							)
						)}
						{renderDetailRow(
							<p>
								{formatDateString(contentPageInfo.depublishAt) ||
									tText('admin/content/views/content-detail-meta-data___n-v-t')}
							</p>,
							tText(
								'admin/content/views/content-detail-meta-data___wordt-gedepubliceerd-op'
							)
						)}
						{renderDetailRow(
							<p>
								{languages?.find(
									(language) => language.languageCode === contentPageInfo.language
								)?.languageLabel || '-'}
							</p>,
							tText('Taal')
						)}
						{renderDetailRow(
							contentPageInfo.nlParentPageId ? (
								<p>
									<Link
										to={buildLink(
											AdminConfigManager.getAdminRoute(
												'ADMIN_CONTENT_PAGE_DETAIL'
											),
											{ id: contentPageInfo.nlParentPageId }
										)}
										title={tText('Bekijk de nederlandse hoofd pagina')}
									>
										{contentPageInfo.translatedPages?.find(
											(translatedPage) =>
												translatedPage.id === contentPageInfo.nlParentPageId
										)?.title || '-'}
									</Link>
								</p>
							) : (
								<p>-</p>
							),
							tText('Nederlandstalige hoofd pagina')
						)}
						{renderDetailRow(
							contentPageInfo.translatedPages.length
								? contentPageInfo.translatedPages?.map((translatedPage) => {
										return (
											<p>
												<Link
													className="c-table_detail-page__translated-pages__link"
													to={buildLink(
														AdminConfigManager.getAdminRoute(
															'ADMIN_CONTENT_PAGE_DETAIL'
														),
														{ id: translatedPage.id }
													)}
													title={
														tText('Bekijk vertaalde pagina') +
														' ' +
														translatedPage.language
													}
												>
													<span className="c-table_detail-page__translated-pages__language">
														{translatedPage.language + ': '}
													</span>
													<span className="c-table_detail-page__translated-pages__title">
														{translatedPage.title}
													</span>
													<span className="c-table_detail-page__translations__path">
														{'/' +
															translatedPage.language.toLowerCase() +
															translatedPage.path}
													</span>
												</Link>
											</p>
										);
								  })
								: '-',
							tText('Vertaalde versies')
						)}
						{renderDetailRow(
							<TagList
								swatches={false}
								selectable={false}
								closable={false}
								tags={getUserGroups(contentPageInfo)}
							/>,
							tText('admin/content/views/content-detail___toegankelijk-voor')
						)}
						{renderDetailRow(
							<TagList
								swatches={false}
								selectable={false}
								closable={false}
								tags={contentPageInfo.labels
									.filter((labelObj) => labelObj.label && labelObj.id)
									.map((labelObj) => ({
										label: labelObj.label as string,
										id: String(labelObj.id),
									}))}
							/>,
							tText('admin/content/views/content-detail___labels')
						)}
					</tbody>
				</Table>
			</Container>
		</Container>
	);
};
