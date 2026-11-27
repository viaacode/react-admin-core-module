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
import {
	type AvoContentPageType,
	AvoCoreContentPickerType,
	AvoSearchOrderDirection,
} from '@viaa/avo2-types';
import { groupBy, isNil } from 'es-toolkit';
import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { AdminConfigManager, ToastType } from '~core/config';
import { AdminCoreIconName } from '~core/config/config.types';
import { ColorSelect } from '~modules/content-page/components/fields/ColorSelect/ColorSelect';
import { GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF } from '~modules/content-page/const/get-color-options';
import type {
	CustomBackground,
	GradientColor,
} from '~modules/content-page/types/content-block.types';
import { Color } from '~modules/content-page/types/content-block.types';
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
import { isHetArchief } from '~shared/helpers/is-hetarchief';
import { navigateFunc } from '~shared/helpers/navigate-fnc';
import { buildLink, navigate } from '~shared/helpers/routing/link';
import { showToast } from '~shared/helpers/show-toast';
import { tText } from '~shared/helpers/translation-functions';
import { AdminLayout } from '~shared/layouts/AdminLayout/AdminLayout';
import type { DefaultComponentProps } from '~shared/types/components';
import { App } from '../../../../../scripts/translation.types';
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

	// Avo has no language specific labels, so it does not enable multi language
	const showLanguageFields = isMultiLanguageEnabled();
	const isDutchLabel = contentPageLabelInfo?.language === Locale.Nl;
	const otherLanguages: Locale[] = (allLanguages || [])
		.map((languageInfo) => languageInfo.languageCode as Locale)
		.filter((languageCode) => languageCode !== Locale.Nl);

	// Links between labels in different languages (ARC-4200), used to translate the label filter in the url
	// when the user switches the language of the website
	// - a dutch label shows a picker per other language with the labels that link to it
	// - a label in another language shows a picker with its dutch version
	const [labelOptionsByLanguage, setLabelOptionsByLanguage] = useState<
		Partial<Record<Locale, ContentPageLabel[]>>
	>({});

	useEffect(() => {
		if (
			!showLanguageFields ||
			!contentPageLabelInfo?.content_type ||
			!contentPageLabelInfo?.language
		) {
			setLabelOptionsByLanguage({});
			return;
		}
		ContentPageLabelService.fetchContentPageLabels(
			0,
			'label',
			AvoSearchOrderDirection.ASC,
			{
				language: isDutchLabel ? { _neq: Locale.Nl } : { _eq: Locale.Nl },
				content_type: { _eq: contentPageLabelInfo.content_type },
			},
			1000
		)
			.then(([labels]) => {
				setLabelOptionsByLanguage(groupBy(labels, (label) => label.language));
			})
			.catch((err) => {
				console.error(
					new CustomError('Failed to get the content page labels in the other languages', err, {
						contentType: contentPageLabelInfo.content_type,
						isDutchLabel,
					})
				);
			});
	}, [
		showLanguageFields,
		isDutchLabel,
		contentPageLabelInfo?.content_type,
		contentPageLabelInfo?.language,
	]);

	const getLanguageVersionLabel = (language: Locale): string => {
		if (language === Locale.Nl) {
			return tText(
				'modules/content-page-labels/views/content-page-label-edit___nederlandse-versie',
				{},
				[App.HET_ARCHIEF]
			);
		}
		if (language === Locale.En) {
			return tText(
				'modules/content-page-labels/views/content-page-label-edit___engelse-versie',
				{},
				[App.HET_ARCHIEF]
			);
		}
		return GET_LANGUAGE_NAMES()[language] || String(language).toUpperCase();
	};

	const getLanguageVersionOptions = (language: Locale): SelectOption[] => [
		{
			label: tText(
				'modules/content-page-labels/views/content-page-label-edit___geen-vertaling',
				{},
				[App.HET_ARCHIEF]
			),
			value: '',
		},
		...(labelOptionsByLanguage[language] || []).map((label): SelectOption => {
			// Mention when an english label is already linked to another dutch label, selecting it moves the link
			const linkedToOtherLabel =
				isDutchLabel &&
				!!label.nl_parent_label_id &&
				label.nl_parent_label_id !== String(contentPageLabelInfo?.id);
			return {
				label: linkedToOtherLabel
					? tText(
							'modules/content-page-labels/views/content-page-label-edit___label-gekoppeld-aan-ander-label',
							{ label: label.label, otherLabel: label.nl_parent_label?.label || '' },
							[App.HET_ARCHIEF]
						)
					: label.label,
				value: String(label.id),
			};
		}),
	];

	const handleTranslatedLabelChange = (language: Locale, newLabelId: string | null) => {
		if (!contentPageLabelInfo) {
			return;
		}
		const newLabel = (labelOptionsByLanguage[language] || []).find(
			(label) => String(label.id) === newLabelId
		);
		setContentPageLabelInfo({
			...contentPageLabelInfo,
			translated_labels: [
				...(contentPageLabelInfo.translated_labels || []).filter(
					(translatedLabel) => translatedLabel.language !== language
				),
				...(newLabel
					? [{ id: newLabel.id, label: newLabel.label, language: newLabel.language }]
					: []),
			],
		});
	};

	const initOrFetchContentPageLabel = useCallback(async () => {
		if (isCreatePage) {
			const contentLabel = {
				label: '',
				content_type: 'PAGINA',
				language: Locale.Nl,
				...(isHetArchief()
					? { color: Color.White, nl_parent_label_id: null, translated_labels: [] }
					: {}),
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
	}, [contentPageLabelId, isCreatePage]);

	useEffect(() => {
		initOrFetchContentPageLabel();
	}, [initOrFetchContentPageLabel]);

	useEffect(() => {
		if (contentPageLabelInfo) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [contentPageLabelInfo]);

	// ITEM, COLLECTION and BUNDLE only exist in the avo database, hetarchief has ie-objects instead
	const getLinkToAllowedTypes = (): AvoCoreContentPickerType[] => [
		AvoCoreContentPickerType.CONTENT_PAGE,
		...(isHetArchief()
			? [AvoCoreContentPickerType.IE_OBJECT]
			: [
					AvoCoreContentPickerType.ITEM,
					AvoCoreContentPickerType.COLLECTION,
					AvoCoreContentPickerType.BUNDLE,
				]),
		AvoCoreContentPickerType.INTERNAL_LINK,
		AvoCoreContentPickerType.EXTERNAL_LINK,
	];

	const navigateBack = async () => {
		if (isCreatePage) {
			await navigateFunc(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_OVERVIEW'));
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
			await navigateFunc(
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
											content_type: newContentType as AvoContentPageType,
											// Translations have to be labels of the same content type
											nl_parent_label_id: null,
											translated_labels: [],
										})
									}
								/>
							</FormGroup>
							{showLanguageFields && (
								<FormGroup
									label={tText('modules/content-page-labels/views/content-page-label-edit___taal')}
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
												// A dutch label has translations, a label in another language has a dutch version
												nl_parent_label_id: null,
												translated_labels: [],
											})
										}
									/>
								</FormGroup>
							)}
							{showLanguageFields && !isDutchLabel && (
								<FormGroup
									label={getLanguageVersionLabel(Locale.Nl)}
									className="c-multilanguage-controls"
								>
									<Select
										options={getLanguageVersionOptions(Locale.Nl)}
										value={contentPageLabelInfo.nl_parent_label_id || ''}
										onChange={(newNlParentLabelId) =>
											setContentPageLabelInfo({
												...contentPageLabelInfo,
												nl_parent_label_id: newNlParentLabelId || null,
											})
										}
									/>
								</FormGroup>
							)}
							{showLanguageFields &&
								isDutchLabel &&
								otherLanguages.map((language) => (
									<FormGroup
										key={`translated-label-${language}`}
										label={getLanguageVersionLabel(language)}
										className="c-multilanguage-controls"
									>
										<Select
											options={getLanguageVersionOptions(language)}
											value={String(
												(contentPageLabelInfo.translated_labels || []).find(
													(translatedLabel) => translatedLabel.language === language
												)?.id || ''
											)}
											onChange={(newLabelId) => handleTranslatedLabelChange(language, newLabelId)}
										/>
									</FormGroup>
								))}
							{isHetArchief() && (
								<FormGroup
									label={tText(
										'modules/content-page-labels/views/content-page-label-edit___achtergrondkleur',
										{},
										[App.HET_ARCHIEF]
									)}
									required
								>
									<ColorSelect
										options={GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()}
										value={GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF().find(
											(option) => option.value === contentPageLabelInfo.color
										)}
										onChange={(newColor) =>
											setContentPageLabelInfo({
												...contentPageLabelInfo,
												color: (
													newColor as { value: Color | GradientColor | CustomBackground } | null
												)?.value,
											})
										}
									/>
								</FormGroup>
							)}
							<FormGroup
								label={tText('admin/content-page-labels/views/content-page-label-edit___link-naar')}
								error={formErrors.link_to}
							>
								<ContentPicker
									allowedTypes={getLinkToAllowedTypes()}
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
					<Icon name={AdminCoreIconName.ChevronLeft} />
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
		<LoadingErrorLoadedComponent
			loadingInfo={loadingInfo}
			dataObject={contentPageLabelInfo}
			render={renderPage}
			locationId="content-page-label-edit"
		/>
	);
};
