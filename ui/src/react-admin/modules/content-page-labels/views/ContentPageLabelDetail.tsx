import { Button, ButtonToolbar, IconName, Table } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { AdminConfigManager } from '~core/config';
import { ContentPageLabelService } from '~modules/content-page-labels/content-page-label.service';
import type { DefaultComponentProps } from '~modules/shared/types';
import { Icon } from '~shared/components/Icon';

import { GET_CONTENT_TYPE_LABELS } from '~shared/components/ContentPicker/ContentPicker.const';
import type { LoadingInfo } from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { LoadingErrorLoadedComponent } from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from '~shared/helpers/custom-error';
import { isMultiLanguageEnabled } from '~shared/helpers/is-multi-language-enabled';
import { buildLink, navigateToContentType } from '~shared/helpers/link';
import {
	renderDateDetailRows,
	renderDetailRow,
	renderSimpleDetailRows,
} from '~shared/helpers/render-detail-fields';
import { tText } from '~shared/helpers/translation-functions';
import { AdminLayout } from '~shared/layouts';
import type { ContentPageLabel } from '../content-page-label.types';

type ContentPageLabelDetailProps = {
	contentPageLabelId: string;
	onGoBack: () => void;
} & DefaultComponentProps;

export const ContentPageLabelDetail: FunctionComponent<ContentPageLabelDetailProps> = ({
	contentPageLabelId,
	onGoBack,
	className,
}) => {
	// Hooks
	const history = AdminConfigManager.getConfig().services.router.useHistory();
	const [contentPageLabelInfo, setContentPageLabelInfo] = useState<ContentPageLabel | null>(null);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });

	const initOrFetchContentPageLabel = useCallback(async () => {
		try {
			const contentPageLabelObj =
				await ContentPageLabelService.fetchContentPageLabel(contentPageLabelId);

			if (!contentPageLabelObj) {
				setLoadingInfo({
					state: 'error',
					icon: IconName.search,
					message: tText(
						'admin/content-page-labels/views/content-page-label-detail___deze-content-pagina-label-werd-niet-gevonden'
					),
				});
				return;
			}

			const contentLabel = {
				id: contentPageLabelObj.id,
				label: contentPageLabelObj.label,
				content_type: contentPageLabelObj.content_type,
				language: contentPageLabelObj.language,
				link_to: contentPageLabelObj.link_to,
				created_at: contentPageLabelObj.created_at,
				updated_at: contentPageLabelObj.updated_at,
			};
			setContentPageLabelInfo(contentLabel);
		} catch (err) {
			console.error(
				new CustomError('Failed to get content page label by id', err, {
					query: 'GET_CONTENT_PAGE_LABEL_BY_ID',
					variables: { id: contentPageLabelId },
				})
			);
			setLoadingInfo({
				state: 'error',
				message: tText(
					'admin/content-page-labels/views/content-page-label-detail___het-ophalen-van-de-content-pagina-label-is-mislukt'
				),
			});
		}
	}, [contentPageLabelId]);

	useEffect(() => {
		initOrFetchContentPageLabel();
	}, [initOrFetchContentPageLabel]);

	useEffect(() => {
		if (contentPageLabelInfo) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [contentPageLabelInfo]);

	const handleEditClick = () => {
		history.push(
			buildLink(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_EDIT'), {
				id: contentPageLabelId,
			})
		);
	};

	const renderDetailPage = () => {
		if (!contentPageLabelInfo) {
			return;
		}

		const linkTo = contentPageLabelInfo.link_to;
		const labels = GET_CONTENT_TYPE_LABELS();

		return (
			<>
				<Table horizontal variant="invisible" className="c-table_detail-page">
					<tbody>
						{renderSimpleDetailRows(contentPageLabelInfo, [
							[
								'label',
								tText(
									'admin/content-page-labels/views/content-page-label-detail___label'
								),
							],
							[
								'content_type',
								tText(
									'admin/content-page-labels/views/content-page-label-detail___type'
								),
							],
						])}
						{renderDetailRow(
							contentPageLabelInfo.language,
							tText(
								'modules/content-page-labels/views/content-page-label-detail___taal'
							),
							isMultiLanguageEnabled()
						)}
						{renderDetailRow(
							linkTo ? (
								<Button
									type="tertiary"
									onClick={() => navigateToContentType(linkTo, history)}
								>{`${labels[linkTo.type]} - ${decodeURIComponent(
									String(linkTo.value)?.split('hetarchief.be')?.pop() || ''
								)}`}</Button>
							) : (
								'-'
							),
							tText(
								'admin/content-page-labels/views/content-page-label-detail___link'
							)
						)}
						{renderDateDetailRows(contentPageLabelInfo, [
							[
								'created_at',
								tText(
									'admin/content-page-labels/views/content-page-label-detail___aangemaakt-op'
								),
							],
							[
								'updated_at',
								tText(
									'admin/content-page-labels/views/content-page-label-detail___aangepast-op'
								),
							],
						])}
					</tbody>
				</Table>
			</>
		);
	};

	// Render
	const renderPage = () => {
		if (!contentPageLabelInfo) {
			return null;
		}
		return (
			<AdminLayout
				pageTitle={tText(
					'admin/content-page-labels/views/content-page-label-detail___content-pagina-label-details'
				)}
				className={className}
			>
				<AdminLayout.Back>
					<Button type="borderless" onClick={onGoBack}>
						<Icon name="chevronLeft"></Icon>
					</Button>
				</AdminLayout.Back>
				<AdminLayout.Actions>
					<ButtonToolbar>
						<Button
							label={tText(
								'admin/content-page-labels/views/content-page-label-detail___bewerken'
							)}
							title={tText(
								'admin/content-page-labels/views/content-page-label-detail___bewerk-deze-content-pagina-label'
							)}
							ariaLabel={tText(
								'admin/content-page-labels/views/content-page-label-detail___bewerk-deze-content-pagina-label'
							)}
							onClick={handleEditClick}
							type="primary"
						/>
					</ButtonToolbar>
				</AdminLayout.Actions>
				<AdminLayout.Content>{renderDetailPage()}</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			<LoadingErrorLoadedComponent
				loadingInfo={loadingInfo}
				dataObject={contentPageLabelInfo}
				render={renderPage}
			/>
		</>
	);
};
