import {
	Box,
	Button,
	ButtonToolbar,
	Container,
	Form,
	FormGroup,
	Select,
	Spacer,
	TextInput,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { isNil } from 'lodash-es';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { AdminConfigManager, ToastType } from '~core/config';
import { ContentPageLabelService } from '~modules/content-page-labels/content-page-label.service';
import { Icon } from '~shared/components';
import { ContentPicker } from '~shared/components/ContentPicker/ContentPicker';
import { Link } from '~shared/components/Link';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from '~shared/helpers/custom-error';
import { buildLink, navigate } from '~shared/helpers/link';
import { AdminLayout } from '~shared/layouts';
import { DefaultComponentProps } from '~shared/types/components';

import { useContentTypes } from '../../content-page/hooks/useContentTypes';

import { ContentPageLabel, ContentPageLabelEditFormErrorState } from '../content-page-label.types';

type ContentPageLabelEditProps = { contentPageLabelId: string | undefined } & DefaultComponentProps;

const ContentPageLabelEdit: FunctionComponent<ContentPageLabelEditProps> = ({
	contentPageLabelId,
	className,
}) => {
	// Hooks
	const history = AdminConfigManager.getConfig().services.router.useHistory();
	const [initialContentPageLabel, setInitialContentPageLabel] = useState<ContentPageLabel | null>(
		null
	);
	const [contentPageLabelInfo, setContentPageLabelInfo] = useState<ContentPageLabel | null>(null);

	const [formErrors, setFormErrors] = useState<ContentPageLabelEditFormErrorState>({});
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [contentTypes] = useContentTypes();

	const isCreatePage = !contentPageLabelId;

	const initOrFetchContentPageLabel = useCallback(async () => {
		if (isCreatePage) {
			const contentLabel = {
				label: '',
				content_type: 'PAGINA',
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				permissions: [],
			} as unknown as ContentPageLabel;
			setInitialContentPageLabel(contentLabel);
			setContentPageLabelInfo(contentLabel);
		} else {
			try {
				const contentLabel =
					await ContentPageLabelService.fetchContentPageLabel(contentPageLabelId);
				setInitialContentPageLabel(contentLabel);
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
						'admin/content-page-labels/views/content-page-label-edit___het-ophalen-van-de-content-pagina-label-is-mislukt'
					),
				});
			}
		}
	}, [isCreatePage, contentPageLabelId, setLoadingInfo, setContentPageLabelInfo]);

	useEffect(() => {
		initOrFetchContentPageLabel();
	}, [initOrFetchContentPageLabel]);

	useEffect(() => {
		if (contentPageLabelInfo) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [contentPageLabelInfo, setLoadingInfo]);

	const navigateBack = () => {
		if (isCreatePage) {
			history.push(AdminConfigManager.getAdminRoute('CONTENT_PAGE_LABEL_OVERVIEW'));
		} else {
			navigate(history, AdminConfigManager.getAdminRoute('CONTENT_PAGE_LABEL_DETAIL'), {
				id: contentPageLabelId,
			});
		}
	};

	const getFormErrors = (): ContentPageLabelEditFormErrorState | null => {
		if (!contentPageLabelInfo || !contentPageLabelInfo.label) {
			return {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-page-labels/views/content-page-label-edit___een-label-is-verplicht'
				),
			};
		}
		return null;
	};

	const handleSave = async () => {
		try {
			const errors = getFormErrors();
			setFormErrors(errors || {});
			if (errors) {
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: 'error',
					description: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-page-labels/views/content-page-label-edit___de-invoer-is-ongeldig'
					),
					type: ToastType.ERROR,
				});
				return;
			}

			if (!initialContentPageLabel || !contentPageLabelInfo) {
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: 'error',
					description: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-page-labels/views/content-page-label-edit___het-opslaan-van-het-content-pagina-label-is-mislukt-omdat-het-label-nog-niet-is-geladen'
					),
					type: ToastType.ERROR,
				});
				return;
			}

			setIsSaving(true);

			let contentPageLabel: ContentPageLabel;
			if (isCreatePage) {
				// insert the content page label
				contentPageLabel =
					await ContentPageLabelService.insertContentPageLabel(contentPageLabelInfo);
			} else {
				// Update existing content page label
				contentPageLabel =
					await ContentPageLabelService.updateContentPageLabel(contentPageLabelInfo);
			}

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: 'succes',
				description: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-page-labels/views/content-page-label-edit___de-content-pagina-label-is-opgeslagen'
				),
				type: ToastType.SUCCESS,
			});
			history.push(
				buildLink(AdminConfigManager.getAdminRoute('CONTENT_PAGE_LABEL_DETAIL'), {
					id: contentPageLabel.id,
				})
			);
		} catch (err) {
			console.error(
				new CustomError('Failed to save content page label', err, {
					contentPageLabelInfo,
					initialContentPageLabel,
				})
			);
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: 'error',
				description: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-page-labels/views/content-page-label-edit___het-opslaan-van-het-pagina-label-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
		setIsSaving(false);
	};

	const renderEditPage = () => {
		if (!contentPageLabelInfo) {
			return;
		}
		return (
			<>
				<Container size="medium">
					<Spacer margin="bottom-extra-large">
						<Box backgroundColor="gray">
							<Form>
								<FormGroup
									label={AdminConfigManager.getConfig().services.i18n.tText(
										'admin/content-page-labels/views/content-page-label-edit___label'
									)}
									error={formErrors.label}
									required
								>
									<TextInput
										value={contentPageLabelInfo.label || ''}
										onChange={(newLabel) =>
											setContentPageLabelInfo({
												...contentPageLabelInfo,
												label: newLabel,
											})
										}
									/>
								</FormGroup>
								<FormGroup
									label={AdminConfigManager.getConfig().services.i18n.tText(
										'admin/content-page-labels/views/content-page-label-edit___content-pagina-type'
									)}
									error={formErrors.content_type}
								>
									<Select
										options={contentTypes}
										value={contentPageLabelInfo.content_type}
										onChange={(newContentType) =>
											setContentPageLabelInfo({
												...contentPageLabelInfo,
												content_type:
													newContentType as Avo.ContentPage.Type,
											})
										}
									/>
								</FormGroup>
								<FormGroup
									label={AdminConfigManager.getConfig().services.i18n.tText(
										'admin/content-page-labels/views/content-page-label-edit___link-naar'
									)}
									error={formErrors.link_to}
								>
									<ContentPicker
										allowedTypes={[
											'CONTENT_PAGE',
											'ITEM',
											'COLLECTION',
											'BUNDLE',
											'INTERNAL_LINK',
											'EXTERNAL_LINK',
										]}
										onChange={(newLinkTo) =>
											setContentPageLabelInfo({
												...contentPageLabelInfo,
												link_to: newLinkTo,
											})
										}
										value={
											contentPageLabelInfo?.link_to?.value
												? {
														label: isNil(
															contentPageLabelInfo.link_to?.value
														)
															? undefined
															: String(
																	contentPageLabelInfo.link_to
																		?.value
															  ),
														type:
															contentPageLabelInfo.link_to?.type ||
															'CONTENT_PAGE',
														value: String(
															contentPageLabelInfo?.link_to?.value
														),
														target: contentPageLabelInfo?.link_to
															?.target,
												  }
												: undefined
										}
									/>
								</FormGroup>
							</Form>
						</Box>
					</Spacer>
				</Container>
			</>
		);
	};

	// Render
	const renderPage = () => (
		<AdminLayout
			pageTitle={
				isCreatePage
					? AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-page-labels/views/content-page-label-edit___content-pagina-label-aanmaken'
					  )
					: AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-page-labels/views/content-page-label-edit___content-pagina-label-aanpassen'
					  )
			}
			className={className}
		>
			<AdminLayout.Back>
				<Link to={AdminConfigManager.getAdminRoute('CONTENT_PAGE_LABEL_OVERVIEW')}>
					<Button type="borderless">
						<Icon name="chevronLeft"></Icon>
					</Button>
				</Link>
			</AdminLayout.Back>
			<AdminLayout.Actions>
				<ButtonToolbar>
					<Button
						label={AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-page-labels/views/content-page-label-edit___annuleer'
						)}
						onClick={navigateBack}
						type="secondary"
					/>
					<Button
						disabled={isSaving}
						label={AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-page-labels/views/content-page-label-edit___opslaan'
						)}
						onClick={handleSave}
						type="primary"
					/>
				</ButtonToolbar>
			</AdminLayout.Actions>
			<AdminLayout.Content>{renderEditPage()}</AdminLayout.Content>
		</AdminLayout>
	);

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

export default ContentPageLabelEdit;
