import {
	Button,
	ButtonToolbar,
	Container,
	IconName,
	Navbar,
	Spacer,
	Tabs,
} from '@viaa/avo2-components';
import { isNil, without } from 'lodash-es';
import React, { FC, Reducer, useCallback, useEffect, useReducer, useState } from 'react';
import { PermissionName } from '@viaa/avo2-types';
import type { Avo } from '@viaa/avo2-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ErrorView } from '~shared/components/error';

import Link from '~shared/components/Link/Link';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { ContentEditForm } from '~modules/content-page/components/ContentEditForm/ContentEditForm';
import { CONTENT_BLOCK_INITIAL_STATE_MAP } from '~modules/content-page/const/content-block-initial-state-map';
import { GET_CONTENT_PAGE_DETAIL_TABS } from '~modules/content-page/const/content-page.consts';
import {
	CONTENT_PAGE_INITIAL_STATE,
	ContentEditAction,
	contentEditReducer,
	ContentPageEditState,
} from '~modules/content-page/helpers/content-edit.reducer';
import { useContentTypes } from '~modules/content-page/hooks/useContentTypes';
import { convertRichTextEditorStatesToHtml } from '~modules/content-page/services/content-page.converters';
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
	ContentPageUser,
	PageType,
} from '~modules/content-page/types/content-pages.types';
import { Icon } from '~shared/components';
import ConfirmModal from '~shared/components/ConfirmModal/ConfirmModal';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from '~shared/helpers/custom-error';
import { getProfileId } from '~shared/helpers/get-profile-id';
import { navigate } from '~shared/helpers/link';
import { useTabs } from '~shared/hooks/useTabs';
import { AdminLayout } from '~shared/layouts';
import { PermissionService } from '~shared/services/permission-service';
import { DefaultComponentProps } from '~shared/types/components';
import ContentEditContentBlocks from './ContentEditContentBlocks';

import './ContentPageEdit.scss';
import { useTranslation } from '~shared/hooks/useTranslation';
import { validateContentBlockConfig } from '../helpers/validate-content-block-config';
import { blockHasErrors } from '../helpers/block-has-errors';

const { EDIT_ANY_CONTENT_PAGES, EDIT_OWN_CONTENT_PAGES } = PermissionName;

export type ContentPageEditProps = DefaultComponentProps & {
	id: string | undefined;
	commonUser: Avo.User.CommonUser;
};

const ContentPageEdit: FC<ContentPageEditProps> = ({ id, className, commonUser }) => {
	// Hooks
	const [contentPageState, changeContentPageState] = useReducer<
		Reducer<ContentPageEditState, ContentEditAction>
	>(contentEditReducer, {
		currentContentPageInfo: CONTENT_PAGE_INITIAL_STATE(commonUser),
		initialContentPageInfo: CONTENT_PAGE_INITIAL_STATE(commonUser),
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

	const hasPerm = useCallback(
		(permission: PermissionName) => PermissionService.hasPerm(commonUser, permission),
		[commonUser]
	);

	const fetchContentPage = useCallback(async () => {
		try {
			if (
				isNil(id) ||
				id ===
					AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_CREATE').split('/').pop()
			) {
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
					icon: 'lock' as IconName,
				});
				return;
			}
			const contentPageObj = await ContentPageService.getContentPageById(id);
			if (!contentPageObj) {
				setLoadingInfo({
					state: 'error',
					message: tHtml(
						'react-admin/modules/content-page/views/content-page-edit___deze-pagina-kon-niet-worden-gevonden'
					),
					icon: 'search' as IconName,
				});
				return;
			}
			if (
				!hasPerm(PermissionName.EDIT_ANY_CONTENT_PAGES) &&
				contentPageObj.userProfileId !== getProfileId(commonUser)
			) {
				setLoadingInfo({
					state: 'error',
					message: tHtml(
						'admin/content/views/content-edit___je-hebt-geen-rechten-om-deze-content-pagina-te-bekijken'
					),
					icon: 'lock' as IconName,
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
	}, [id, commonUser, hasPerm, tHtml, tText]);

	const handlePasteBlock = useCallback(
		async (newBlockConfig: Partial<Avo.ContentPage.Block>) => {
			const spinnerToastId = AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('react-admin/modules/content-page/views/content-page-edit___bezig'),
				description: tText(
					'react-admin/modules/content-page/views/content-page-edit___bezig-met-dupliceren-van-de-afbeeldingen'
				),
				type: ToastType.SPINNER,
			});
			delete newBlockConfig.id;
			// Ensure block is added at the bottom of the page
			newBlockConfig.position = (
				contentPageState?.currentContentPageInfo?.content_blocks || []
			).length;

			// Duplicate the assets used in this content block, so it is no longer linked to the original content block
			const newBlockConfigWithDuplicatedAssets =
				await ContentPageService.duplicateContentImages(newBlockConfig);

			changeContentPageState({
				type: ContentEditActionType.ADD_CONTENT_BLOCK_CONFIG,
				payload: newBlockConfigWithDuplicatedAssets,
			});

			AdminConfigManager.getConfig().services.toastService.hideToast(spinnerToastId);
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('modules/content-page/views/content-page-edit___success'),
				description: tText('admin/content/views/content-edit___de-blok-is-toegevoegd'),
				type: ToastType.SUCCESS,
			});
		},
		[contentPageState?.currentContentPageInfo?.content_blocks, tText]
	);

	const handlePasteContentPage = useCallback(
		async (newContentPageConfig: ContentPageInfo) => {
			const spinnerToastId = AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('react-admin/modules/content-page/views/content-page-edit___bezig'),
				description: tText(
					'react-admin/modules/content-page/views/content-page-edit___bezig-met-dupliceren-van-de-afbeeldingen'
				),
				type: ToastType.SPINNER,
			});

			// Replace pasted content page id with existing content page id
			if (contentPageState.currentContentPageInfo.id) {
				newContentPageConfig.id = contentPageState.currentContentPageInfo.id as
					| string
					| number;
				newContentPageConfig.createdAt = contentPageState.currentContentPageInfo.createdAt;
			} else {
				delete (newContentPageConfig as any).id;
				newContentPageConfig.createdAt = new Date().toISOString();
			}

			// Remove content block ids
			newContentPageConfig.content_blocks.forEach((contentBlock) => {
				delete contentBlock.id;
			});

			// Set author to current user
			newContentPageConfig.userProfileId = commonUser.profileId;
			newContentPageConfig.owner = {
				id: commonUser.profileId,
				fullName: commonUser.fullName,
				firstName: commonUser.firstName,
				lastName: commonUser.lastName,
				groupId: commonUser.userGroup?.id,
				groupName: commonUser.userGroup?.name,
			} as ContentPageUser;

			newContentPageConfig.updatedAt = new Date().toISOString();

			const contentPageWithDuplicatedAssets =
				await ContentPageService.duplicateContentImages(newContentPageConfig);

			// Remove content page labels, since those labels might not exist on this environment
			contentPageWithDuplicatedAssets.labels = [];

			// Update the content page state
			changeContentPageState({
				type: ContentEditActionType.SET_CONTENT_PAGE,
				payload: {
					contentPageInfo: {
						...contentPageWithDuplicatedAssets,
						content_blocks: [
							...contentPageState.currentContentPageInfo.content_blocks,
							...contentPageWithDuplicatedAssets.content_blocks,
						].map((block, blockIndex) => {
							// Reorder the combined array of content block positions
							return {
								...block,
								position: blockIndex,
							};
						}),
					},
					replaceInitial: false,
				},
			});

			AdminConfigManager.getConfig().services.toastService.hideToast(spinnerToastId);
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('modules/content-page/views/content-page-edit___success'),
				description: tText(
					'react-admin/modules/content-page/views/content-page-edit___de-content-pagina-info-is-overgenomen'
				),
				type: ToastType.SUCCESS,
			});
		},
		[
			commonUser.firstName,
			commonUser.fullName,
			commonUser.lastName,
			commonUser.profileId,
			commonUser.userGroup?.id,
			commonUser.userGroup?.name,
			contentPageState.currentContentPageInfo.content_blocks,
			contentPageState.currentContentPageInfo.createdAt,
			contentPageState.currentContentPageInfo.id,
			tText,
		]
	);

	const onPasteContent = useCallback(
		async (evt: ClipboardEvent) => {
			try {
				if (evt.clipboardData && evt.clipboardData.getData) {
					const pastedText = evt.clipboardData.getData('text/plain');

					if (pastedText.startsWith('{"block":')) {
						await handlePasteBlock(JSON.parse(pastedText).block);
					}
					if (pastedText.startsWith('{"contentPage":')) {
						await handlePasteContentPage(JSON.parse(pastedText).contentPage);
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
		[handlePasteBlock, handlePasteContentPage, tText]
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
		document.body.addEventListener('paste', onPasteContent);

		return () => {
			document.body.removeEventListener('paste', onPasteContent);
		};
	}, [onPasteContent]);

	// Computed
	const pageType = id ? PageType.Edit : PageType.Create;
	let pageTitle = tText('admin/content/views/content-edit___content-toevoegen');
	if (pageType !== PageType.Create) {
		pageTitle = `${tText('admin/content/views/content-edit___content-aanpassen')}: ${
			contentPageState.currentContentPageInfo?.title || ''
		}`;
	}

	// Methods
	const openDeleteModal = (configIndex: number) => {
		setIsDeleteModalOpen(true);
		setConfigToDelete(configIndex);
	};

	const handleSave = async () => {
		const { content_blocks } = contentPageState.currentContentPageInfo;

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
			const blockConfigs: ContentBlockConfig[] = content_blocks
				? convertRichTextEditorStatesToHtml(content_blocks)
				: [];

			// Run validators on to check untouched inputs
			blockConfigs.forEach((config, configIndex) => {
				let newErrors: ContentBlockErrors = {};

				newErrors = validateContentBlockConfig(
					newErrors,
					config.components.fields,
					config.components.state
				);
				newErrors = validateContentBlockConfig(
					newErrors,
					config.block.fields,
					config.block.state
				);

				if (blockHasErrors(newErrors)) {
					changeContentPageState({
						type: ContentEditActionType.SET_CONTENT_BLOCK_ERROR,
						payload: { configIndex, errors: newErrors },
					});

					areConfigsValid = false;
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

			let insertedOrUpdatedContent: ContentPageInfo | null;
			if (pageType === PageType.Create) {
				const contentBody = {
					...contentPageState.currentContentPageInfo,
					userProfileId: getProfileId(commonUser),
					content_blocks: blockConfigs,
					path: ContentPageService.getPathOrDefault(
						contentPageState.currentContentPageInfo
					),
				};
				insertedOrUpdatedContent = await ContentPageService.insertContentPage(contentBody);
			} else {
				if (!isNil(id)) {
					const contentBody: ContentPageInfo = {
						...contentPageState.currentContentPageInfo,
						updatedAt: new Date().toISOString(),
						id:
							typeof (id as string | number) === 'string' && id.includes('-')
								? id
								: parseInt(id, 10), // Numeric ids in avo, uuid's in hetarchief
						content_blocks: blockConfigs,
						path: ContentPageService.getPathOrDefault(
							contentPageState.currentContentPageInfo
						),
					};
					insertedOrUpdatedContent =
						await ContentPageService.updateContentPage(contentBody);
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
			navigate(history, AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_DETAIL'), {
				id: insertedOrUpdatedContent.id,
			});
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

		return !blockHasErrors(errors);
	};

	const navigateBack = () => {
		if (pageType === PageType.Create) {
			history.push(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_OVERVIEW'));
		} else {
			navigate(history, AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_DETAIL'), {
				id,
			});
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
						commonUser={commonUser}
					/>
				);
			case 'metadata':
				return (
					<ContentEditForm
						contentTypes={contentTypes}
						formErrors={formErrors}
						contentPageInfo={contentPageState.currentContentPageInfo}
						changeContentPageState={changeContentPageState}
						commonUser={commonUser}
					/>
				);
			default:
				return null;
		}
	};

	const renderEditContentPage = () => {
		const contentPageOwnerId = contentPageState.initialContentPageInfo.userProfileId;
		const isOwner =
			commonUser?.profileId &&
			contentPageOwnerId &&
			commonUser?.profileId === contentPageOwnerId;
		const canEditContentPage =
			hasPerm(EDIT_ANY_CONTENT_PAGES) || (hasPerm(EDIT_OWN_CONTENT_PAGES) && isOwner);
		if (!canEditContentPage) {
			return (
				<ErrorView
					message={tText(
						'react-admin/modules/content-page/views/content-page-edit___je-hebt-geen-rechten-om-deze-content-pagina-aan-te-passen-titel'
					)}
					actionButtons={undefined}
				>
					<p>
						{tHtml(
							'admin/content/views/content-overview___beschrijving-hoe-content-toe-te-voegen'
						)}
					</p>
					{hasPerm(PermissionName.CREATE_CONTENT_PAGES) && (
						<Spacer margin="top">
							<Link
								to={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_CREATE')}
							>
								<Button
									icon={'plus' as IconName}
									label={tText(
										'admin/content/views/content-overview___content-toevoegen'
									)}
									title={tText(
										'admin/content/views/content-overview___maak-een-nieuwe-content-pagina-aan'
									)}
								/>
							</Link>
						</Spacer>
					)}
				</ErrorView>
			);
		}
		return (
			<AdminLayout className={className} pageTitle={pageTitle}>
				<AdminLayout.Back>
					<Button type="borderless" onClick={() => window.history.back()}>
						<Icon name="chevronLeft"></Icon>
					</Button>
				</AdminLayout.Back>
				<AdminLayout.Actions>
					{canEditContentPage && (
						<ButtonToolbar>
							<Button
								label={tText('admin/content/views/content-edit___annuleer')}
								onClick={navigateBack}
								type="tertiary"
							/>
							<Button
								disabled={isSaving}
								label={tText('admin/content/views/content-edit___opslaan')}
								onClick={handleSave}
							/>
						</ButtonToolbar>
					)}
				</AdminLayout.Actions>
				<AdminLayout.Content>
					<Navbar
						background="alt"
						placement="top"
						autoHeight
						className="c-content-page-edit__nav-bar"
					>
						<Container mode="horizontal">
							<Tabs tabs={tabs} onClick={setCurrentTab} />
							<CopyToClipboard
								text={JSON.stringify({
									contentPage: contentPageState.currentContentPageInfo,
								})}
								onCopy={() =>
									AdminConfigManager.getConfig().services.toastService.showToast({
										title: AdminConfigManager.getConfig().services.i18n.tText(
											'react-admin/modules/content-page/views/content-page-edit___gekopieerd'
										),
										description:
											AdminConfigManager.getConfig().services.i18n.tText(
												'react-admin/modules/content-page/views/content-page-edit___de-content-pagina-is-naar-je-klembord-gekopieerd-druk-ctrl-v-om-hem-te-plakken-op-een-bewerk-pagina'
											),
										type: ToastType.SUCCESS,
									})
								}
							>
								<Button
									icon={'copy' as IconName}
									size="small"
									title={tText(
										'react-admin/modules/content-page/views/content-page-edit___kopieer-content-pagina'
									)}
									ariaLabel={tText(
										'react-admin/modules/content-page/views/content-page-edit___kopieer-content-pagina'
									)}
									type="secondary"
									className="c-content-page-edit__copy-page-button u-spacer-s"
								/>
							</CopyToClipboard>
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
