import {
	Button,
	ButtonToolbar,
	LabelObj,
	LinkTarget,
	Modal,
	ModalBody,
	TagList,
	TagOption,
} from '@viaa/avo2-components';
import { compact, get } from 'lodash-es';
import React, {
	FunctionComponent,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import ConfirmModal from '~modules/shared/components/ConfirmModal/ConfirmModal';
import { PermissionService } from '~modules/shared/services/permission-service';
import FilterTable, {
	FilterableColumn,
	getFilters,
} from '../../shared/components/FilterTable/FilterTable';
import {
	CONTENT_PATH,
	GET_CONTENT_PAGE_OVERVIEW_COLUMNS,
	ITEMS_PER_PAGE,
} from '../const/content-page.consts';
import { isPublic } from '../helpers/get-published-state';
import { useContentTypes } from '../hooks/useContentTypes';
import { useUserGroupOptions } from '../hooks/useUserGroupOptions';
import { useUserGroups } from '../hooks/useUserGroups';
import { ContentPageService } from '../services/content-page.service';
import {
	ContentOverviewTableCols,
	ContentPageInfo,
	ContentTableState,
} from '../types/content-pages.types';

import { Config, ToastType } from '~core/config';
import { useContentPageLabelOptions } from '~modules/content-page-labels/hooks/useContentPageLabelOptions';
import { CheckboxOption } from '~modules/shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from '~modules/shared/helpers/custom-error';
import {
	getBooleanFilters,
	getDateRangeFilters,
	getMultiOptionFilters,
	getQueryFilter,
} from '~modules/shared/helpers/filters';
import { getFullName } from '~modules/shared/helpers/formatters/avatar';
import { formatDate } from '~modules/shared/helpers/formatters/date';
import { getUserGroupLabel } from '~modules/shared/helpers/get-profile-info';
import { buildLink, navigateToAbsoluteOrRelativeUrl } from '~modules/shared/helpers/link';
import { setSelectedCheckboxes } from '~modules/shared/helpers/set-selected-checkboxes';
import { truncateTableValue } from '~modules/shared/helpers/truncate';
import { AdminLayout } from '~modules/shared/layouts';
import { SpecialPermissionGroups } from '~modules/shared/types/authentication.types';
import { Permission } from '~modules/user/user.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { UserProps } from '~modules/shared/types';

import './ContentPageOverview.scss';

const {
	EDIT_ANY_CONTENT_PAGES,
	DELETE_ANY_CONTENT_PAGES,
	EDIT_PROTECTED_PAGE_STATUS,
	CREATE_CONTENT_PAGES,
} = Permission;

const ContentPageOverview: FunctionComponent<UserProps> = ({ user }) => {
	// Hooks
	const [contentPages, setContentPages] = useState<ContentPageInfo[] | null>(null);
	const [contentPageCount, setContentPageCount] = useState<number>(0);

	const [contentToDelete, setContentToDelete] = useState<ContentPageInfo | null>(null);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
	const [isNotAdminModalOpen, setIsNotAdminModalOpen] = useState<boolean>(false);
	const [tableState, setTableState] = useState<Partial<ContentTableState>>({});
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [userGroupOptions] = useUserGroupOptions('CheckboxOption', false) as [
		CheckboxOption[],
		boolean
	];
	const [userGroups] = useUserGroups(true);
	const [contentTypes] = useContentTypes();
	const [contentPageLabelOptions] = useContentPageLabelOptions();

	const { t } = useTranslation();
	const history = Config.getConfig().services.router.useHistory();

	const contentTypeOptions = useMemo(() => {
		return contentTypes.map(
			(option): CheckboxOption => ({
				id: option.value,
				label: option.label,
				checked: get(tableState, 'content_type', [] as string[]).includes(option.value),
			})
		);
	}, [contentTypes, tableState]);

	const tableColumns = useMemo(() => {
		return GET_CONTENT_PAGE_OVERVIEW_COLUMNS(
			contentTypeOptions,
			setSelectedCheckboxes(userGroupOptions, get(tableState, 'user_group', []) as string[]),
			setSelectedCheckboxes(contentPageLabelOptions, get(tableState, 'label', []) as string[])
		);
	}, [contentPageLabelOptions, contentTypeOptions, tableState, userGroupOptions]);

	const hasPerm = useCallback(
		(permission: Permission) => {
			return PermissionService.hasPerm(user, permission);
		},
		[user]
	);

	const fetchContentPages = useCallback(async () => {
		try {
			setIsLoading(true);
			const generateWhereObject = (filters: Partial<ContentTableState>) => {
				const andFilters: any[] = [];
				andFilters.push(
					...getQueryFilter(filters.query, (queryWildcard: string) => [
						{ title: { _ilike: queryWildcard } },
						{ title: { _ilike: queryWildcard } },
						{ path: { _ilike: queryWildcard } },
						{
							owner: {
								full_name: { _ilike: queryWildcard },
							},
						},
						{
							owner: {
								group_name: { _ilike: queryWildcard },
							},
						},
						{
							content_content_labels: {
								content_label: {
									label: {
										_ilike: queryWildcard,
									},
								},
							},
						},
					])
				);
				andFilters.push(...getBooleanFilters(filters, ['is_public']));
				andFilters.push(
					...getDateRangeFilters(filters, [
						'created_at',
						'updated_at',
						'publish_at',
						'depublish_at',
					])
				);
				andFilters.push(
					...getMultiOptionFilters(
						filters,
						['author_user_group', 'content_type', 'user_profile_id', 'labels'],
						[
							'profile.profile_user_group.group.id',
							'content_type',
							'user_profile_id',
							'content_content_labels.content_label.id',
						]
					)
				);

				// When you get to this point we assume you already have either the EDIT_ANY_CONTENT_PAGES or EDIT_OWN_CONTENT_PAGES permission
				if (!hasPerm(EDIT_ANY_CONTENT_PAGES)) {
					// Add filter to only allow the content pages for which the user is the author
					andFilters.push({ user_profile_id: { _eq: get(user, 'profile.id') } });
				}

				andFilters.push({ is_deleted: { _eq: false } });

				return { _and: andFilters };
			};

			const column = tableColumns.find(
				(tableColumn: FilterableColumn) => tableColumn.id || '' === tableState.sort_column
			);
			const columnDataType: string = get(column, 'dataType', '');
			const [contentPagesArray, contentPageCountTemp] =
				await ContentPageService.fetchContentPages(
					tableState.page || 0,
					(tableState.sort_column as ContentOverviewTableCols) || 'updated_at',
					tableState.sort_order || 'desc',
					columnDataType,
					generateWhereObject(getFilters(tableState))
				);

			setContentPages(contentPagesArray);
			setContentPageCount(contentPageCountTemp);
		} catch (err) {
			console.error(
				new CustomError('Failed to get content pages from graphql', err, {
					tableState,
					query: 'GET_CONTENT_PAGES',
				})
			);
			setLoadingInfo({
				state: 'error',
				message: t(
					'admin/content/views/content-overview___het-ophalen-van-de-content-paginas-is-mislukt'
				),
				icon: 'alert-triangle',
			});
		}
		setIsLoading(false);
	}, [tableColumns, tableState, hasPerm, user, t]);

	useEffect(() => {
		fetchContentPages();
	}, [fetchContentPages]);

	useEffect(() => {
		if (contentPages) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [contentPages]);

	// Methods
	const handleDelete = async () => {
		try {
			if (!contentToDelete) {
				return;
			}

			await ContentPageService.deleteContentPage(contentToDelete.id);
			await fetchContentPages();
			Config.getConfig().services.toastService.showToast({
				title: t(
					'modules/admin/content-page/pages/content-page-overview/content-page-overview___success'
				),
				description: t(
					'admin/content/views/content-overview___het-content-item-is-succesvol-verwijderd'
				),
				type: ToastType.ERROR,
			});
		} catch (err) {
			console.error(
				new CustomError('Failed to delete content page', err, { contentToDelete })
			);
			Config.getConfig().services.toastService.showToast({
				title: t(
					'modules/admin/content-page/pages/content-page-overview/content-page-overview___error'
				),
				description: t(
					'admin/content/views/content-overview___het-verwijderen-van-het-content-item-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const openModal = (content: ContentPageInfo): void => {
		if (content.is_protected) {
			// Only allow admins to delete protected content
			if (hasPerm(EDIT_PROTECTED_PAGE_STATUS)) {
				setContentToDelete(content);
				setIsConfirmModalOpen(true);
			} else {
				setIsNotAdminModalOpen(true);
			}
		} else {
			// TODO: check permissions for deleting content
			setContentToDelete(content);
			setIsConfirmModalOpen(true);
		}
	};

	function handlePreviewClicked(page: ContentPageInfo) {
		if (page && page.path) {
			navigateToAbsoluteOrRelativeUrl(page.path, history, LinkTarget.Blank);
		} else {
			Config.getConfig().services.toastService.showToast({
				title: t(
					'modules/admin/content-page/pages/content-page-overview/content-page-overview___error'
				),
				description: t(
					'admin/content/views/content-detail___de-preview-kon-niet-worden-geopend'
				),
				type: ToastType.ERROR,
			});
		}
	}

	// Render
	const renderTableCell = (rowData: any, columnId: ContentOverviewTableCols): ReactNode => {
		const { id, profile, title } = rowData;
		const Link = Config.getConfig().services.router.Link;

		switch (columnId) {
			case 'title':
				return (
					<Link to={buildLink(CONTENT_PATH.CONTENT_PAGE_DETAIL, { id })}>
						{truncateTableValue(title)}
					</Link>
				);

			case 'user_profile_id':
				return getFullName(profile, false, false) || '-';

			case 'author_user_group':
				return profile ? getUserGroupLabel(profile) || '-' : '-';

			case 'content_type':
				return (
					get(
						contentTypes.find((type) => type.value === rowData.content_type),
						'label'
					) || '-'
				);

			case 'is_public':
				return get(rowData, 'is_public') ? 'Ja' : 'Nee';

			case 'labels': {
				const labels = rowData[columnId];
				if (!labels || !labels.length) {
					return '-';
				}
				return (
					<TagList
						tags={labels.map(
							(labelObj: LabelObj): TagOption => ({
								label: labelObj.label,
								id: labelObj.id,
							})
						)}
						swatches={false}
					/>
				);
			}

			case 'user_group_ids': {
				const userGroupIds = rowData[columnId];
				if (!userGroupIds || !userGroupIds.length) {
					return '-';
				}
				return (
					<TagList
						tags={compact(
							userGroupIds.map((userGroupId: number): TagOption | null => {
								const userGroup = userGroups.find(
									(userGroup) => userGroup.id === userGroupId
								);
								if (!userGroup) {
									return null;
								}
								if (userGroup.id === SpecialPermissionGroups.loggedInUsers) {
									return {
										label: t('admin/content/views/content-overview___ingelogd'),
										id: userGroup.id as number,
									};
								}
								if (userGroup.id === SpecialPermissionGroups.loggedOutUsers) {
									return {
										label: t(
											'admin/content/views/content-overview___niet-ingelogd'
										),
										id: userGroup.id as number,
									};
								}
								return {
									label: userGroup.label as string,
									id: userGroup.id as number,
								};
							})
						)}
						swatches={false}
					/>
				);
			}

			case 'published_at':
			case 'publish_at':
			case 'depublish_at':
			case 'created_at':
			case 'updated_at':
				return rowData[columnId] ? formatDate(rowData[columnId] as string) : '-';

			case 'actions':
				return (
					<ButtonToolbar>
						<Link to={buildLink(CONTENT_PATH.CONTENT_PAGE_DETAIL, { id })}>
							<Button
								icon="info"
								size="small"
								title={t('admin/content/views/content-overview___bekijk-content')}
								ariaLabel={t(
									'admin/content/views/content-overview___bekijk-content'
								)}
								type="secondary"
							/>
						</Link>
						<Button
							icon="eye"
							onClick={() => handlePreviewClicked(rowData)}
							size="small"
							title={t('admin/content/views/content-overview___preview-content')}
							ariaLabel={t('admin/content/views/content-overview___preview-content')}
							type="secondary"
						/>
						<Button
							icon={isPublic(rowData) ? 'unlock-3' : 'lock'}
							size="small"
							title={
								isPublic(rowData)
									? t(
											'admin/content/views/content-overview___deze-pagina-is-publiek'
									  )
									: t(
											'admin/content/views/content-overview___deze-pagina-is-prive'
									  )
							}
							type="secondary"
							disabled
						/>
						<Link to={buildLink(CONTENT_PATH.CONTENT_PAGE_EDIT, { id })}>
							<Button
								icon="edit"
								size="small"
								title={t('admin/content/views/content-overview___pas-content-aan')}
								ariaLabel={t(
									'admin/content/views/content-overview___pas-content-aan'
								)}
								type="secondary"
							/>
						</Link>
						{hasPerm(DELETE_ANY_CONTENT_PAGES) && (
							<Button
								icon="delete"
								onClick={() => openModal(rowData)}
								size="small"
								title={t(
									'admin/content/views/content-overview___verwijder-content'
								)}
								ariaLabel={t(
									'admin/content/views/content-overview___verwijder-content'
								)}
								type="danger-hover"
							/>
						)}
					</ButtonToolbar>
				);

			default:
				return truncateTableValue(rowData[columnId] || '-');
		}
	};

	const renderNoResults = () => {
		return <>{t('admin/content/views/content-overview___er-is-nog-geen-content-aangemaakt')}</>;
		// return (
		// <ErrorView
		// 	message={t(
		// 		'admin/content/views/content-overview___er-is-nog-geen-content-aangemaakt'
		// 	)}
		// >
		// 	<p>
		// 		<Trans i18nKey="admin/content/views/content-overview___beschrijving-hoe-content-toe-te-voegen">//  Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores aliquid ab
		//  debitis blanditiis vitae molestiae delectus earum asperiores mollitia,
		//  minima laborum expedita ratione quas impedit repudiandae nisi corrupti quis
		//  eaque!
		//</Trans>
		// 	</p>
		// 	{hasPerm(CREATE_CONTENT_PAGES) && (
		// 		<Spacer margin="top">
		// 			<Button
		// 				icon="plus"
		// 				label={t('admin/content/views/content-overview___content-toevoegen')}
		// 				title={t(
		// 					'admin/content/views/content-overview___maak-een-nieuwe-content-pagina-aan'
		// 				)}
		// 				onClick={() => Config.getConfig().services.router.push(CONTENT_PATH.CONTENT_PAGE_CREATE)}
		// 			/>
		// 		</Spacer>
		// 	)}
		// </ErrorView>
		// );
	};

	const renderContentOverview = () => {
		if (!contentPages) {
			return null;
		}
		return (
			<>
				<FilterTable
					data={contentPages}
					itemsPerPage={ITEMS_PER_PAGE}
					columns={tableColumns}
					dataCount={contentPageCount}
					searchTextPlaceholder={t(
						'admin/content/views/content-overview___zoeken-op-auteur-titel-rol'
					)}
					noContentMatchingFiltersMessage={t(
						'admin/content/views/content-overview___er-is-geen-content-gevonden-die-voldoen-aan-uw-filters'
					)}
					renderNoResults={renderNoResults}
					renderCell={renderTableCell as any}
					className="c-content-overview__table"
					onTableStateChanged={setTableState}
					isLoading={isLoading}
				/>
				<ConfirmModal
					deleteObjectCallback={handleDelete}
					isOpen={isConfirmModalOpen}
					onClose={() => setIsConfirmModalOpen(false)}
					body={
						get(contentToDelete, 'is_protected', null)
							? t(
									'admin/content/views/content-overview___opgelet-dit-is-een-beschermde-pagina'
							  )
							: ''
					}
				/>
				<Modal
					isOpen={isNotAdminModalOpen}
					onClose={() => setIsNotAdminModalOpen(false)}
					size="small"
					title={t(
						'admin/content/views/content-overview___u-heeft-niet-de-juiste-rechten'
					)}
				>
					<ModalBody>
						<p>
							{t(
								'admin/content/views/content-overview___contacteer-een-van-de-admins-om-deze-pagina-te-kunnen-verwijderen'
							)}
						</p>
					</ModalBody>
				</Modal>
			</>
		);
	};

	const Link = Config.getConfig().services.router.Link;
	return (
		<AdminLayout pageTitle={t('admin/content/views/content-overview___content-overzicht')}>
			<AdminLayout.Actions>
				{hasPerm(CREATE_CONTENT_PAGES) && (
					<Link to={CONTENT_PATH.CONTENT_PAGE_CREATE}>
						<Button
							label={t('admin/content/views/content-overview___content-toevoegen')}
							title={t(
								'admin/content/views/content-overview___maak-een-nieuwe-content-pagina-aan'
							)}
						/>
					</Link>
				)}
			</AdminLayout.Actions>
			<AdminLayout.Content>
				<LoadingErrorLoadedComponent
					loadingInfo={loadingInfo}
					dataObject={contentPages}
					render={renderContentOverview}
				/>
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default ContentPageOverview;
