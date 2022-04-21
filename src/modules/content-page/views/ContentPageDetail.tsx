import { get } from 'lodash-es';
import React, {
	FunctionComponent,
	ReactElement,
	ReactText,
	useCallback,
	useEffect,
	useState,
} from 'react';

import {
	Blankslate,
	Button,
	ButtonToolbar,
	Container,
	LinkTarget,
	MenuItemInfo,
	Navbar,
	Tabs,
} from '@viaa/avo2-components';
import { Config, ToastType } from '~core/config';
import ContentPage from '~modules/content-page/components/ContentPage/ContentPage';
import PublishContentPageModal from '~modules/content-page/components/PublishContentPageModal';
import {
	CONTENT_PATH,
	GET_CONTENT_DETAIL_TABS,
} from '~modules/content-page/const/content-page.consts';
import { isPublic } from '~modules/content-page/helpers/get-published-state';
import { useSoftDeleteContentPage } from '~modules/content-page/hooks/useSoftDeleteContentPage';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { ContentPageDetailMetaData } from '~modules/content-page/views/ContentPageDetailMetaData';
import ConfirmModal from '~modules/shared/components/ConfirmModal/ConfirmModal';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import MoreOptionsDropdown from '~modules/shared/components/MoreOptionsDropdown/MoreOptionsDropdown';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { createDropdownMenuItem } from '~modules/shared/helpers/dropdown';
import { getUserGroupId } from '~modules/shared/helpers/get-profile-info';
import { buildLink, navigateToAbsoluteOrRelativeUrl } from '~modules/shared/helpers/link';
import { useTabs } from '~modules/shared/hooks/useTabs';
import { AdminLayout } from '~modules/shared/layouts';
import { PermissionService } from '~modules/shared/services/permission-service';
import { UserProps } from '~modules/shared/types';
import { SpecialUserGroup } from '~modules/user-group/user-group.const';
import { Permission } from '~modules/user/user.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

export const CONTENT_PAGE_COPY = 'Kopie %index%: ';
export const CONTENT_PAGE_COPY_REGEX = /^Kopie [0-9]+: /gi;

const {
	EDIT_ANY_CONTENT_PAGES,
	EDIT_OWN_CONTENT_PAGES,
	DELETE_ANY_CONTENT_PAGES,
	UNPUBLISH_ANY_CONTENT_PAGE,
	PUBLISH_ANY_CONTENT_PAGE,
} = Permission;

const ContentPageDetail: FunctionComponent<UserProps> = ({ user }) => {
	// Hooks
	const { t } = useTranslation();
	const history = Config.getConfig().services.router.useHistory();
	const { id } = Config.getConfig().services.router.useParams();

	const [contentPageInfo, setContentPageInfo] = useState<ContentPageInfo | null>(null);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
	const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
	const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState<boolean>(false);

	const { mutateAsync: softDeleteContentPage } = useSoftDeleteContentPage();

	const [currentTab, setCurrentTab, tabs] = useTabs(
		GET_CONTENT_DETAIL_TABS(),
		GET_CONTENT_DETAIL_TABS()[0].id
	);

	const isAdminUser = getUserGroupId(user as any) === SpecialUserGroup.Admin;
	const isContentProtected = get(contentPageInfo, 'is_protected', false);
	const pageTitle = `Content: ${get(contentPageInfo, 'title', '')}`;

	const hasPerm = (permission: Permission) => PermissionService.hasPerm(user, permission);

	const fetchContentPageById = useCallback(async () => {
		try {
			if (
				!PermissionService.hasPerm(user, Permission.EDIT_ANY_CONTENT_PAGES) &&
				!PermissionService.hasPerm(user, Permission.EDIT_OWN_CONTENT_PAGES)
			) {
				setLoadingInfo({
					state: 'error',
					message: t(
						'admin/content/views/content-detail___je-hebt-geen-rechten-om-deze-content-pagina-te-bekijken'
					),
					icon: 'lock',
				});
				return;
			}
			const contentPageObj = await ContentPageService.getContentPageById(id);
			if (!contentPageObj) {
				setLoadingInfo({
					state: 'error',
					message: t(
						'admin/content/views/content-detail___de-content-pagina-kon-niet-worden-gevonden-of-je-hebt-geen-rechten-om-deze-te-bekijken'
					),
					icon: 'lock',
				});
				return;
			}
			setContentPageInfo(contentPageObj);
		} catch (err) {
			console.error(
				new CustomError('Failed to get content page by id', err, {
					query: 'GET_CONTENT_PAGE_BY_ID',
					variables: {
						id,
					},
				})
			);
			const notFound = JSON.stringify(err).includes('NOT_FOUND');
			setLoadingInfo({
				state: 'error',
				message: notFound
					? t(
							'admin/content/views/content-detail___een-content-pagina-met-dit-id-kon-niet-worden-gevonden'
					  )
					: t(
							'admin/content/views/content-detail___het-ophalen-van-de-content-pagina-is-mislukt'
					  ),
				icon: notFound ? 'search' : 'alert-triangle',
			});
		}
	}, [id, setContentPageInfo, setLoadingInfo, user, t]);

	useEffect(() => {
		fetchContentPageById();
	}, [fetchContentPageById]);

	useEffect(() => {
		if (contentPageInfo) {
			setLoadingInfo({
				state: 'loaded',
			});
		}
	}, [contentPageInfo, setLoadingInfo]);

	const handleDelete = async () => {
		try {
			await softDeleteContentPage(id);

			history.push(CONTENT_PATH.CONTENT_PAGE_OVERVIEW);
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t('Success'),
				description: Config.getConfig().services.i18n.t(
					'admin/content/views/content-detail___het-content-item-is-succesvol-verwijderd'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(err);
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t('Error'),
				description: Config.getConfig().services.i18n.t(
					'admin/content/views/content-detail___het-verwijderen-van-het-content-item-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	function handlePreviewClicked() {
		if (contentPageInfo && contentPageInfo.path) {
			navigateToAbsoluteOrRelativeUrl(contentPageInfo.path, history, LinkTarget.Blank);
		} else {
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t('Error'),
				description: Config.getConfig().services.i18n.t(
					'admin/content/views/content-detail___de-preview-kon-niet-worden-geopend'
				),
				type: ToastType.ERROR,
			});
		}
	}

	const handleShareModalClose = async (newContentPage?: Partial<ContentPageInfo>) => {
		try {
			if (newContentPage) {
				await ContentPageService.updateContentPage(
					{
						...contentPageInfo,
						...newContentPage,
					},
					undefined
				);

				setContentPageInfo({
					...contentPageInfo,
					...newContentPage,
				} as ContentPageInfo);

				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t('Success'),
					description: Config.getConfig().services.i18n.t(
						isPublic(newContentPage)
							? 'admin/content/views/content-detail___de-content-pagina-is-nu-publiek'
							: 'admin/content/views/content-detail___de-content-pagina-is-nu-niet-meer-publiek'
					),
					type: ToastType.SUCCESS,
				});
			}
		} catch (err) {
			console.error('Failed to save is_public state to content page', err, {
				newContentPage,
				contentPage: contentPageInfo,
			});

			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t('Error'),
				description: Config.getConfig().services.i18n.t(
					'admin/content/views/content-detail___het-opslaan-van-de-publiek-status-van-de-content-pagina-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}

		setIsPublishModalOpen(false);
	};

	const CONTENT_DROPDOWN_ITEMS: MenuItemInfo[] = [
		...(hasPerm(EDIT_ANY_CONTENT_PAGES)
			? [
					createDropdownMenuItem(
						'duplicate',
						t('collection/views/collection-detail___dupliceer'),
						'copy'
					),
			  ]
			: []),
		...((!isContentProtected || (isContentProtected && isAdminUser)) &&
		hasPerm(DELETE_ANY_CONTENT_PAGES)
			? [
					createDropdownMenuItem(
						'delete',
						t('admin/content/views/content-detail___verwijderen')
					),
			  ]
			: []),
	];

	const executeAction = async (item: ReactText) => {
		setIsOptionsMenuOpen(false);
		switch (item) {
			case 'duplicate':
				try {
					if (!contentPageInfo) {
						Config.getConfig().services.toastService.showToast({
							title: Config.getConfig().services.i18n.t('Error'),
							description: Config.getConfig().services.i18n.t(
								'admin/content/views/content-detail___de-content-pagina-kon-niet-worden-gedupliceerd'
							),
							type: ToastType.ERROR,
						});
						return;
					}

					const duplicateContentPage = await ContentPageService.duplicateContentPage(
						contentPageInfo,
						CONTENT_PAGE_COPY,
						CONTENT_PAGE_COPY_REGEX,
						get(user, 'profile.id')
					);

					if (!duplicateContentPage) {
						Config.getConfig().services.toastService.showToast({
							title: Config.getConfig().services.i18n.t('Error'),
							description: Config.getConfig().services.i18n.t(
								'admin/content/views/content-detail___de-gedupliceerde-content-pagina-kon-niet-worden-gevonden'
							),
							type: ToastType.ERROR,
						});
						return;
					}

					history.push(
						buildLink(CONTENT_PATH.CONTENT_PAGE_DETAIL, {
							id: duplicateContentPage.id,
						})
					);
					Config.getConfig().services.toastService.showToast({
						title: Config.getConfig().services.i18n.t('Success'),
						description: Config.getConfig().services.i18n.t(
							'admin/content/views/content-detail___de-content-pagina-is-gedupliceerd'
						),
						type: ToastType.SUCCESS,
					});
				} catch (err) {
					console.error('Failed to duplicate content page', err, {
						originalContentPage: contentPageInfo,
					});

					Config.getConfig().services.toastService.showToast({
						title: Config.getConfig().services.i18n.t('Error'),
						description: Config.getConfig().services.i18n.t(
							'admin/content/views/content-detail___het-dupliceren-van-de-content-pagina-is-mislukt'
						),
						type: ToastType.ERROR,
					});
				}
				break;

			case 'delete':
				setIsConfirmModalOpen(true);
				break;

			default:
				return null;
		}
	};

	const renderContentActions = () => {
		const contentPageOwner = get(contentPageInfo, 'user_profile_id');
		const isOwner = get(user, 'profile.id') === contentPageOwner;
		const isAllowedToEdit =
			hasPerm(EDIT_ANY_CONTENT_PAGES) || (hasPerm(EDIT_OWN_CONTENT_PAGES) && isOwner);
		const Link = Config.getConfig().services.router.Link;

		return (
			<ButtonToolbar>
				{((hasPerm(PUBLISH_ANY_CONTENT_PAGE) && !isPublic(contentPageInfo)) ||
					(hasPerm(UNPUBLISH_ANY_CONTENT_PAGE) && isPublic(contentPageInfo))) && (
					<Button
						type="secondary"
						icon={isPublic(contentPageInfo) ? 'unlock-3' : 'lock'}
						label={t('admin/content/views/content-detail___publiceren')}
						title={t(
							'admin/content/views/content-detail___maak-de-content-pagina-publiek-niet-publiek'
						)}
						ariaLabel={t(
							'admin/content/views/content-detail___maak-de-content-pagina-publiek-niet-publiek'
						)}
						onClick={() => setIsPublishModalOpen(true)}
					/>
				)}
				<Button
					type="secondary"
					icon="eye"
					label={t('admin/content/views/content-detail___preview')}
					title={t(
						'admin/content/views/content-detail___bekijk-deze-pagina-in-de-website'
					)}
					ariaLabel={t(
						'admin/content/views/content-detail___bekijk-deze-pagina-in-de-website'
					)}
					onClick={handlePreviewClicked}
				/>
				{isAllowedToEdit && (
					<Link
						to={buildLink(CONTENT_PATH.CONTENT_PAGE_EDIT, {
							id,
						})}
						className="a-link__no-styles"
					>
						<Button
							label={t('admin/content/views/content-detail___bewerken')}
							title={t(
								'admin/content/views/content-detail___bewerk-deze-content-pagina'
							)}
						/>
					</Link>
				)}
				<MoreOptionsDropdown
					isOpen={isOptionsMenuOpen}
					onOpen={() => setIsOptionsMenuOpen(true)}
					onClose={() => setIsOptionsMenuOpen(false)}
					menuItems={CONTENT_DROPDOWN_ITEMS}
					onOptionClicked={executeAction}
				/>
			</ButtonToolbar>
		);
	};

	// Render
	const renderContentDetail = (contentPageInfo: ContentPageInfo | null): ReactElement | null => {
		if (!contentPageInfo) {
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t('Error'),
				description: Config.getConfig().services.i18n.t(
					'admin/content/views/content-detail___de-content-pagina-kon-niet-worden-ingeladen'
				),
				type: ToastType.ERROR,
			});

			return null;
		}

		switch (currentTab) {
			case 'inhoud':
				return <ContentPage contentPageInfo={contentPageInfo} user={user} />;
			case 'metadata':
				return <ContentPageDetailMetaData contentPageInfo={contentPageInfo} />;
			default:
				return (
					<Blankslate
						title={t(
							'admin/content/views/content-detail___dit-tabblad-kon-niet-gevonden-worden'
						)}
					/>
				);
		}
	};

	// const description = contentPageInfo ? ContentPageService.getDescription(contentPageInfo) : '';
	return (
		<AdminLayout pageTitle={pageTitle}>
			<AdminLayout.Actions>{renderContentActions()}</AdminLayout.Actions>
			<AdminLayout.Content>
				<Navbar background="alt" placement="top" autoHeight>
					<Container mode="horizontal">
						<Tabs tabs={tabs} onClick={setCurrentTab} />
					</Container>
				</Navbar>
				{/*<MetaTags>*/}
				{/*	<title>*/}
				{/*		{GENERATE_SITE_TITLE(*/}
				{/*			get(contentPageInfo, 'title'),*/}
				{/*			t(*/}
				{/*				'admin/content/views/content-detail___content-beheer-detail-pagina-titel'*/}
				{/*			)*/}
				{/*		)}*/}
				{/*	</title>*/}
				{/*	<meta*/}
				{/*		name="description"*/}
				{/*		content={get(contentPageInfo, 'seo_description') || description || ''}*/}
				{/*	/>*/}
				{/*</MetaTags>*/}
				<LoadingErrorLoadedComponent
					loadingInfo={loadingInfo}
					dataObject={contentPageInfo}
					render={() => renderContentDetail(contentPageInfo)}
				/>
				<ConfirmModal
					deleteObjectCallback={handleDelete}
					isOpen={isConfirmModalOpen}
					onClose={() => setIsConfirmModalOpen(false)}
					body={
						isContentProtected
							? t(
									'admin/content/views/content-detail___opgelet-dit-is-een-beschermde-pagina'
							  )
							: ''
					}
				/>
				{!!contentPageInfo && (
					<PublishContentPageModal
						contentPage={contentPageInfo}
						isOpen={isPublishModalOpen}
						onClose={handleShareModalClose}
					/>
				)}
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default ContentPageDetail;
