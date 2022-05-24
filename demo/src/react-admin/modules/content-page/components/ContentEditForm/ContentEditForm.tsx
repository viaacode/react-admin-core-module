import {
	Checkbox,
	Column,
	Container,
	Form,
	FormGroup,
	Grid,
	Select,
	SelectOption,
	TagInfo,
	TagsInput,
	TextArea,
	TextInput,
} from '@viaa/avo2-components';
import { RichEditorState } from '@meemoo/react-components/dist/esm';
import { Avo } from '@viaa/avo2-types';
import { compact, get } from 'lodash-es';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { DEFAULT_PAGES_WIDTH, GET_CONTENT_WIDTH_OPTIONS } from '../../const/content-page.consts';
import {
	ContentEditActionType,
	ContentEditFormErrors,
	ContentPageInfo,
	ContentWidth,
} from '../../types/content-pages.types';

import { Config, ToastType } from '~core/config';
import { ContentEditAction } from '~modules/content-page/helpers/content-edit.reducer';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { ContentPicker } from '~modules/shared/components/ContentPicker/ContentPicker';
import { ContentPickerType } from '~modules/shared/components/ContentPicker/ContentPicker.types';
import FileUpload from '~modules/shared/components/FileUpload/FileUpload';
import { UserGroupSelect } from '~modules/shared/components/UserGroupSelect/UserGroupSelect';
import RichTextEditorWrapper from '~modules/shared/components/RichTextEditorWrapper/RichTextEditorWrapper';
import { RICH_TEXT_EDITOR_OPTIONS_FULL } from '~modules/shared/consts/rich-text-editor.consts';
import { getProfileId } from '~modules/shared/helpers/get-profile-id';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { ValueOf } from '~modules/shared/types';
import { PickerItem } from '~modules/shared/types/content-picker';
import { CommonUser, Permission } from '~modules/user/user.types';
import { getFullName } from '~modules/shared/helpers/get-profile-info';

import './ContentEditForm.scss';

interface ContentEditFormProps {
	contentTypes: SelectOption<Avo.ContentPage.Type>[];
	formErrors: ContentEditFormErrors;
	contentPageInfo: Partial<ContentPageInfo>;
	changeContentPageState: (action: ContentEditAction) => void;
	user: CommonUser;
}

export const ContentEditForm: FunctionComponent<ContentEditFormProps> = ({
	contentTypes = [],
	formErrors,
	contentPageInfo,
	changeContentPageState,
	user,
}) => {
	// Hooks
	const { t } = useTranslation();

	const [contentTypeLabels, setContentTypeLabels] = useState<Avo.ContentPage.Label[]>([]);

	const changeContentPageProp = useCallback(
		(propName: keyof ContentPageInfo, propValue: ValueOf<ContentPageInfo>) =>
			changeContentPageState({
				type: ContentEditActionType.SET_CONTENT_PAGE_PROP,
				payload: { propName, propValue },
			}),
		[changeContentPageState]
	);

	useEffect(() => {
		// Set fixed content width for specific page types
		Object.keys(DEFAULT_PAGES_WIDTH).forEach((key) => {
			if (
				contentPageInfo.content_type &&
				DEFAULT_PAGES_WIDTH[key as ContentWidth].includes(contentPageInfo.content_type) &&
				contentPageInfo.content_width !== key
			) {
				changeContentPageProp('content_width', key);
			}
		});
	}, [contentPageInfo.content_type, contentPageInfo.content_width, changeContentPageProp]);

	useEffect(() => {
		if (!contentPageInfo.content_type) {
			return;
		}
		ContentPageService.fetchLabelsByContentType(contentPageInfo.content_type)
			.then(setContentTypeLabels)
			.catch((err: any) => {
				console.error('Failed to fetch content labels by content type', err, {
					contentType: contentPageInfo.content_type,
				});
				Config.getConfig().services.toastService.showToast({
					title: t(
						'modules/admin/content-page/components/content-edit-form/content-edit-form___error'
					),
					description: t(
						'admin/content/components/content-edit-form/content-edit-form___het-ophalen-van-de-content-labels-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			});
	}, [contentPageInfo.content_type, setContentTypeLabels, t]);

	// Computed
	const contentTypeOptions = [
		{
			label: t(
				'admin/content/components/content-edit-form/content-edit-form___kies-een-content-type'
			),
			value: '',
			disabled: true,
		},
		...contentTypes,
	];

	// Methods
	const handleContentTypeChange = (value: string) => {
		changeContentPageProp('content_type', value);
		changeContentPageProp('labels', []);
	};

	const mapLabelsToTags = (contentLabels: Partial<Avo.ContentPage.Label>[]): TagInfo[] => {
		return (contentLabels || []).map((contentLabel) => ({
			label: contentLabel.label as string,
			value: String(contentLabel.id as number),
		}));
	};

	const mapTagsToLabels = (
		tags: TagInfo[],
		contentType: Avo.ContentPage.Type | undefined
	): Partial<Avo.ContentPage.Label>[] => {
		return (tags || []).map((tag) => ({
			label: tag.label,
			id: tag.value as number,
			content_type: contentType,
		}));
	};

	// Render
	const ownerId = get(contentPageInfo, 'user_profile_id');
	const owner: PickerItem | undefined =
		contentPageInfo.profile && ownerId
			? {
					label: getFullName(contentPageInfo?.profile, false, true) || '-',
					type: ContentPickerType.PROFILE,
					value: ownerId,
			  }
			: {
					label: getFullName(user as any, false, false) || '-',
					type: ContentPickerType.PROFILE,
					value: getProfileId(user),
			  };
	return (
		<Container mode="vertical" size="small">
			<Container mode="horizontal">
				<Container size="medium">
					<Form className="c-content-edit-form">
						<Grid>
							<Column size="12">
								<FormGroup
									error={formErrors.thumbnail_path}
									label={t(
										'admin/content/components/content-edit-form/content-edit-form___cover-afbeelding'
									)}
								>
									<FileUpload
										ownerId={get(user, 'profile.id')}
										urls={compact([contentPageInfo.thumbnail_path])}
										assetType="CONTENT_PAGE_COVER"
										allowMulti={false}
										label={t(
											'admin/content/components/content-edit-form/content-edit-form___cover-afbeelding'
										)}
										onChange={(urls: string[]) =>
											changeContentPageProp('thumbnail_path', urls[0])
										}
									/>
								</FormGroup>
							</Column>
							<Column size="12">
								<FormGroup
									error={formErrors.title}
									label={t(
										'admin/content/components/content-edit-form/content-edit-form___titel'
									)}
									required
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
								<FormGroup
									error={formErrors.description_html}
									label={t(
										'admin/content/components/content-edit-form/content-edit-form___omschrijving'
									)}
								>
									<RichTextEditorWrapper
										initialHtml={contentPageInfo.description_html || ''}
										state={contentPageInfo.description_state || undefined}
										onChange={(state: RichEditorState) =>
											changeContentPageProp('description_state', state)
										}
										controls={RICH_TEXT_EDITOR_OPTIONS_FULL}
										fileType="CONTENT_PAGE_DESCRIPTION_IMAGE"
										id="description"
									/>
								</FormGroup>
							</Column>
							<Column size="12">
								<FormGroup
									error={formErrors.seo_description}
									label={t(
										'admin/content/components/content-edit-form/content-edit-form___seo-omschrijving'
									)}
								>
									<TextArea
										value={contentPageInfo.seo_description || ''}
										onChange={(newValue) =>
											changeContentPageProp('seo_description', newValue)
										}
										height="auto"
										placeholder={t(
											'admin/content/components/content-edit-form/content-edit-form___omschijving-voor-de-google-de-pagina-omschrijving-wordt-gebruikt-indien-dit-veld-niet-ingevuld-is'
										)}
									/>
								</FormGroup>
							</Column>
							<Column size="12">
								<FormGroup
									error={formErrors.meta_description}
									label={t(
										'admin/content/components/content-edit-form/content-edit-form___beschrijving-voor-export-bv-klaar-nieuwsbrief'
									)}
								>
									<TextArea
										value={contentPageInfo.meta_description || ''}
										onChange={(newValue) =>
											changeContentPageProp('meta_description', newValue)
										}
										height="auto"
										placeholder={t(
											'admin/content/components/content-edit-form/content-edit-form___omschrijving-bij-het-exporteren-van-deze-pagina-bijvoorbeeld-als-de-beschrijving-van-de-nieuwsbrief-voor-klaar'
										)}
									/>
								</FormGroup>
							</Column>
							{user?.permissions?.includes(Permission.EDIT_PROTECTED_PAGE_STATUS) && (
								<Column size="12">
									<FormGroup error={formErrors.is_protected}>
										<Checkbox
											checked={contentPageInfo.is_protected}
											label={t(
												'admin/content/components/content-edit-form/content-edit-form___beschermde-pagina'
											)}
											onChange={(value) =>
												changeContentPageProp('is_protected', value)
											}
										/>
									</FormGroup>
								</Column>
							)}
							<Column size="12">
								<FormGroup
									error={formErrors.path}
									label={t(
										'admin/content/components/content-edit-form/content-edit-form___url'
									)}
									required
								>
									<TextInput
										onChange={(value) => changeContentPageProp('path', value)}
										value={ContentPageService.getPathOrDefault(contentPageInfo)}
									/>
								</FormGroup>
							</Column>
							{user?.permissions?.includes(Permission.EDIT_CONTENT_PAGE_AUTHOR) &&
								!!user && (
									<Column size="12">
										<FormGroup
											error={formErrors.user_profile_id}
											label={t('admin/content/views/content-detail___auteur')}
											required
										>
											<ContentPicker
												initialValue={owner}
												hideTargetSwitch
												hideTypeDropdown
												placeholder={t(
													'admin/content/components/content-edit-form/content-edit-form___selecteer-een-auteur'
												)}
												allowedTypes={[ContentPickerType.PROFILE]}
												onSelect={(item: PickerItem | null) => {
													if (!item) {
														return;
													}
													changeContentPageProp(
														'user_profile_id',
														item.value
													);
												}}
											/>
										</FormGroup>
									</Column>
								)}
							<Column size="3-6">
								<FormGroup
									error={formErrors.content_type}
									label={t(
										'admin/content/components/content-edit-form/content-edit-form___content-type'
									)}
									required
								>
									<Select
										onChange={handleContentTypeChange}
										options={contentTypeOptions}
										value={contentPageInfo.content_type}
									/>
								</FormGroup>
							</Column>
							<Column size="3-6">
								<FormGroup
									error={formErrors.content_width}
									label={t(
										'admin/content/components/content-edit-form/content-edit-form___content-breedte'
									)}
								>
									<Select
										onChange={(value) =>
											changeContentPageProp('content_width', value)
										}
										options={GET_CONTENT_WIDTH_OPTIONS()}
										value={contentPageInfo.content_width}
									/>
								</FormGroup>
							</Column>
							<Column size="12">
								<FormGroup
									label={t(
										'admin/content/components/content-edit-form/content-edit-form___labels'
									)}
								>
									<TagsInput
										value={mapLabelsToTags(contentPageInfo.labels || [])}
										options={mapLabelsToTags(contentTypeLabels)}
										placeholder={
											contentPageInfo.content_type
												? t(
														'admin/content/components/content-edit-form/content-edit-form___kies-of-maak-een-label-optioneel'
												  )
												: t(
														'admin/content/components/content-edit-form/content-edit-form___kies-eerst-het-type-pagina'
												  )
										}
										allowMulti
										onChange={(values) =>
											changeContentPageProp(
												'labels',
												mapTagsToLabels(
													values,
													contentPageInfo.content_type
												)
											)
										}
										disabled={!contentPageInfo.content_type}
									/>
								</FormGroup>
							</Column>
							<Column size="12">
								<UserGroupSelect
									label={t(
										'admin/content/components/content-edit-form/content-edit-form___zichtbaar-voor'
									)}
									error={formErrors.user_group_ids}
									placeholder={t(
										'admin/menu/components/menu-edit-form/menu-edit-form___niemand'
									)}
									values={contentPageInfo.user_group_ids || []}
									required={false}
									onChange={(userGroupIds: string[]) =>
										changeContentPageProp('user_group_ids', userGroupIds)
									}
								/>
							</Column>
						</Grid>
					</Form>
				</Container>
			</Container>
		</Container>
	);
};
