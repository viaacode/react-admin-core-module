import type { IconName, MenuItemInfo, TabProps } from '@viaa/avo2-components';
import {
	Blankslate,
	Button,
	ButtonToolbar,
	Container,
	LinkTarget,
	Navbar,
	Tabs,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { PermissionName } from '@viaa/avo2-types';
import { get, noop } from 'lodash-es';
import { stringifyUrl } from 'query-string';
import type { FC, ReactElement, ReactText } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { ContentPageRenderer } from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
import PublishContentPageModal from '~modules/content-page/components/PublishContentPageModal';
import { GET_CONTENT_PAGE_DETAIL_TABS } from '~modules/content-page/const/content-page.consts';
import { isPublic } from '~modules/content-page/helpers/get-published-state';
import { useSoftDeleteContentPage } from '~modules/content-page/hooks/useSoftDeleteContentPage';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import type { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { ContentPageAction } from '~modules/content-page/types/content-pages.types';
import { ContentPageDetailMetaData } from '~modules/content-page/views/ContentPageDetailMetaData';
import { Locale } from '~modules/translations/translations.core.types';
import { Icon } from '~shared/components/Icon';
import ConfirmModal from '~shared/components/ConfirmModal/ConfirmModal';
import { Link } from '~shared/components/Link/Link';
import type { LoadingInfo } from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { LoadingErrorLoadedComponent } from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import MoreOptionsDropdown from '~shared/components/MoreOptionsDropdown/MoreOptionsDropdown';
import { CustomError } from '~shared/helpers/custom-error';
import { createDropdownMenuItem } from '~shared/helpers/dropdown';
import { isMultiLanguageEnabled } from '~shared/helpers/is-multi-language-enabled';
import { buildLink, navigate, navigateToAbsoluteOrRelativeUrl } from '~shared/helpers/link';
import { showToast } from '~shared/helpers/show-toast';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { AdminLayout } from '~shared/layouts';
import { PermissionService } from '~shared/services/permission-service';
import type { DefaultComponentProps } from '~shared/types/components';
import { isAvo } from '~shared/helpers/is-avo';

export const CONTENT_PAGE_COPY = 'Kopie %index%: ';
export const CONTENT_PAGE_COPY_REGEX = /^Kopie [0-9]+: /gi;

const {
	EDIT_ANY_CONTENT_PAGES,
	EDIT_OWN_CONTENT_PAGES,
	DELETE_ANY_CONTENT_PAGES,
	UNPUBLISH_ANY_CONTENT_PAGE,
	PUBLISH_ANY_CONTENT_PAGE,
} = PermissionName;

export type ContentPageDetailProps = DefaultComponentProps & {
	id: string;
	loaded?: (item: ContentPageInfo) => void;
	onGoBack: () => void;
	commonUser: Avo.User.CommonUser;
};

export const ContentPageDetail: FC<ContentPageDetailProps> = ({
	id,
	loaded = noop,
	className,
	onGoBack,
	commonUser,
}) => {
	// Hooks
	const history = AdminConfigManager.getConfig().services.router.useHistory();

	const [contentPageInfo, setContentPageInfo] = useState<ContentPageInfo | null>(null);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
	const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
	const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState<boolean>(false);
	const hasEnglishVersion = !!contentPageInfo?.translatedPages.find(
		(page) => page.language === Locale.En
	);

	const { mutateAsync: softDeleteContentPage } = useSoftDeleteContentPage();

	const [currentTab, setCurrentTab] = useQueryParam(
		'tab',
		withDefault(StringParam, GET_CONTENT_PAGE_DETAIL_TABS()[0].id as string)
	);
	const tabs = GET_CONTENT_PAGE_DETAIL_TABS().map((tab: TabProps) => ({
		...tab,
		active: tab.id === currentTab,
	}));

	const isContentProtected = contentPageInfo?.isProtected || false;
	const pageTitle = `${tText('modules/content-page/views/content-page-detail___content')}: ${get(
		contentPageInfo,
		'title',
		''
	)}`;

	const hasPerm = (permission: PermissionName) => PermissionService.hasPerm(commonUser, permission);

	const fetchContentPageById = useCallback(async () => {
		try {
			if (
				!PermissionService.hasPerm(commonUser, PermissionName.EDIT_ANY_CONTENT_PAGES) &&
				!PermissionService.hasPerm(commonUser, PermissionName.EDIT_OWN_CONTENT_PAGES)
			) {
				setLoadingInfo({
					state: 'error',
					message: tHtml(
						'admin/content/views/content-detail___je-hebt-geen-rechten-om-deze-content-pagina-te-bekijken'
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
						'admin/content/views/content-detail___de-content-pagina-kon-niet-worden-gevonden-of-je-hebt-geen-rechten-om-deze-te-bekijken'
					),
					icon: 'lock' as IconName,
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
				message: (
					<Container mode="horizontal" className="u-padding-top-xl u-padding-bottom-xl">
						{notFound
							? tHtml(
									'admin/content/views/content-detail___een-content-pagina-met-dit-id-kon-niet-worden-gevonden'
								)
							: tHtml(
									'admin/content/views/content-detail___het-ophalen-van-de-content-pagina-is-mislukt'
								)}
					</Container>
				),
				icon: notFound ? ('search' as IconName) : ('alertTriangle' as IconName),
			});
		}
	}, [id, commonUser]);

	useEffect(() => {
		fetchContentPageById();
	}, [fetchContentPageById]);

	useEffect(() => {
		if (contentPageInfo) {
			loaded(contentPageInfo);
			setLoadingInfo({
				state: 'loaded',
			});
		}
	}, [contentPageInfo, loaded]);

	const handleDelete = async () => {
		try {
			await softDeleteContentPage(id);

			history.push(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_OVERVIEW'));
			showToast({
				title: tText('modules/content-page/views/content-page-detail___success'),
				description: tText(
					'admin/content/views/content-detail___het-content-item-is-succesvol-verwijderd'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(err);
			showToast({
				title: tText('modules/content-page/views/content-page-detail___error'),
				description: tText(
					'admin/content/views/content-detail___het-verwijderen-van-het-content-item-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	function handlePreviewClicked() {
		if (contentPageInfo?.path) {
			if (contentPageInfo.language === Locale.Nl) {
				// Do not add the locale to the path, since the default is Dutch
				const path = stringifyUrl({
					url: contentPageInfo.path,
					query: {
						preview: true,
					},
				});
				navigateToAbsoluteOrRelativeUrl(path, history, LinkTarget.Blank);
			} else {
				// For english pages, add the locale to the path
				const path = stringifyUrl({
					url: `/${contentPageInfo.language}${contentPageInfo.path}`,
					query: {
						preview: true,
					},
				});
				navigateToAbsoluteOrRelativeUrl(path, history, LinkTarget.Blank);
			}
		} else {
			showToast({
				title: tText('modules/content-page/views/content-page-detail___error'),
				description: tText(
					'admin/content/views/content-detail___de-preview-kon-niet-worden-geopend'
				),
				type: ToastType.ERROR,
			});
		}
	}

	const handleShareModalClose = async (
		newContentPage?: Omit<ContentPageInfo, 'id'> & { id?: string | number }
	) => {
		try {
			if (newContentPage) {
				const updatedContentPage: ContentPageInfo = await ContentPageService.updateContentPage({
					...contentPageInfo,
					...newContentPage,
				} as ContentPageInfo);

				setContentPageInfo({
					...updatedContentPage,
					content_blocks: contentPageInfo?.content_blocks || [],
				});

				showToast({
					title: tText('modules/content-page/views/content-page-detail___success'),
					description: isPublic(newContentPage)
						? tText('admin/content/views/content-detail___de-content-pagina-is-nu-publiek')
						: tText(
								'admin/content/views/content-detail___de-content-pagina-is-nu-niet-meer-publiek'
							),
					type: ToastType.SUCCESS,
				});
			}
		} catch (err) {
			console.error('Failed to save isPublic state to content page', err, {
				newContentPage,
				contentPage: contentPageInfo,
			});

			showToast({
				title: tText('modules/content-page/views/content-page-detail___error'),
				description: tText(
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
						ContentPageAction.duplicate,
						tText('collection/views/collection-detail___dupliceer'),
						'copy'
					),
				]
			: []),
		...(hasPerm(EDIT_ANY_CONTENT_PAGES) &&
		contentPageInfo?.language !== Locale.En &&
		isMultiLanguageEnabled()
			? hasEnglishVersion
				? [
						createDropdownMenuItem(
							ContentPageAction.gotoEnglishPage,
							tText('modules/content-page/views/content-page-detail___ga-naar-engelse-pagina'),
							'eye'
						),
					]
				: [
						createDropdownMenuItem(
							ContentPageAction.duplicateForEnglish,
							tText(
								'modules/content-page/views/content-page-detail___dupliceer-voor-engelse-pagina'
							),
							'copy'
						),
					]
			: []),
		...((!isContentProtected || isContentProtected) && hasPerm(DELETE_ANY_CONTENT_PAGES)
			? [
					createDropdownMenuItem(
						ContentPageAction.delete,
						tText('admin/content/views/content-detail___verwijderen')
					),
				]
			: []),
	];

	const duplicateContentPage = async (overrideValues: Partial<ContentPageInfo>): Promise<void> => {
		try {
			if (!contentPageInfo) {
				showToast({
					title: tText('modules/content-page/views/content-page-detail___error'),
					description: tText(
						'admin/content/views/content-detail___het-dupliceren-van-de-content-pagina-is-mislukt'
					),
					type: ToastType.ERROR,
				});
				return;
			}

			const duplicateContentPage = await ContentPageService.duplicateContentPage(
				contentPageInfo.id,
				overrideValues
			);

			if (!duplicateContentPage) {
				showToast({
					title: tText('modules/content-page/views/content-page-detail___error'),
					description: tText(
						'admin/content/views/content-detail___de-gedupliceerde-content-pagina-kon-niet-worden-gevonden'
					),
					type: ToastType.ERROR,
				});
				return;
			}

			history.push(
				buildLink(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_DETAIL'), {
					id: duplicateContentPage.id,
				})
			);
			showToast({
				title: tText('modules/content-page/views/content-page-detail___success'),
				description: tText(
					'admin/content/views/content-detail___de-content-pagina-is-gedupliceerd'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error('Failed to duplicate content page', err, {
				originalContentPage: contentPageInfo,
			});

			showToast({
				title: tText('modules/content-page/views/content-page-detail___error'),
				description: tText(
					'admin/content/views/content-detail___het-dupliceren-van-de-content-pagina-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const executeAction = async (item: ReactText) => {
		setIsOptionsMenuOpen(false);
		switch (item) {
			case ContentPageAction.duplicate:
				await duplicateContentPage({});
				break;

			case ContentPageAction.duplicateForEnglish:
				await duplicateContentPage({
					language: Locale.En,
					nlParentPageId: contentPageInfo?.id,
				});
				break;

			case ContentPageAction.gotoEnglishPage: {
				const englishPageId = contentPageInfo?.translatedPages.find(
					(p) => p.language === Locale.En
				)?.id;
				if (englishPageId) {
					const url = buildLink(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_DETAIL'), {
						id: englishPageId,
					});
					navigate(history, url);
				}
				break;
			}

			case ContentPageAction.delete:
				setIsConfirmModalOpen(true);
				break;

			default:
				return null;
		}
	};

	const getEditLink = () => {
		return stringifyUrl({
			url: buildLink(AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_EDIT'), {
				id,
			}),
			query: { tab: currentTab },
		});
	};

	const renderContentActions = () => {
		const contentPageOwnerId = contentPageInfo?.userProfileId;
		const isOwner = commonUser?.profileId === contentPageOwnerId;
		const isAllowedToEdit =
			hasPerm(EDIT_ANY_CONTENT_PAGES) || (hasPerm(EDIT_OWN_CONTENT_PAGES) && isOwner);

		return (
			<ButtonToolbar>
				{((hasPerm(PUBLISH_ANY_CONTENT_PAGE) && !isPublic(contentPageInfo)) ||
					(hasPerm(UNPUBLISH_ANY_CONTENT_PAGE) && isPublic(contentPageInfo))) && (
					<Button
						type="secondary"
						icon={isPublic(contentPageInfo) ? ('unlock3' as IconName) : ('lock' as IconName)}
						label={tText('admin/content/views/content-detail___publiceren')}
						title={tText(
							'admin/content/views/content-detail___maak-de-content-pagina-publiek-niet-publiek'
						)}
						ariaLabel={tText(
							'admin/content/views/content-detail___maak-de-content-pagina-publiek-niet-publiek'
						)}
						onClick={() => setIsPublishModalOpen(true)}
					/>
				)}
				<Button
					type="secondary"
					icon={'eye' as IconName}
					label={tText('admin/content/views/content-detail___preview')}
					title={tText('admin/content/views/content-detail___bekijk-deze-pagina-in-de-website')}
					ariaLabel={tText('admin/content/views/content-detail___bekijk-deze-pagina-in-de-website')}
					onClick={handlePreviewClicked}
				/>
				{isAllowedToEdit && (
					<Link to={getEditLink()} className="a-link__no-styles">
						<Button
							label={tText('admin/content/views/content-detail___bewerken')}
							title={tText('admin/content/views/content-detail___bewerk-deze-content-pagina')}
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
			showToast({
				title: tText('modules/content-page/views/content-page-detail___error'),
				description: tText(
					'admin/content/views/content-detail___de-content-pagina-kon-niet-worden-ingeladen'
				),
				type: ToastType.ERROR,
			});

			return null;
		}

		switch (currentTab) {
			case 'inhoud':
				return (
					<ContentPageRenderer
						contentPageInfo={contentPageInfo}
						commonUser={commonUser}
						renderFakeTitle={contentPageInfo.contentType === 'FAQ_ITEM' && isAvo()}
					/>
				);
			case 'metadata':
				return <ContentPageDetailMetaData contentPageInfo={contentPageInfo} />;
			default:
				return (
					<Blankslate
						title={tText(
							'admin/content/views/content-detail___dit-tabblad-kon-niet-gevonden-worden'
						)}
					/>
				);
		}
	};

	// const description = contentPageInfo ? ContentPageService.getDescription(contentPageInfo) : '';
	return (
		<AdminLayout className={className} pageTitle={pageTitle}>
			<AdminLayout.Back>
				<Button type="borderless" onClick={onGoBack}>
					<Icon name="chevronLeft"></Icon>
				</Button>
			</AdminLayout.Back>
			<AdminLayout.Actions>{renderContentActions()}</AdminLayout.Actions>
			<AdminLayout.Content>
				<Navbar background="alt" placement="top" autoHeight>
					<Container mode="horizontal">
						<Tabs
							tabs={tabs}
							onClick={(newCurrentTab: string | number) => setCurrentTab(newCurrentTab as string)}
						/>
					</Container>
				</Navbar>
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
							? tHtml('admin/content/views/content-detail___opgelet-dit-is-een-beschermde-pagina')
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
