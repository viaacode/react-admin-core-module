import { Button, ButtonToolbar, Container, Navbar, Tabs } from '@viaa/avo2-components';
import { get, has, isFunction, isNil, without } from 'lodash-es';
import React, { FC, ReactNode, Reducer, useCallback, useEffect, useReducer, useState } from 'react';
import { PermissionName } from '@viaa/avo2-types';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { ContentEditForm } from '~modules/content-page/components/ContentEditForm/ContentEditForm';
import { CONTENT_BLOCK_INITIAL_STATE_MAP } from '~modules/content-page/const/content-block-initial-state-map';
import {
	CONTENT_PAGE_PATH,
	GET_CONTENT_PAGE_DETAIL_TABS,
} from '~modules/content-page/const/content-page.consts';
import {
	CONTENT_PAGE_INITIAL_STATE,
	ContentEditAction,
	contentEditReducer,
	ContentPageEditState,
} from '~modules/content-page/helpers/content-edit.reducer';
import { useContentTypes } from '~modules/content-page/hooks/useContentTypes';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import {
	ContentBlockComponentState,
	ContentBlockConfig,
	ContentBlockErrors,
	ContentBlockStateOption,
	ContentBlockStateType,
	ContentBlockType,
	RepeatedContentBlockComponentState,
	SingleContentBlockComponentState,
} from '~modules/content-page/types/content-block.types';
import {
	ContentEditActionType,
	ContentEditFormErrors,
	ContentPageInfo,
	PageType,
} from '~modules/content-page/types/content-pages.types';
import ConfirmModal from '~modules/shared/components/ConfirmModal/ConfirmModal';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { getProfileId } from '~modules/shared/helpers/get-profile-id';
import { navigate } from '~modules/shared/helpers/link';
import { validateContentBlockField } from '~modules/shared/helpers/validation';
import { useTabs } from '~modules/shared/hooks/useTabs';
import { AdminLayout } from '~modules/shared/layouts';
import { PermissionService } from '~modules/shared/services/permission-service';
import { DefaultComponentProps } from '~modules/shared/types/components';
import ContentEditContentBlocks from './ContentEditContentBlocks';

import './ContentPageEdit.scss';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { ROUTE_PARTS } from '~modules/shared/consts/routes';

const { EDIT_ANY_CONTENT_PAGES, EDIT_OWN_CONTENT_PAGES } = PermissionName;

export type ContentPageEditProps = DefaultComponentProps & {
	id: string | undefined;
	renderBack?: () => ReactNode;
};

const ContentPageEdit: FC<ContentPageEditProps> = ({ id, className, renderBack }) => {
	// Hooks
	const [contentPageState, changeContentPageState] = useReducer<
		Reducer<ContentPageEditState, ContentEditAction>
	>(contentEditReducer, {
		currentContentPageInfo: CONTENT_PAGE_INITIAL_STATE(),
		initialContentPageInfo: CONTENT_PAGE_INITIAL_STATE(),
	});

	const [formErrors, setFormErrors] = useState<ContentEditFormErrors>({});
	const [configToDelete, setConfigToDelete] = useState<number>();
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

	const { tHtml, tText } = useTranslation();
	const history = AdminConfigManager.getConfig().services.router.useHistory();

	const [contentTypes, isLoadingContentTypes] = useContentTypes();
	const [currentTab, setCurrentTab, tabs] = useTabs(GET_CONTENT_PAGE_DETAIL_TABS(), 'inhoud');

	const user = AdminConfigManager.getConfig().user;
	const hasPerm = useCallback(
		(permission: PermissionName) => PermissionService.hasPerm(user, permission),
		[user]
	);

	const fetchContentPage = useCallback(async () => {
		try {
			if (isNil(id) || id === ROUTE_PARTS.create) {
				return;
			}
			if (
				!hasPerm(PermissionName.EDIT_ANY_CONTENT_PAGES) &&
				!hasPerm(PermissionName.EDIT_OWN_CONTENT_PAGES)
			) {
				setLoadingInfo({
					state: 'error',
					message: tHtml(
						'admin/content/views/content-edit___je-hebt-geen-rechten-om-deze-content-pagina-te-bekijken'
					),
					icon: 'lock',
				});
				return;
			}
			const contentPageObj = await ContentPageService.getContentPageById(id);
			if (!contentPageObj) {
				setLoadingInfo({
					state: 'error',
					message: tHtml('react-admin/modules/content-page/views/content-page-edit___deze-pagina-kon-niet-worden-gevonden'),
					icon: 'search',
				});
				return;
			}
			if (
				!hasPerm(PermissionName.EDIT_ANY_CONTENT_PAGES) &&
				contentPageObj.userProfileId !== getProfileId(user)
			) {
				setLoadingInfo({
					state: 'error',
					message: tHtml(
						'admin/content/views/content-edit___je-hebt-geen-rechten-om-deze-content-pagina-te-bekijken'
					),
					icon: 'lock',
				});
				return;
			}
			changeContentPageState({
				type: ContentEditActionType.SET_CONTENT_PAGE,
				payload: {
					contentPageInfo: contentPageObj,
					replaceInitial: true,
				},
			});
		} catch (err) {
			console.error(
				new CustomError('Failed to load content page', err, {
					id,
				})
			);
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('modules/content-page/views/content-page-edit___error'),
				description: tText(
					'admin/content/views/content-edit___het-laden-van-deze-content-pagina-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	}, [id, user, hasPerm, tHtml, tText]);

	const onPasteContentBlock = useCallback(
		(evt: ClipboardEvent) => {
			try {
				if (evt.clipboardData && evt.clipboardData.getData) {
					const pastedText = evt.clipboardData.getData('text/plain');

					if (pastedText.startsWith('{"block":')) {
						const newConfig = JSON.parse(pastedText).block;
						delete newConfig.id;
						// Ensure block is added at the bottom of the page
						newConfig.position = (
							contentPageState.currentContentPageInfo.content_blocks || []
						).length;
						changeContentPageState({
							type: ContentEditActionType.ADD_CONTENT_BLOCK_CONFIG,
							payload: newConfig,
						});

						AdminConfigManager.getConfig().services.toastService.showToast({
							title: tText('modules/content-page/views/content-page-edit___success'),
							description: tText(
								'admin/content/views/content-edit___de-blok-is-toegevoegd'
							),
							type: ToastType.SUCCESS,
						});
					}
				}
			} catch (err) {
				console.error(new CustomError('Failed to paste content block', err));
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText('modules/content-page/views/content-page-edit___error'),
					description: tText(
						'admin/content/views/content-edit___het-plakken-van-het-content-blok-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			}
		},
		[changeContentPageState, contentPageState.currentContentPageInfo.content_blocks, tText]
	);

	useEffect(() => {
		fetchContentPage();
	}, [fetchContentPage]);

	useEffect(() => {
		if (contentPageState.currentContentPageInfo && !isLoadingContentTypes) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [contentPageState.currentContentPageInfo, isLoadingContentTypes]);

	useEffect(() => {
		document.body.addEventListener('paste', onPasteContentBlock);

		return () => {
			document.body.removeEventListener('paste', onPasteContentBlock);
		};
	}, [onPasteContentBlock]);

	// Computed
	const pageType = id ? PageType.Edit : PageType.Create;
	let pageTitle = tText('admin/content/views/content-edit___content-toevoegen');
	if (pageType !== PageType.Create) {
		pageTitle = `${tText('admin/content/views/content-edit___content-aanpassen')}: ${get(
			contentPageState.currentContentPageInfo,
			'title',
			''
		)}`;
	}

	// Methods
	const openDeleteModal = (configIndex: number) => {
		setIsDeleteModalOpen(true);
		setConfigToDelete(configIndex);
	};

	const handleSave = async () => {
		try {
			setIsSaving(true);
			setHasSubmitted(true);

			// Validate form
			const isFormValid = await handleValidation();
			let areConfigsValid = true;

			if (!hasSubmitted) {
				setHasSubmitted(true);
			}

			// Remove rich text editor states, since they are also saved as html,
			// and we don't want those states to end up in the database
			const blockConfigs: ContentBlockConfig[] = contentPageState.currentContentPageInfo
				.content_blocks
				? ContentPageService.convertRichTextEditorStatesToHtml(
						contentPageState.currentContentPageInfo.content_blocks
				  )
				: [];

			// Run validators on to check untouched inputs
			blockConfigs.forEach((config, configIndex) => {
				const { fields, state } = config.components;
				const keysToValidate = Object.keys(fields).filter((key) => fields[key].validator);
				let newErrors: ContentBlockErrors = {};

				if (keysToValidate.length > 0) {
					keysToValidate.forEach((key) => {
						const validator = fields[key].validator;

						if (validator && isFunction(validator)) {
							if (Array.isArray(state) && state.length > 0) {
								state.forEach(
									(
										singleState: ContentBlockComponentState,
										stateIndex: number
									) => {
										newErrors = validateContentBlockField(
											key,
											validator,
											newErrors,
											singleState[key as keyof ContentBlockComponentState],
											stateIndex
										);
									}
								);
							} else if (has(state, key)) {
								newErrors = validateContentBlockField(
									key,
									validator,
									newErrors,
									state[key as keyof ContentBlockComponentState]
								);
							}
						}
					});

					const hasErrors = Object.keys(newErrors).length > 0;

					if (hasErrors) {
						changeContentPageState({
							type: ContentEditActionType.SET_CONTENT_BLOCK_ERROR,
							payload: { configIndex, errors: newErrors },
						});

						areConfigsValid = false;
					}
				}
			});

			if (!isFormValid || !areConfigsValid) {
				setIsSaving(false);
				if (!isFormValid) {
					AdminConfigManager.getConfig().services.toastService.showToast({
						title: tText('modules/content-page/views/content-page-edit___error'),
						description: tText(
							'admin/content/views/content-edit___er-zijn-nog-fouten-in-het-metadata-formulier'
						),
						type: ToastType.ERROR,
					});
				}
				if (!areConfigsValid) {
					AdminConfigManager.getConfig().services.toastService.showToast({
						title: tText('modules/content-page/views/content-page-edit___error'),
						description: tText(
							'admin/content/views/content-edit___er-zijn-nog-fouten-in-de-content-blocks'
						),
						type: ToastType.ERROR,
					});
				}

				return;
			}

			let insertedOrUpdatedContent: Partial<ContentPageInfo> | null;
			if (pageType === PageType.Create) {
				const contentBody = {
					...contentPageState.currentContentPageInfo,
					user_profile_id: getProfileId(user),
					content_blocks: blockConfigs,
					path: ContentPageService.getPathOrDefault(
						contentPageState.currentContentPageInfo
					),
				};
				insertedOrUpdatedContent = await ContentPageService.insertContentPage(contentBody);
			} else {
				if (!isNil(id)) {
					const contentBody = {
						...contentPageState.currentContentPageInfo,
						updated_at: new Date().toISOString(),
						id:
							typeof (id as string | number) === 'string' && id.includes('-')
								? id
								: parseInt(id, 10), // Numeric ids in avo, uuid's in hetarchief
						content_blocks: blockConfigs,
						path: ContentPageService.getPathOrDefault(
							contentPageState.currentContentPageInfo
						),
					};
					insertedOrUpdatedContent = await ContentPageService.updateContentPage(
						contentBody,
						contentPageState.initialContentPageInfo
					);
				} else {
					throw new CustomError(
						'failed to update content page because the id is undefined',
						null,
						{
							id,
							contentPageInfo: contentPageState.currentContentPageInfo,
						}
					);
				}
			}

			if (!insertedOrUpdatedContent || isNil(insertedOrUpdatedContent.id)) {
				throw new CustomError(
					'Failed to save labels because no response or response does not contain a valid id',
					null,
					{
						insertedOrUpdatedContent,
						contentPageInfo: contentPageState.currentContentPageInfo,
						isCreatePage: pageType === PageType.Create,
					}
				);
			}

			// Save content labels
			const initialLabelIds = (contentPageState.initialContentPageInfo.labels || []).map(
				(label: any) => label.id as number
			);
			const labelIds = (contentPageState.currentContentPageInfo.labels || []).map(
				(label: any) => label.id as number
			);
			const addedLabelIds = without(labelIds, ...initialLabelIds);
			const removedLabelIds = without(initialLabelIds, ...labelIds);
			await Promise.all([
				ContentPageService.insertContentLabelsLinks(
					insertedOrUpdatedContent.id,
					addedLabelIds
				),
				ContentPageService.deleteContentLabelsLinks(
					insertedOrUpdatedContent.id,
					removedLabelIds
				),
			]);

			AdminConfigManager.getConfig()?.contentPage?.onSaveContentPage(
				insertedOrUpdatedContent as ContentPageInfo
			);

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('modules/content-page/views/content-page-edit___success'),
				description: tText(
					'admin/content/views/content-edit___het-content-item-is-succesvol-opgeslagen'
				),
				type: ToastType.SUCCESS,
			});
			navigate(
				history,
				CONTENT_PAGE_PATH(AdminConfigManager.getConfig().route_parts).DETAIL,
				{
					id: insertedOrUpdatedContent.id,
				}
			);
		} catch (err) {
			console.error(new CustomError('Failed to save content page ', err));
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('modules/content-page/views/content-page-edit___error'),
				description: tText(
					'admin/content/views/content-edit___het-opslaan-van-de-content-pagina-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}

		setIsSaving(false);
	};

	const handleValidation = async (): Promise<boolean> => {
		const errors: ContentEditFormErrors = {};

		if (!contentPageState.currentContentPageInfo.title) {
			errors.title = tText('admin/content/views/content-edit___titel-is-verplicht');
		}

		if (!contentPageState.currentContentPageInfo.contentType) {
			errors.contentType = tText(
				'admin/content/views/content-edit___content-type-is-verplicht'
			);
		}

		// check if the path is unique
		const path = ContentPageService.getPathOrDefault(contentPageState.currentContentPageInfo);

		try {
			const existingContentPageTitle: string | null =
				await ContentPageService.doesContentPagePathExist(
					path,
					contentPageState.currentContentPageInfo.id
				);
			if (existingContentPageTitle) {
				errors.path = tText(
					'admin/content/views/content-edit___dit-path-is-reeds-gebruikt-door-pagina-page-title',
					{
						pageTitle: existingContentPageTitle,
					}
				);
			} else {
				delete errors.path;
			}
		} catch (err) {
			// ignore error if content page does not exist yet, since we're trying to save it
			if (!JSON.stringify(err).includes('NotFound')) {
				throw err;
			}
		}

		if (
			contentPageState.currentContentPageInfo.publishAt &&
			contentPageState.currentContentPageInfo.depublishAt &&
			new Date(contentPageState.currentContentPageInfo.depublishAt) <
				new Date(contentPageState.currentContentPageInfo.publishAt)
		) {
			errors.depublishAt = tText(
				'admin/content/views/content-edit___depublicatie-moet-na-publicatie-datum'
			);
		}

		setFormErrors(errors);

		return Object.keys(errors).length === 0;
	};

	const navigateBack = () => {
		if (pageType === PageType.Create) {
			history.push(CONTENT_PAGE_PATH(AdminConfigManager.getConfig().route_parts).OVERVIEW);
		} else {
			navigate(
				history,
				CONTENT_PAGE_PATH(AdminConfigManager.getConfig().route_parts).DETAIL,
				{ id }
			);
		}
	};

	const addComponentToState = (index: number, blockType: ContentBlockType) => {
		changeContentPageState({
			type: ContentEditActionType.ADD_COMPONENTS_STATE,
			payload: {
				index,
				formGroupState: CONTENT_BLOCK_INITIAL_STATE_MAP[blockType](),
			},
		});
	};

	const removeComponentFromState = (index: number, stateIndex: number) => {
		changeContentPageState({
			type: ContentEditActionType.REMOVE_COMPONENTS_STATE,
			payload: {
				index,
				stateIndex,
			},
		});
	};

	const handleStateSave = (
		index: number,
		formGroupType: ContentBlockStateType,
		formGroupState: ContentBlockStateOption,
		stateIndex?: number
	) => {
		if (formGroupType === 'block') {
			changeContentPageState({
				type: ContentEditActionType.SET_BLOCK_STATE,
				payload: {
					index,
					formGroupState: (Array.isArray(formGroupState)
						? formGroupState[0]
						: formGroupState) as
						| SingleContentBlockComponentState
						| RepeatedContentBlockComponentState,
				},
			});
		} else {
			changeContentPageState({
				type: ContentEditActionType.SET_COMPONENTS_STATE,
				payload: {
					index,
					stateIndex,
					formGroupState: Array.isArray(formGroupState)
						? (formGroupState[0] as Partial<ContentBlockComponentState>)
						: formGroupState,
				},
			});
		}
	};

	// Render
	const renderTabContent = () => {
		switch (currentTab) {
			case 'inhoud':
				return (
					<ContentEditContentBlocks
						contentPageInfo={contentPageState.currentContentPageInfo}
						hasSubmitted={hasSubmitted}
						addComponentToState={addComponentToState}
						removeComponentFromState={removeComponentFromState}
						changeContentPageState={changeContentPageState}
						onRemove={openDeleteModal}
						onSave={handleStateSave}
					/>
				);
			case 'metadata':
				return (
					<ContentEditForm
						contentTypes={contentTypes}
						formErrors={formErrors}
						contentPageInfo={contentPageState.currentContentPageInfo}
						changeContentPageState={changeContentPageState}
						user={user}
					/>
				);
			default:
				return null;
		}
	};

	const renderEditContentPage = () => {
		const contentPageOwnerId = contentPageState.initialContentPageInfo.userProfileId;
		const isOwner =
			user?.profileId && contentPageOwnerId && user?.profileId === contentPageOwnerId;
		const isAllowedToSave =
			hasPerm(EDIT_ANY_CONTENT_PAGES) || (hasPerm(EDIT_OWN_CONTENT_PAGES) && isOwner);

		return (
			<AdminLayout className={className} pageTitle={pageTitle}>
				<AdminLayout.Back>{renderBack?.()}</AdminLayout.Back>
				<AdminLayout.Actions>
					<ButtonToolbar>
						<Button
							label={tText('admin/content/views/content-edit___annuleer')}
							onClick={navigateBack}
							type="tertiary"
						/>
						{isAllowedToSave && (
							<Button
								disabled={isSaving}
								label={tText('admin/content/views/content-edit___opslaan')}
								onClick={handleSave}
							/>
						)}
					</ButtonToolbar>
				</AdminLayout.Actions>
				<AdminLayout.Content>
					<Navbar background="alt" placement="top" autoHeight>
						<Container mode="horizontal">
							<Tabs tabs={tabs} onClick={setCurrentTab} />
						</Container>
					</Navbar>

					{renderTabContent()}
					<ConfirmModal
						deleteObjectCallback={() => {
							if (!isNil(configToDelete)) {
								changeContentPageState({
									type: ContentEditActionType.REMOVE_CONTENT_BLOCK_CONFIG,
									payload: configToDelete,
								});
							}
						}}
						body={tHtml(
							'modules/content-page/views/content-page-edit___het-verwijderen-van-een-blok-kan-niet-ongedaan-gemaakt-worden'
						)}
						isOpen={isDeleteModalOpen}
						onClose={() => setIsDeleteModalOpen(false)}
					/>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<LoadingErrorLoadedComponent
			loadingInfo={loadingInfo}
			dataObject={contentPageState.currentContentPageInfo}
			render={renderEditContentPage}
		/>
	);
};

export default ContentPageEdit;
