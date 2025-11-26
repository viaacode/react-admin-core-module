import type { RichEditorState } from '@meemoo/react-components';
import type { SelectOption, TagInfo } from '@viaa/avo2-components';
import {
	Checkbox,
	Column,
	Container,
	Form,
	FormGroup,
	Grid,
	Select,
	TagsInput,
	TextArea,
	TextInput,
} from '@viaa/avo2-components';
import { Avo, PermissionName } from '@viaa/avo2-types';
import { compact, isNil, noop } from 'es-toolkit';
import React, { type FunctionComponent, useCallback, useEffect, useState } from 'react';

import { ToastType } from '~core/config/config.types';
import {
	CONTENT_PAGE_SEO_DESCRIPTION_MAX_LENGTH_STRING,
	DEFAULT_PAGES_WIDTH,
	GET_CONTENT_PAGE_WIDTH_OPTIONS,
} from '~modules/content-page/const/content-page.consts';
import type { ContentEditAction } from '~modules/content-page/helpers/content-edit.reducer';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import type {
	ContentEditFormErrors,
	ContentPageInfo,
	ContentPageLabel,
	ContentPageWidth,
} from '~modules/content-page/types/content-pages.types';
import { ContentEditActionType } from '~modules/content-page/types/content-pages.types';
import { useGetAllLanguages } from '~modules/translations/hooks/use-get-all-languages';
import type { LanguageInfo } from '~modules/translations/translations.types';
import { ContentPicker } from '~shared/components/ContentPicker/ContentPicker';
import FileUpload from '~shared/components/FileUpload/FileUpload';
import { UserGroupSelect } from '~shared/components/UserGroupSelect/UserGroupSelect';
import { GET_LANGUAGE_NAMES } from '~shared/consts/language-names';
import { isMultiLanguageEnabled } from '~shared/helpers/is-multi-language-enabled';
import { showToast } from '~shared/helpers/show-toast';
import { tText } from '~shared/helpers/translation-functions';
import type { PickerItem } from '~shared/types/content-picker';
import type { ValueOf } from '~shared/types/index';

import './ContentEditForm.scss';
import { ContentPageEditFormDescription } from '~modules/content-page/components/ContentPageEditFormDescription/ContentPageEditFormDescription';
import { getAllSubgroupIds } from '~modules/user-group/const/user-group.const';
import { useGetUserGroups } from '~modules/user-group/hooks/get-user-groups';
import { SpecialUserGroups } from '~shared/types/authentication.types';

interface ContentEditFormProps {
	contentTypes: SelectOption<Avo.ContentPage.Type>[];
	formErrors: ContentEditFormErrors;
	contentPageInfo: Omit<ContentPageInfo, 'id'> & { id?: string | number };
	changeContentPageState: (action: ContentEditAction) => void;
	commonUser: Avo.User.CommonUser;
}

export const ContentEditForm: FunctionComponent<ContentEditFormProps> = ({
	contentTypes = [],
	formErrors,
	contentPageInfo,
	changeContentPageState,
	commonUser,
}) => {
	// Hooks
	const [contentTypeLabels, setContentTypeLabels] = useState<ContentPageLabel[]>([]);
	const { data: allLanguages } = useGetAllLanguages();
	const allLanguageOptions = (allLanguages || []).map(
		(languageInfo: LanguageInfo): SelectOption<string> => ({
			label: GET_LANGUAGE_NAMES()[languageInfo.languageCode],
			value: languageInfo.languageCode,
		})
	);
	const { data: allUserGroups, isLoading: isLoadingAllUserGroups } = useGetUserGroups({
		withPermissions: false,
	});

	const getParentPagePickerItem = (): PickerItem | null => {
		if (contentPageInfo.nlParentPageId) {
			const parentPageInfo = contentPageInfo.translatedPages.find(
				(p) => p.id === contentPageInfo.nlParentPageId
			);
			if (!parentPageInfo) {
				return null;
			}
			return {
				label: parentPageInfo.title,
				value: String(parentPageInfo.id),
				type: Avo.Core.ContentPickerType.CONTENT_PAGE,
				target: undefined,
			};
		}
		return null;
	};

	const changeContentPageProp = useCallback(
		(
			propName: keyof ContentPageInfo | 'description_state',
			propValue: ValueOf<ContentPageInfo> | RichEditorState | string
		) =>
			changeContentPageState({
				type: ContentEditActionType.SET_CONTENT_PAGE_PROP,
				payload: { propName, propValue },
			}),
		[changeContentPageState]
	);

	const changeContentPageType = useCallback(() => {
		// Set fixed content width for specific page types
		Object.keys(DEFAULT_PAGES_WIDTH).forEach((key) => {
			if (
				contentPageInfo.contentType &&
				DEFAULT_PAGES_WIDTH[key as ContentPageWidth].includes(contentPageInfo.contentType)
			) {
				changeContentPageProp('contentWidth', key);
			}
		});
	}, [changeContentPageProp, contentPageInfo.contentType]);

	useEffect(() => {
		if (!contentPageInfo.contentType) {
			return;
		}
		changeContentPageType();
		ContentPageService.fetchLabelsByContentType(contentPageInfo.contentType)
			.then(setContentTypeLabels)
			// biome-ignore lint/suspicious/noExplicitAny: todo
			.catch((err: any) => {
				console.error('Failed to fetch content labels by content type', err, {
					contentType: contentPageInfo.contentType,
				});
				showToast({
					title: tText(
						'modules/admin/content-page/components/content-edit-form/content-edit-form___error'
					),
					description: tText(
						'admin/content/components/content-edit-form/content-edit-form___het-ophalen-van-de-content-labels-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			});
	}, [contentPageInfo.contentType, changeContentPageType]);

	// Computed
	const contentTypeOptions = [
		{
			label: tText(
				'admin/content/components/content-edit-form/content-edit-form___kies-een-content-type'
			),
			value: '',
			disabled: true,
		},
		...contentTypes,
	];

	// Methods
	const handleContentTypeChange = (value: string) => {
		changeContentPageProp('contentType', value);
		changeContentPageProp('labels', []);
	};

	const mapLabelsToTags = (contentLabels: ContentPageLabel[]): TagInfo[] => {
		return (contentLabels || []).map((contentLabel) => ({
			label: contentLabel.label as string,
			value: String(contentLabel.id as number),
		}));
	};

	const mapTagsToLabels = (
		tags: TagInfo[],
		contentType: Avo.ContentPage.Type | undefined
	): Partial<ContentPageLabel>[] => {
		return (tags || []).map(
			(tag): Partial<ContentPageLabel> => ({
				label: tag.label,
				id: tag.value as number,
				content_type: contentType as Avo.ContentPage.Type,
			})
		);
	};

	// Render
	const owner: PickerItem | undefined = {
		label: contentPageInfo.owner?.fullName,
		type: Avo.Core.ContentPickerType.PROFILE,
		value: contentPageInfo.owner?.id,
	};
	const lastUserGroup = allUserGroups?.at(-1);
	const defaultOptionSelection = lastUserGroup
		? contentPageInfo.id
			? [lastUserGroup.id]
			: [
					SpecialUserGroups.loggedInUsers,
					...getAllSubgroupIds(allUserGroups || []),
					lastUserGroup.id,
				]
		: [];

	return (
		<Container mode="vertical" size="small">
			<Container mode="horizontal">
				<Container size="medium">
					<Form className="c-content-edit-form">
						<Grid>
							<Column size="12">
								<FormGroup
									error={formErrors.thumbnailPath}
									label={tText(
										'admin/content/components/content-edit-form/content-edit-form___cover-afbeelding'
									)}
									className="field-thumbnail-path"
								>
									<FileUpload
										ownerId={commonUser.profileId}
										urls={compact([contentPageInfo.thumbnailPath])}
										assetType="CONTENT_PAGE_COVER"
										allowMulti={false}
										label={tText(
											'admin/content/components/content-edit-form/content-edit-form___cover-afbeelding'
										)}
										onChange={(urls: string[]) => changeContentPageProp('thumbnailPath', urls[0])}
										onDeleteFile={noop} // images will be deleted from the assets service when the user saves the content page
									/>
								</FormGroup>
							</Column>
							<Column size="12">
								<FormGroup
									error={formErrors.title}
									label={tText(
										'admin/content/components/content-edit-form/content-edit-form___titel'
									)}
									required
									className="field-title"
								>
									<TextInput
										onChange={(value) => {
											changeContentPageProp('title', value);
										}}
										value={contentPageInfo.title}
									/>
								</FormGroup>
							</Column>
							<Column size="12">
								<ContentPageEditFormDescription
									value={contentPageInfo.description || ''}
									onChange={(html: string) => {
										changeContentPageProp('description', html);
									}}
									required
									formError={formErrors.description}
									className="field-description"
								></ContentPageEditFormDescription>
							</Column>
							<Column size="12">
								<FormGroup
									error={formErrors.seoDescription}
									label={
										tText(
											'modules/content-page/components/content-edit-form/content-edit-form___beschrijving-voor-seo',
											{
												maxLength: CONTENT_PAGE_SEO_DESCRIPTION_MAX_LENGTH_STRING,
											}
										) +
										` (${
											contentPageInfo.seoDescription?.length || 0
										} / ${CONTENT_PAGE_SEO_DESCRIPTION_MAX_LENGTH_STRING})`
									}
									className="field-seo-description"
								>
									<TextArea
										value={contentPageInfo.seoDescription || ''}
										onChange={(newValue) => changeContentPageProp('seoDescription', newValue)}
										height="auto"
										placeholder={tText(
											'admin/content/components/content-edit-form/content-edit-form___omschijving-voor-de-google-de-pagina-omschrijving-wordt-gebruikt-indien-dit-veld-niet-ingevuld-is'
										)}
									/>
								</FormGroup>
							</Column>
							<Column size="12">
								<FormGroup
									error={formErrors.metaDescription}
									label={tText(
										'admin/content/components/content-edit-form/content-edit-form___beschrijving-voor-export-bv-klaar-nieuwsbrief'
									)}
									className="field-meta-description"
								>
									<TextArea
										value={contentPageInfo.metaDescription || ''}
										onChange={(newValue) => changeContentPageProp('metaDescription', newValue)}
										height="auto"
										placeholder={tText(
											'admin/content/components/content-edit-form/content-edit-form___omschrijving-bij-het-exporteren-van-deze-pagina-bijvoorbeeld-als-de-beschrijving-van-de-nieuwsbrief-voor-klaar'
										)}
									/>
								</FormGroup>
							</Column>
							{commonUser?.permissions?.includes(PermissionName.EDIT_PROTECTED_PAGE_STATUS) && (
								<Column size="12">
									<FormGroup error={formErrors.isProtected} className="field-is-protected">
										<Checkbox
											checked={contentPageInfo.isProtected}
											label={tText(
												'admin/content/components/content-edit-form/content-edit-form___beschermde-pagina'
											)}
											onChange={(value) => changeContentPageProp('isProtected', value)}
										/>
									</FormGroup>
								</Column>
							)}
							<Column size="12">
								<FormGroup
									error={formErrors.path}
									label={tText(
										'admin/content/components/content-edit-form/content-edit-form___url'
									)}
									required
									className="field-path"
								>
									<TextInput
										onChange={(value) => changeContentPageProp('path', value)}
										value={ContentPageService.getPathOrDefault(contentPageInfo)}
									/>
								</FormGroup>
							</Column>
							{commonUser?.permissions?.includes(PermissionName.EDIT_CONTENT_PAGE_AUTHOR) &&
								!!commonUser && (
									<Column size="12">
										<FormGroup
											error={formErrors.userProfileId}
											label={tText('admin/content/views/content-detail___auteur')}
											required
											className="field-user-profile-id"
										>
											<ContentPicker
												hideTargetSwitch
												hideTypeDropdown
												placeholder={tText(
													'admin/content/components/content-edit-form/content-edit-form___selecteer-een-auteur'
												)}
												allowedTypes={[Avo.Core.ContentPickerType.PROFILE]}
												value={owner}
												onChange={(item: PickerItem | null) => {
													if (!item) {
														return;
													}
													changeContentPageProp('userProfileId', item.value);
												}}
											/>
										</FormGroup>
									</Column>
								)}
							<Column size="3-6">
								<FormGroup
									error={formErrors.contentType}
									label={tText(
										'admin/content/components/content-edit-form/content-edit-form___content-type'
									)}
									required
									className="field-content-type"
								>
									<Select
										onChange={handleContentTypeChange}
										options={contentTypeOptions}
										value={contentPageInfo.contentType}
									/>
								</FormGroup>
							</Column>
							<Column size="3-6">
								<FormGroup
									error={formErrors.contentWidth}
									label={tText(
										'admin/content/components/content-edit-form/content-edit-form___content-breedte'
									)}
									className="field-contentWidth"
								>
									<Select
										onChange={(value) => changeContentPageProp('contentWidth', value)}
										options={GET_CONTENT_PAGE_WIDTH_OPTIONS()}
										value={contentPageInfo.contentWidth}
									/>
								</FormGroup>
							</Column>
							<Column size="12">
								<FormGroup
									label={tText(
										'admin/content/components/content-edit-form/content-edit-form___labels'
									)}
									className="field-labels"
								>
									<TagsInput
										value={mapLabelsToTags(contentPageInfo.labels || [])}
										options={mapLabelsToTags(contentTypeLabels)}
										placeholder={
											contentPageInfo.contentType
												? tText(
														'admin/content/components/content-edit-form/content-edit-form___kies-of-maak-een-label-optioneel'
													)
												: tText(
														'admin/content/components/content-edit-form/content-edit-form___kies-eerst-het-type-pagina'
													)
										}
										allowMulti
										onChange={(values) =>
											changeContentPageProp(
												'labels',
												mapTagsToLabels(values, contentPageInfo.contentType) as ContentPageLabel[]
											)
										}
										disabled={!contentPageInfo.contentType}
									/>
								</FormGroup>
							</Column>
							{isMultiLanguageEnabled() && (
								<Column size="6">
									<FormGroup
										label={tText(
											'modules/content-page/components/content-edit-form/content-edit-form___taal'
										)}
										className="field-language"
									>
										<Select
											options={allLanguageOptions}
											value={contentPageInfo.language}
											onChange={(newLanguage) => {
												changeContentPageProp('language', newLanguage);
											}}
											placeholder={tText(
												'modules/content-page/components/content-edit-form/content-edit-form___selecteer-de-taal-van-de-pagina'
											)}
											required
											aria-label={tText(
												'modules/content-page/components/content-edit-form/content-edit-form___selecteer-de-taal-van-de-pagina'
											)}
										></Select>
									</FormGroup>
								</Column>
							)}
							{isMultiLanguageEnabled() && (
								<Column size="6" className="c-multilanguage-controls">
									<FormGroup
										label={tText(
											'modules/content-page/components/content-edit-form/content-edit-form___nederlandse-hoofd-pagina'
										)}
										className="field-nl-parent-page"
									>
										<ContentPicker
											value={getParentPagePickerItem()}
											onChange={(newNlParentPage) => {
												const nlParentPageId = newNlParentPage?.value;
												changeContentPageProp('nlParentPageId', nlParentPageId);
											}}
											allowedTypes={[Avo.Core.ContentPickerType.NL_CONTENT_PAGE_PARENT_ID]}
											hideTypeDropdown
											hideTargetSwitch
											placeholder={tText(
												'modules/content-page/components/content-edit-form/content-edit-form___leeg-indien-dit-de-hoofd-pagina-is'
											)}
										></ContentPicker>
									</FormGroup>
								</Column>
							)}
							{!isLoadingAllUserGroups && !isNil(lastUserGroup?.id) && (
								<Column size="12">
									<UserGroupSelect
										label={tText(
											'admin/content/components/content-edit-form/content-edit-form___zichtbaar-voor'
										)}
										error={formErrors.userGroupIds}
										values={contentPageInfo.userGroupIds || []}
										required={false}
										onChange={(userGroupIds: string[]) =>
											changeContentPageProp('userGroupIds', userGroupIds)
										}
										checkedOptions={defaultOptionSelection}
										disabledOptions={[lastUserGroup.id]}
										className="field-user-group-ids"
									/>
								</Column>
							)}
						</Grid>
					</Form>
				</Container>
			</Container>
		</Container>
	);
};
