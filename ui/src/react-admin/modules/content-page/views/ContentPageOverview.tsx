import { QueryClient } from '@tanstack/react-query';
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
import { PermissionName } from '@viaa/avo2-types';
import { cloneDeep, compact, get, set } from 'lodash-es';
import React, {
	FunctionComponent,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';

import { useGetContentPagesOverview } from '~modules/content-page/hooks/get-content-pages-overview';
import ConfirmModal from '~modules/shared/components/ConfirmModal/ConfirmModal';
import { PermissionService } from '~modules/shared/services/permission-service';
import { useGetUserGroupsWithPermissions } from '~modules/user-group/hooks/get-user-groups-with-permissions';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import FilterTable, {
	FilterableColumn,
	getFilters,
} from '../../shared/components/FilterTable/FilterTable';

import { isPublic } from '../helpers/get-published-state';
import { useContentTypes } from '../hooks/useContentTypes';
import { ContentPageService } from '../services/content-page.service';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
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
import { formatDate } from '~modules/shared/helpers/formatters/date';
import { buildLink, navigateToAbsoluteOrRelativeUrl } from '~modules/shared/helpers/link';
import { setSelectedCheckboxes } from '~modules/shared/helpers/set-selected-checkboxes';
import { truncateTableValue } from '~modules/shared/helpers/truncate';
import { SpecialPermissionGroups } from '~modules/shared/types/authentication.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { DatabaseType } from '@viaa/avo2-types';

import './ContentPageOverview.scss';
import {
	ContentOverviewTableCols,
	ContentPageInfo,
	ContentTableState,
} from '../types/content-pages.types';
import {
	CONTENT_PAGE_PATH,
	CONTENT_PAGE_QUERY_KEYS,
	GET_OVERVIEW_COLUMNS,
	PAGES_PER_PAGE,
} from '../const/content-page.consts';

const { EDIT_ANY_CONTENT_PAGES, DELETE_ANY_CONTENT_PAGES, EDIT_PROTECTED_PAGE_STATUS } =
	PermissionName;

const ContentPageOverview: FunctionComponent = () => {
	// Hooks
	const [contentToDelete, setContentToDelete] = useState<ContentPageInfo | null>(null);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
	const [isNotAdminModalOpen, setIsNotAdminModalOpen] = useState<boolean>(false);
	const [tableState, setTableState] = useState<Partial<ContentTableState>>({});
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [userGroupOptions] = useUserGroupOptions('CheckboxOption', false) as [
		CheckboxOption[],
		boolean
	];
	const { data: userGroups } = useGetUserGroupsWithPermissions();
	const [contentTypes] = useContentTypes();
	const [contentPageLabelOptions] = useContentPageLabelOptions();

	const { tHtml, tText } = useTranslation();
	const history = AdminConfigManager.getConfig().services.router.useHistory();

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
		return GET_OVERVIEW_COLUMNS(
			contentTypeOptions,
			setSelectedCheckboxes(userGroupOptions, get(tableState, 'user_group', []) as string[]),
			setSelectedCheckboxes(contentPageLabelOptions, get(tableState, 'label', []) as string[])
		);
	}, [contentPageLabelOptions, contentTypeOptions, tableState, userGroupOptions]);

	const getUser = () => AdminConfigManager.getConfig().user;

	const hasPerm = useCallback((permission: PermissionName) => {
		return PermissionService.hasPerm(getUser(), permission);
	}, []);

	const ownerFilter = (queryWildcard: string): any[] => {
		if (
			AdminConfigManager.getConfig().database.databaseApplicationType === DatabaseType.avo
		) {
			return [
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
			];
		}
		return [
			{
				owner_profile: {
					full_name: {
						_ilike: queryWildcard,
					},
				},
			},
			{
				owner_profile: {
					group: {
						label: {
							_ilike: queryWildcard,
						},
					},
				},
			},
		];
	};

	const generateWhereObject = (filters: Partial<ContentTableState>) => {
		const andFilters: any[] = [];
		andFilters.push(
			...getQueryFilter(filters.query, (queryWildcard: string) => [
				{ title: { _ilike: queryWildcard } },
				{ title: { _ilike: queryWildcard } },
				{ path: { _ilike: queryWildcard } },
				...ownerFilter(queryWildcard),
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
		let userGroupPath: string;
		const filtersFormatted: any = cloneDeep(filters);
		if (
			AdminConfigManager.getConfig().database.databaseApplicationType ===
			DatabaseType.hetArchief
		) {
			userGroupPath = 'owner_profile.group_id';
		} else {
			userGroupPath = 'profile.profile_user_group.group.id';
			// Avo group ids are numbers
			set(filtersFormatted, userGroupPath, parseInt(get(filtersFormatted, userGroupPath)));
		}
		andFilters.push(
			...getMultiOptionFilters(
				filtersFormatted,
				['author_user_group', 'content_type', 'user_profile_id', 'labels'],
				[
					userGroupPath,
					'content_type',
					'user_profile_id',
					'content_content_labels.content_label.id',
				]
			)
		);

		// When you get to this point we assume you already have either the EDIT_ANY_CONTENT_PAGES or EDIT_OWN_CONTENT_PAGES permission
		if (!hasPerm(EDIT_ANY_CONTENT_PAGES)) {
			// Add filter to only allow the content pages for which the user is the author
			andFilters.push({ user_profile_id: { _eq: getUser().profileId } });
		}

		andFilters.push({ is_deleted: { _eq: false } });

		return { _and: andFilters };
	};

	const { data: contentPageResponse, isLoading } = useGetContentPagesOverview(
		tableState.page || 0,
		(tableState.sort_column as ContentOverviewTableCols) || 'updated_at',
		tableState.sort_order || 'desc',
		tableColumns.find(
			(tableColumn: FilterableColumn) => tableColumn.id || '' === tableState.sort_column
		)?.dataType || '',
		generateWhereObject(getFilters(tableState))
	);
	const contentPages = contentPageResponse?.[0] || null;
	const contentPageCount = contentPageResponse?.[1] || 0;

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
			const queryClient = new QueryClient();
			await queryClient.invalidateQueries([CONTENT_PAGE_QUERY_KEYS.OVERVIEW]);
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText(
					'modules/admin/content-page/pages/content-page-overview/content-page-overview___success'
				),
				description: tText(
					'admin/content/views/content-overview___het-content-item-is-succesvol-verwijderd'
				),
				type: ToastType.ERROR,
			});
		} catch (err) {
			console.error(
				new CustomError('Failed to delete content page', err, { contentToDelete })
			);
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText(
					'modules/admin/content-page/pages/content-page-overview/content-page-overview___error'
				),
				description: tText(
					'admin/content/views/content-overview___het-verwijderen-van-het-content-item-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const openModal = (content: ContentPageInfo): void => {
		if (content.isProtected) {
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
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText(
					'modules/admin/content-page/pages/content-page-overview/content-page-overview___error'
				),
				description: tText(
					'admin/content/views/content-detail___de-preview-kon-niet-worden-geopend'
				),
				type: ToastType.ERROR,
			});
		}
	}

	// Render
	const renderTableCell = (
		contentPage: ContentPageInfo,
		columnId: ContentOverviewTableCols
	): ReactNode => {
		const { id, owner, title } = contentPage;
		const Link = AdminConfigManager.getConfig().services.router.Link;

		switch (columnId) {
			case 'title':
				return (
					<Link
						to={buildLink(
							CONTENT_PAGE_PATH(AdminConfigManager.getConfig().route_parts).DETAIL,
							{ id }
						)}
					>
						{truncateTableValue(title)}
					</Link>
				);

			case 'userProfileId':
				return owner?.fullName || '-';

			case 'authorUserGroup':
				return owner?.groupName || '-';

			case 'contentType':
				return (
					get(
						contentTypes.find((type) => type.value === contentPage.contentType),
						'label'
					) || '-'
				);

			case 'isPublic':
				return get(contentPage, 'is_public') ? 'Ja' : 'Nee';

			case 'labels': {
				const labels = contentPage[columnId];
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

			case 'userGroupIds': {
				const contentPageUserGroupIds = contentPage[columnId];
				if (!contentPageUserGroupIds || !contentPageUserGroupIds.length) {
					return '-';
				}
				return (
					<TagList
						tags={compact(
							contentPageUserGroupIds.map(
								(contentPageUserGroupId: string): TagOption | null => {
									const userGroup = (userGroups || []).find(
										(userGroup) =>
											userGroup.id === String(contentPageUserGroupId)
									);
									if (!userGroup) {
										return null;
									}
									if (userGroup.id === SpecialPermissionGroups.loggedInUsers) {
										return {
											label: tText(
												'admin/content/views/content-overview___ingelogd'
											),
											id: userGroup.id as string,
										};
									}
									if (userGroup.id === SpecialPermissionGroups.loggedOutUsers) {
										return {
											label: tText(
												'admin/content/views/content-overview___niet-ingelogd'
											),
											id: userGroup.id as string,
										};
									}
									return {
										label: userGroup.label as string,
										id: userGroup.id as string,
									};
								}
							)
						)}
						swatches={false}
					/>
				);
			}

			case 'publishedAt':
			case 'publishAt':
			case 'depublishAt':
			case 'createdAt':
			case 'updatedAt':
				return contentPage[columnId] ? formatDate(contentPage[columnId] as string) : '-';

			case 'actions':
				return (
					<ButtonToolbar>
						<Link
							to={buildLink(
								CONTENT_PAGE_PATH(AdminConfigManager.getConfig().route_parts)
									.DETAIL,
								{ id }
							)}
						>
							<Button
								icon="info"
								size="small"
								title={tText(
									'admin/content/views/content-overview___bekijk-content'
								)}
								ariaLabel={tText(
									'admin/content/views/content-overview___bekijk-content'
								)}
								type="secondary"
							/>
						</Link>
						<Button
							icon="eye"
							onClick={() => handlePreviewClicked(contentPage)}
							size="small"
							title={tText('admin/content/views/content-overview___preview-content')}
							ariaLabel={tText(
								'admin/content/views/content-overview___preview-content'
							)}
							type="secondary"
						/>
						<Button
							icon={isPublic(contentPage) ? 'unlock-3' : 'lock'}
							size="small"
							title={
								isPublic(contentPage)
									? tText(
											'admin/content/views/content-overview___deze-pagina-is-publiek'
									  )
									: tText(
											'admin/content/views/content-overview___deze-pagina-is-prive'
									  )
							}
							type="secondary"
							disabled
						/>
						<Link
							to={buildLink(
								CONTENT_PAGE_PATH(AdminConfigManager.getConfig().route_parts).EDIT,
								{ id }
							)}
						>
							<Button
								icon="edit"
								size="small"
								title={tText(
									'admin/content/views/content-overview___pas-content-aan'
								)}
								ariaLabel={tText(
									'admin/content/views/content-overview___pas-content-aan'
								)}
								type="secondary"
							/>
						</Link>
						{hasPerm(DELETE_ANY_CONTENT_PAGES) && (
							<Button
								icon="delete"
								onClick={() => openModal(contentPage)}
								size="small"
								title={tText(
									'admin/content/views/content-overview___verwijder-content'
								)}
								ariaLabel={tText(
									'admin/content/views/content-overview___verwijder-content'
								)}
								type="danger-hover"
							/>
						)}
					</ButtonToolbar>
				);

			default:
				return truncateTableValue(contentPage[columnId] || '-');
		}
	};

	const renderNoResults = () => {
		return (
			<>{tText('admin/content/views/content-overview___er-is-nog-geen-content-aangemaakt')}</>
		);
		// return (
		// <ErrorView
		// 	message={tText(
		// 		'admin/content/views/content-overview___er-is-nog-geen-content-aangemaakt'
		// 	)}
		// >
		// 	<p>
		// 		{tHtml('admin/content/views/content-overview___beschrijving-hoe-content-toe-te-voegen')}
		// 	</p>
		// 	{hasPerm(CREATE_CONTENT_PAGES) && (
		// 		<Spacer margin="top">
		// 			<Button
		// 				icon="plus"
		// 				label={tText('admin/content/views/content-overview___content-toevoegen')}
		// 				title={tText(
		// 					'admin/content/views/content-overview___maak-een-nieuwe-content-pagina-aan'
		// 				)}
		// 				onClick={() => Config.getConfig().services.router.push(CONTENT_PAGE_PATH(AdminConfigManager.getConfig().route_parts).CREATE)}
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
					itemsPerPage={PAGES_PER_PAGE}
					columns={tableColumns}
					dataCount={contentPageCount}
					searchTextPlaceholder={tText(
						'admin/content/views/content-overview___zoeken-op-auteur-titel-rol'
					)}
					noContentMatchingFiltersMessage={tText(
						'admin/content/views/content-overview___er-is-geen-content-gevonden-die-voldoen-aan-uw-filters'
					)}
					renderNoResults={renderNoResults}
					renderCell={renderTableCell as any}
					className="c-content-overview__table"
					onTableStateChanged={(newState) => {
						setTableState(newState);
					}}
					isLoading={isLoading}
				/>
				<ConfirmModal
					deleteObjectCallback={handleDelete}
					isOpen={isConfirmModalOpen}
					onClose={() => setIsConfirmModalOpen(false)}
					body={
						get(contentToDelete, 'is_protected', null)
							? tHtml(
									'admin/content/views/content-overview___opgelet-dit-is-een-beschermde-pagina'
							  )
							: ''
					}
				/>
				<Modal
					isOpen={isNotAdminModalOpen}
					onClose={() => setIsNotAdminModalOpen(false)}
					size="small"
					title={tText(
						'admin/content/views/content-overview___u-heeft-niet-de-juiste-rechten'
					)}
				>
					<ModalBody>
						<p>
							{tHtml(
								'admin/content/views/content-overview___contacteer-een-van-de-admins-om-deze-pagina-te-kunnen-verwijderen'
							)}
						</p>
					</ModalBody>
				</Modal>
			</>
		);
	};

	return (
		<LoadingErrorLoadedComponent
			loadingInfo={loadingInfo}
			dataObject={contentPages}
			render={renderContentOverview}
		/>
	);
};

export default ContentPageOverview;
