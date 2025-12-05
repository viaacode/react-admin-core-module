import type { SelectOption } from '@meemoo/react-components';
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
import { Avo } from '@viaa/avo2-types';
import { isNil } from 'es-toolkit';
import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { AdminConfigManager, ToastType } from '~core/config/index';
import { ContentPageLabelService } from '~modules/content-page-labels/content-page-label.service';
import { useGetAllLanguages } from '~modules/translations/hooks/use-get-all-languages';
import { Locale } from '~modules/translations/translations.core.types';
import { ContentPicker } from '~shared/components/ContentPicker/ContentPicker';
import { Icon } from '~shared/components/Icon/Icon';
import type { LoadingInfo } from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { LoadingErrorLoadedComponent } from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { GET_LANGUAGE_NAMES } from '~shared/consts/language-names';
import { CustomError } from '~shared/helpers/custom-error';
import { isMultiLanguageEnabled } from '~shared/helpers/is-multi-language-enabled';
import { buildLink, navigate } from '~shared/helpers/link';
import { navigateFunc } from '~shared/helpers/navigate-fnc';
import { showToast } from '~shared/helpers/show-toast';
import { tText } from '~shared/helpers/translation-functions';
import { AdminLayout } from '~shared/layouts/AdminLayout/AdminLayout';
import type { DefaultComponentProps } from '~shared/types/components';
import { useContentTypes } from '../../content-page/hooks/useContentTypes';
import type {
	ContentPageLabel,
	ContentPageLabelEditFormErrorState,
} from '../content-page-label.types';

type ContentPageLabelEditProps = {
	contentPageLabelId: string | undefined;
	onGoBack: () => void;
} & DefaultComponentProps;

export const ContentPageLabelEdit: FunctionComponent<ContentPageLabelEditProps> = ({
	contentPageLabelId,
	onGoBack,
	className,
}) => {
	// Hooks
	const [initialContentPageLabel, setInitialContentPageLabel] = useState<ContentPageLabel | null>(
		null
	);
	const [contentPageLabelInfo, setContentPageLabelInfo] = useState<ContentPageLabel | null>(null);

	const [formErrors, setFormErrors] = useState<ContentPageLabelEditFormErrorState>({});
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [contentTypes] = useContentTypes();
	const { data: allLanguages } = useGetAllLanguages();
	const languageOptions = (allLanguages || []).map((languageInfo): SelectOption => {
		return {
			label: GET_LANGUAGE_NAMES()[languageInfo.languageCode],
			value: languageInfo.languageCode,
		};
	});

	const isCreatePage = !contentPageLabelId;

	const initOrFetchContentPageLabel = useCallback(async () => {
		if (isCreatePage) {
			const contentLabel = {
				label: '',
				content_type: 'PAGINA',
				language: Locale.Nl,
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
					message: tText(
						'admin/content-page-labels/views/content-page-label-edit___het-ophalen-van-de-content-pagina-label-is-mislukt'
					),
				});
			}
		}
	}, [isCreatePage, contentPageLabelId]);

	useEffect(() => {
		initOrFetchContentPageLabel();
	}, [initOrFetchContentPageLabel]);

	useEffect(() => {
		if (contentPageLabelInfo) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [contentPageLabelInfo]);

	const navigateBack = () => {
		if (isCreatePage) {
			navigateFunc(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_OVERVIEW'));
		} else {
			navigate(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_DETAIL'), {
				id: contentPageLabelId,
			});
		}
	};

	const getFormErrors = (): ContentPageLabelEditFormErrorState | null => {
		if (!contentPageLabelInfo?.label) {
			return {
				label: tText(
					'admin/content-page-labels/views/content-page-label-edit___een-label-is-verplicht'
				),
			};
		}
		if (!contentPageLabelInfo?.language) {
			return {
				label: tText(
					'modules/content-page-labels/views/content-page-label-edit___een-taal-keuze-is-verplicht'
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
				showToast({
					title: 'error',
					description: tText(
						'admin/content-page-labels/views/content-page-label-edit___de-invoer-is-ongeldig'
					),
					type: ToastType.ERROR,
				});
				return;
			}

			if (!initialContentPageLabel || !contentPageLabelInfo) {
				showToast({
					title: 'error',
					description: tText(
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
				contentPageLabel = (
					await ContentPageLabelService.insertContentPageLabels([contentPageLabelInfo])
				)[0];
			} else {
				// Update existing content page label
				contentPageLabel =
					await ContentPageLabelService.updateContentPageLabel(contentPageLabelInfo);
			}

			showToast({
				title: tText('modules/content-page-labels/views/content-page-label-edit___succes'),
				description: tText(
					'admin/content-page-labels/views/content-page-label-edit___de-content-pagina-label-is-opgeslagen'
				),
				type: ToastType.SUCCESS,
			});
			navigateFunc(
				buildLink(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_DETAIL'), {
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
			showToast({
				title: 'error',
				description: tText(
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
									label={tText('admin/content-page-labels/views/content-page-label-edit___label')}
									error={formErrors.label}
									required
								>
									<TextInput
										value={contentPageLabelInfo.label || ''}
										onChange={(newLabel: string) =>
											setContentPageLabelInfo({
												...contentPageLabelInfo,
												label: newLabel,
											})
										}
									/>
								</FormGroup>
								<FormGroup
									label={tText(
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
												content_type: newContentType as Avo.ContentPage.Type,
											})
										}
									/>
								</FormGroup>
								{isMultiLanguageEnabled() && (
									<FormGroup
										label={tText(
											'modules/content-page-labels/views/content-page-label-edit___taal'
										)}
										error={formErrors.language}
										className="c-multilanguage-controls"
									>
										<Select
											options={languageOptions}
											value={contentPageLabelInfo.language}
											onChange={(newLanguage) =>
												setContentPageLabelInfo({
													...contentPageLabelInfo,
													language: newLanguage as Locale,
												})
											}
										/>
									</FormGroup>
								)}
								<FormGroup
									label={tText(
										'admin/content-page-labels/views/content-page-label-edit___link-naar'
									)}
									error={formErrors.link_to}
								>
									<ContentPicker
										allowedTypes={[
											Avo.Core.ContentPickerType.CONTENT_PAGE,
											Avo.Core.ContentPickerType.ITEM,
											Avo.Core.ContentPickerType.COLLECTION,
											Avo.Core.ContentPickerType.BUNDLE,
											Avo.Core.ContentPickerType.INTERNAL_LINK,
											Avo.Core.ContentPickerType.EXTERNAL_LINK,
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
														label: isNil(contentPageLabelInfo.link_to?.value)
															? undefined
															: String(contentPageLabelInfo.link_to?.value),
														type: contentPageLabelInfo.link_to?.type || 'CONTENT_PAGE',
														value: String(contentPageLabelInfo?.link_to?.value),
														target: contentPageLabelInfo?.link_to?.target,
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
					? tText(
							'admin/content-page-labels/views/content-page-label-edit___content-pagina-label-aanmaken'
						)
					: tText(
							'admin/content-page-labels/views/content-page-label-edit___content-pagina-label-aanpassen'
						)
			}
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
						label={tText('admin/content-page-labels/views/content-page-label-edit___annuleer')}
						onClick={navigateBack}
						type="secondary"
					/>
					<Button
						disabled={isSaving}
						label={tText('admin/content-page-labels/views/content-page-label-edit___opslaan')}
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
