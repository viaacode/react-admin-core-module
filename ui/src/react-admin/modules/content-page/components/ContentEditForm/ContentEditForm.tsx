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
import type { Avo } from '@viaa/avo2-types';
import { PermissionName } from '@viaa/avo2-types';
import { compact, get } from 'lodash-es';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
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
import { CommonUser } from '~modules/user/user.types';
import { getFullName } from '~modules/shared/helpers/get-profile-info';

import './ContentEditForm.scss';
import {
	DEFAULT_PAGES_WIDTH,
	GET_CONTENT_PAGE_WIDTH_OPTIONS,
} from '~modules/content-page/const/content-page.consts';
import {
	ContentEditActionType,
	ContentEditFormErrors,
	ContentPageInfo,
	ContentPageLabel,
	ContentWidth,
} from '~modules/content-page/types/content-pages.types';

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
	const { tText } = useTranslation();

	const [contentTypeLabels, setContentTypeLabels] = useState<ContentPageLabel[]>([]);

	const changeContentPageProp = useCallback(
		(
			propName: keyof ContentPageInfo | 'description_state' | 'description_html',
			propValue: ValueOf<ContentPageInfo> | RichEditorState | string
		) =>
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
				contentPageInfo.contentType &&
				DEFAULT_PAGES_WIDTH[key as ContentWidth].includes(contentPageInfo.contentType) &&
				contentPageInfo.contentWidth !== key
			) {
				changeContentPageProp('contentWidth', key);
			}
		});
	}, [contentPageInfo.contentType, contentPageInfo.contentWidth, changeContentPageProp]);

	useEffect(() => {
		if (!contentPageInfo.contentType) {
			return;
		}
		ContentPageService.fetchLabelsByContentType(contentPageInfo.contentType)
			.then(setContentTypeLabels)
			.catch((err: any) => {
				console.error('Failed to fetch content labels by content type', err, {
					contentType: contentPageInfo.contentType,
				});
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText(
						'modules/admin/content-page/components/content-edit-form/content-edit-form___error'
					),
					description: tText(
						'admin/content/components/content-edit-form/content-edit-form___het-ophalen-van-de-content-labels-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			});
	}, [contentPageInfo.contentType, setContentTypeLabels, tText]);

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
	const ownerId = get(contentPageInfo, 'user_profile_id');
	const owner: PickerItem | undefined =
		contentPageInfo.owner && ownerId
			? {
					label: contentPageInfo?.owner?.fullName || '-',
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
									error={formErrors.thumbnailPath}
									label={tText(
										'admin/content/components/content-edit-form/content-edit-form___cover-afbeelding'
									)}
								>
									<FileUpload
										ownerId={user.profileId}
										urls={compact([contentPageInfo.thumbnailPath])}
										assetType="CONTENT_PAGE_COVER"
										allowMulti={false}
										label={tText(
											'admin/content/components/content-edit-form/content-edit-form___cover-afbeelding'
										)}
										onChange={(urls: string[]) =>
											changeContentPageProp('thumbnailPath', urls[0])
										}
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
									label={tText(
										'admin/content/components/content-edit-form/content-edit-form___omschrijving'
									)}
								>
									<RichTextEditorWrapper
										initialHtml={
											(contentPageInfo as any).description_html || ''
										}
										state={
											(contentPageInfo as any).description_state || undefined
										}
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
									error={formErrors.seoDescription}
									label={tText(
										'admin/content/components/content-edit-form/content-edit-form___seo-omschrijving'
									)}
								>
									<TextArea
										value={contentPageInfo.seoDescription || ''}
										onChange={(newValue) =>
											changeContentPageProp('seoDescription', newValue)
										}
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
								>
									<TextArea
										value={contentPageInfo.metaDescription || ''}
										onChange={(newValue) =>
											changeContentPageProp('metaDescription', newValue)
										}
										height="auto"
										placeholder={tText(
											'admin/content/components/content-edit-form/content-edit-form___omschrijving-bij-het-exporteren-van-deze-pagina-bijvoorbeeld-als-de-beschrijving-van-de-nieuwsbrief-voor-klaar'
										)}
									/>
								</FormGroup>
							</Column>
							{user?.permissions?.includes(
								PermissionName.EDIT_PROTECTED_PAGE_STATUS
							) && (
								<Column size="12">
									<FormGroup error={formErrors.isProtected}>
										<Checkbox
											checked={contentPageInfo.isProtected}
											label={tText(
												'admin/content/components/content-edit-form/content-edit-form___beschermde-pagina'
											)}
											onChange={(value) =>
												changeContentPageProp('isProtected', value)
											}
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
								>
									<TextInput
										onChange={(value) => changeContentPageProp('path', value)}
										value={ContentPageService.getPathOrDefault(contentPageInfo)}
									/>
								</FormGroup>
							</Column>
							{user?.permissions?.includes(PermissionName.EDIT_CONTENT_PAGE_AUTHOR) &&
								!!user && (
									<Column size="12">
										<FormGroup
											error={formErrors.userProfileId}
											label={tText(
												'admin/content/views/content-detail___auteur'
											)}
											required
										>
											<ContentPicker
												initialValue={owner}
												hideTargetSwitch
												hideTypeDropdown
												placeholder={tText(
													'admin/content/components/content-edit-form/content-edit-form___selecteer-een-auteur'
												)}
												allowedTypes={[ContentPickerType.PROFILE]}
												onSelect={(item: PickerItem | null) => {
													if (!item) {
														return;
													}
													changeContentPageProp(
														'userProfileId',
														item.value
													);
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
								>
									<Select
										onChange={(value) =>
											changeContentPageProp('contentWidth', value)
										}
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
												mapTagsToLabels(
													values,
													contentPageInfo.contentType
												) as ContentPageLabel[]
											)
										}
										disabled={!contentPageInfo.contentType}
									/>
								</FormGroup>
							</Column>
							<Column size="12">
								<UserGroupSelect
									label={tText(
										'admin/content/components/content-edit-form/content-edit-form___zichtbaar-voor'
									)}
									error={formErrors.userGroupIds}
									placeholder={tText(
										'admin/menu/components/menu-edit-form/menu-edit-form___niemand'
									)}
									values={contentPageInfo.userGroupIds || []}
									required={false}
									onChange={(userGroupIds: string[]) =>
										changeContentPageProp('userGroupIds', userGroupIds)
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
