import { Button } from '@meemoo/react-components';
import { ButtonToolbar, IconName, Table } from '@viaa/avo2-components';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { AdminConfigManager } from '~core/config';
import { ContentPageLabelService } from '~modules/content-page-labels/content-page-label.service';
import { Icon } from '~shared/components';

import { GET_CONTENT_TYPE_LABELS } from '~shared/components/ContentPicker/ContentPicker.const';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from '~shared/helpers/custom-error';
import { buildLink, navigate, navigateToContentType } from '~shared/helpers/link';
import {
	renderDateDetailRows,
	renderDetailRow,
	renderSimpleDetailRows,
} from '~shared/helpers/render-detail-fields';
import { AdminLayout } from '~shared/layouts';
import { ContentPageLabel } from '../content-page-label.types';

type ContentPageLabelDetailProps = { contentPageLabelId: string };

const ContentPageLabelDetail: FunctionComponent<ContentPageLabelDetailProps> = ({
	contentPageLabelId,
}) => {
	// Hooks
	const history = AdminConfigManager.getConfig().services.router.useHistory();
	const [contentPageLabelInfo, setContentPageLabelInfo] = useState<ContentPageLabel | null>(null);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });

	const initOrFetchContentPageLabel = useCallback(async () => {
		try {
			const contentPageLabelObj = await ContentPageLabelService.fetchContentPageLabel(
				contentPageLabelId
			);

			if (!contentPageLabelObj) {
				setLoadingInfo({
					state: 'error',
					icon: IconName.search,
					message: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-page-labels/views/content-page-label-detail___deze-content-pagina-label-werd-niet-gevonden'
					),
				});
				return;
			}

			const contentLabel = {
				id: contentPageLabelObj.id,
				label: contentPageLabelObj.label,
				content_type: contentPageLabelObj.content_type,
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
				message: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-page-labels/views/content-page-label-detail___het-ophalen-van-de-content-pagina-label-is-mislukt'
				),
			});
		}
	}, [setLoadingInfo, setContentPageLabelInfo, contentPageLabelId]);

	useEffect(() => {
		initOrFetchContentPageLabel();
	}, [initOrFetchContentPageLabel]);

	useEffect(() => {
		if (contentPageLabelInfo) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [contentPageLabelInfo, setLoadingInfo]);

	const handleEditClick = () => {
		history.push(
			buildLink(AdminConfigManager.getAdminRoute('CONTENT_PAGE_LABEL_EDIT'), {
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
								AdminConfigManager.getConfig().services.i18n.tText(
									'admin/content-page-labels/views/content-page-label-detail___label'
								),
							],
							[
								'content_type',
								AdminConfigManager.getConfig().services.i18n.tText(
									'admin/content-page-labels/views/content-page-label-detail___type'
								),
							],
						])}
						{renderDetailRow(
							linkTo ? (
								<Button
									variants={['text', 'neutral']}
									onClick={() => navigateToContentType(linkTo, history)}
								>{`${labels[linkTo.type]} - ${decodeURIComponent(
									String(linkTo.value)?.split('hetarchief.be')?.pop() || ''
								)}`}</Button>
							) : (
								'-'
							),
							AdminConfigManager.getConfig().services.i18n.tText(
								'admin/content-page-labels/views/content-page-label-detail___link'
							)
						)}
						{renderDateDetailRows(contentPageLabelInfo, [
							[
								'created_at',
								AdminConfigManager.getConfig().services.i18n.tText(
									'admin/content-page-labels/views/content-page-label-detail___aangemaakt-op'
								),
							],
							[
								'updated_at',
								AdminConfigManager.getConfig().services.i18n.tText(
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
				pageTitle={AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-page-labels/views/content-page-label-detail___content-pagina-label-details'
				)}
			>
				<AdminLayout.Back>
					<Button
						icon={<Icon name="chevronLeft" />}
						onClick={() =>
							navigate(
								history,
								AdminConfigManager.getAdminRoute('CONTENT_PAGE_LABEL_OVERVIEW')
							)
						}
						variants={['block', 'text']}
					/>
				</AdminLayout.Back>
				<AdminLayout.Actions>
					<ButtonToolbar>
						<Button
							variants={['block', 'black']}
							label={AdminConfigManager.getConfig().services.i18n.tText(
								'admin/content-page-labels/views/content-page-label-detail___bewerken'
							)}
							title={AdminConfigManager.getConfig().services.i18n.tText(
								'admin/content-page-labels/views/content-page-label-detail___bewerk-deze-content-pagina-label'
							)}
							aria-label={AdminConfigManager.getConfig().services.i18n.tText(
								'admin/content-page-labels/views/content-page-label-detail___bewerk-deze-content-pagina-label'
							)}
							onClick={handleEditClick}
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

export default ContentPageLabelDetail;