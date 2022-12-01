import { compact, get } from 'lodash-es';
import moment from 'moment';
import React, { FunctionComponent } from 'react';

import {
	BlockHeading,
	Container,
	Spacer,
	Table,
	TagInfo,
	TagList,
	TagOption,
	Thumbnail,
} from '@viaa/avo2-components';
import { GET_CONTENT_PAGE_WIDTH_OPTIONS } from '~modules/content-page/const/content-page.consts';
import { useContentTypes } from '~modules/content-page/hooks/useContentTypes';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import Html from '~modules/shared/components/Html/Html';
import { formatDate } from '~modules/shared/helpers/formatters/date';
import {
	renderDateDetailRows,
	renderDetailRow,
	renderSimpleDetailRows,
} from '~modules/shared/helpers/render-detail-fields';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';

interface ContentDetailMetaDataProps {
	contentPageInfo: ContentPageInfo;
}

export const ContentPageDetailMetaData: FunctionComponent<ContentDetailMetaDataProps> = ({
	contentPageInfo,
}) => {
	const { tHtml, tText } = useTranslation();

	const [contentTypes] = useContentTypes();
	const [allUserGroupOptions] = useUserGroupOptions('TagInfo', true) as [TagInfo[], boolean];

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
			moment().isBetween(moment(publishAt), moment(depublishAt))
		) {
			return formatDate(publishAt);
		}

		if (!depublishAt && publishAt && moment().isAfter(moment(publishAt))) {
			return formatDate(publishAt);
		}

		if (!publishAt && depublishAt && moment().isBefore(moment(depublishAt))) {
			return tHtml('admin/content/views/content-detail-meta-data___ja');
		}

		return tHtml('admin/content/views/content-detail-meta-data___nee');
	};
	const description = ContentPageService.getDescription(contentPageInfo, 'full');
	return (
		<Container mode="vertical" size="small">
			<Container mode="horizontal">
				{!!description && (
					<Spacer margin="bottom-large">
						<BlockHeading type="h4">
							{tHtml('admin/content/views/content-detail___omschrijving')}
						</BlockHeading>
						<Html content={description || '-'} sanitizePreset="full" />
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
						{renderSimpleDetailRows(contentPageInfo, [
							['title', tText('admin/content/views/content-detail___titel')],
						])}
						{renderDetailRow(
							description || '-',
							tText('admin/content/views/content-detail___beschrijving')
						)}
						{renderSimpleDetailRows(contentPageInfo, [
							[
								'seo_description',
								tText(
									'admin/content/views/content-detail-meta-data___seo-beschrijving'
								),
							],
							[
								'meta_description',
								tText(
									'admin/content/views/content-detail-meta-data___beschrijving-voor-export-bv-klaar-nieuwsbrief'
								),
							],
							['path', tText('admin/content/views/content-detail___pad')],
							[
								'is_protected',
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
						{renderDateDetailRows(contentPageInfo, [
							[
								'created_at',
								tText('admin/content/views/content-detail___aangemaakt'),
							],
							[
								'updated_at',
								tText('admin/content/views/content-detail___laatst-bewerkt'),
							],
						])}
						{renderDetailRow(
							<p>{definePublishedAt(contentPageInfo)}</p>,
							tText('admin/content/views/content-detail___gepubliceerd')
						)}
						{renderDetailRow(
							<p>
								{formatDate(contentPageInfo.publishAt) ||
									tText('admin/content/views/content-detail-meta-data___n-v-t')}
							</p>,
							tText(
								'admin/content/views/content-detail-meta-data___wordt-gepubliceerd-op'
							)
						)}
						{renderDetailRow(
							<p>
								{formatDate(contentPageInfo.depublishAt) ||
									tText('admin/content/views/content-detail-meta-data___n-v-t')}
							</p>,
							tText(
								'admin/content/views/content-detail-meta-data___wordt-gedepubliceerd-op'
							)
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
