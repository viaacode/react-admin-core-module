import {
	Button,
	ButtonToolbar,
	IconName,
	LinkTarget,
	Modal,
	ModalBody,
	Spacer,
	TagList,
	TagOption,
} from '@viaa/avo2-components';
import { PermissionName } from '@viaa/avo2-types';
import type { Avo } from '@viaa/avo2-types';
import { cloneDeep, compact, get, set } from 'lodash-es';
import React, {
	FunctionComponent,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { LabelObj } from '~content-blocks/BlockPageOverview/BlockPageOverview.types';
import Link from '~shared/components/Link/Link';
import { useGetContentPagesOverview } from '~modules/content-page/hooks/get-content-pages-overview';
import ConfirmModal from '~shared/components/ConfirmModal/ConfirmModal';
import { formatDateString } from '~shared/helpers/formatters/date';
import { isAvo } from '~shared/helpers/is-avo';
import { isHetArchief } from '~shared/helpers/is-hetarchief';
import { PermissionService } from '~shared/services/permission-service';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import { UserGroupWithPermissions } from '~modules/user-group/types/user-group.types';
import FilterTable, {
	FilterableColumn,
	getFilters,
} from '../../shared/components/FilterTable/FilterTable';

import { isPublic } from '~modules/content-page/helpers';
import { useContentTypes } from '../hooks/useContentTypes';
import { ContentPageService } from '../services/content-page.service';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { useContentPageLabelOptions } from '~modules/content-page-labels/hooks/useContentPageLabelOptions';
import { CheckboxOption } from '~shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from '~shared/helpers/custom-error';
import {
	getBooleanFilters,
	getDateRangeFilters,
	getMultiOptionFilters,
	getQueryFilter,
} from '~shared/helpers/filters';
import { buildLink, navigateToAbsoluteOrRelativeUrl } from '~shared/helpers/link';
import { setSelectedCheckboxes } from '~shared/helpers/set-selected-checkboxes';
import { truncateTableValue } from '~shared/helpers/truncate';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';
import { useTranslation } from '~shared/hooks/useTranslation';

import './ContentPageOverview.scss';
import {
	ContentOverviewTableCols,
	ContentPageInfo,
	ContentTableState,
} from '../types/content-pages.types';
import { GET_OVERVIEW_COLUMNS, PAGES_PER_PAGE } from '../const/content-page.consts';
import { ErrorView } from '~shared/components/error';

const { EDIT_ANY_CONTENT_PAGES, DELETE_ANY_CONTENT_PAGES, EDIT_PROTECTED_PAGE_STATUS } =
	PermissionName;

interface ContentPageOverviewProps {
	commonUser?: Avo.User.CommonUser;
}

const ContentPageOverview: FunctionComponent<ContentPageOverviewProps> = ({ commonUser }) => {
	// Hooks
	const [contentToDelete, setContentToDelete] = useState<ContentPageInfo | null>(null);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
	const [isNotAdminModalOpen, setIsNotAdminModalOpen] = useState<boolean>(false);
	const [tableState, setTableState] = useState<Partial<ContentTableState>>({});
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [userGroupOptions, userGroups] = useUserGroupOptions('CheckboxOption', false, true) as [
		CheckboxOption[],
		UserGroupWithPermissions[],
		boolean,
	];
	const [contentTypes] = useContentTypes();
	const [contentPageLabelOptions] = useContentPageLabelOptions();

	const { tHtml, tText } = useTranslation();
	const history = AdminConfigManager.getConfig().services.router.useHistory();

	const contentTypeOptions = useMemo(() => {
		return contentTypes.map(
			(option): CheckboxOption => ({
				id: option.value,
				label: option.label,
				checked: (tableState?.contentType || ([] as string[])).includes(option.value),
			})
		);
	}, [contentTypes, tableState]);

	const tableColumns = useMemo(() => {
		return GET_OVERVIEW_COLUMNS(
			contentTypeOptions,
			setSelectedCheckboxes(
				userGroupOptions,
				(tableState?.userGroup || []).map((userGroup) => String(userGroup)) as string[]
			),
			setSelectedCheckboxes(
				contentPageLabelOptions,
				(tableState?.labels || []).map((label) => String(label)) as string[]
			)
		);
	}, [contentPageLabelOptions, contentTypeOptions, tableState, userGroupOptions]);

	const hasPerm = useCallback(
		(permission: PermissionName) => {
			return PermissionService.hasPerm(commonUser, permission);
		},
		[commonUser]
	);

	const ownerFilter = (queryWildcard: string): any[] => {
		if (isAvo()) {
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
		andFilters.push(...getBooleanFilters(filters, ['isPublic'], ['is_public']));
		andFilters.push(
			...getDateRangeFilters(
				filters,
				['createdAt', 'updatedAt', 'publishAt', 'depublishAt'],
				['created_at', 'updated_at', 'publish_at', 'depublish_at']
			)
		);
		let userGroupPath: string;
		const filtersFormatted: any = cloneDeep(filters);
		if (isHetArchief()) {
			userGroupPath = 'owner_profile.group_id';
		} else {
			userGroupPath = 'profile.profile_user_group.group.id';
			// Avo group ids are numbers
			set(filtersFormatted, userGroupPath, parseInt(get(filtersFormatted, userGroupPath)));
		}
		andFilters.push(
			...getMultiOptionFilters(
				filtersFormatted,
				['authorUserGroup', 'contentType', 'userProfileId', 'labels'],
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
			andFilters.push({ user_profile_id: { _eq: commonUser?.profileId } });
		}

		andFilters.push({ is_deleted: { _eq: false } });

		// Special case for user group ids => need to be converted to numbers for avo // TODO at some point change user group ids to uuids
		const userGroupIdsFilter = andFilters.find(
			(andFilter) => !!andFilter?.profile?.profile_user_group?.group?.id?._in
		);
		if (userGroupIdsFilter) {
			userGroupIdsFilter.profile.profile_user_group.group.id._in =
				userGroupIdsFilter.profile.profile_user_group.group.id._in.map((id: string) =>
					parseInt(id, 10)
				);
		}

		return { _and: andFilters };
	};

	const {
		data: contentPageResponse,
		isLoading,
		refetch: refetchContentPages,
	} = useGetContentPagesOverview({
		page: tableState.page || 0,
		sortColumn: (tableState.sort_column as ContentOverviewTableCols) || 'updated_at',
		sortOrder: tableState.sort_order || 'desc',
		tableColumnDataType:
			tableColumns.find(
				(tableColumn: FilterableColumn) => tableColumn.id || '' === tableState.sort_column
			)?.dataType || '',
		where: generateWhereObject(getFilters(tableState)),
	});
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
			await refetchContentPages();
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText(
					'modules/admin/content-page/pages/content-page-overview/content-page-overview___success'
				),
				description: tText(
					'admin/content/views/content-overview___het-content-item-is-succesvol-verwijderd'
				),
				type: ToastType.SUCCESS,
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

		switch (columnId) {
			case 'title':
				return (
					<Link
						to={buildLink(
							AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_DETAIL'),
							{
								id,
							}
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
				return contentPage?.isPublic ? 'Ja' : 'Nee';

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
				return contentPage[columnId]
					? formatDateString(contentPage[columnId] as string)
					: '-';

			case 'actions':
				return (
					<ButtonToolbar>
						<Link
							to={buildLink(
								AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_DETAIL'),
								{
									id,
								}
							)}
						>
							<Button
								icon={'info' as IconName}
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
							icon={'eye' as IconName}
							onClick={() => handlePreviewClicked(contentPage)}
							size="small"
							title={tText('admin/content/views/content-overview___preview-content')}
							ariaLabel={tText(
								'admin/content/views/content-overview___preview-content'
							)}
							type="secondary"
						/>
						<Button
							icon={
								isPublic(contentPage)
									? ('unlock3' as IconName)
									: ('lock' as IconName)
							}
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
								AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_EDIT'),
								{
									id,
								}
							)}
						>
							<Button
								icon={'edit' as IconName}
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
								icon={'delete' as IconName}
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
			<ErrorView
				message={tText(
					'admin/content/views/content-overview___er-is-nog-geen-content-aangemaakt'
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
						<Link to={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_CREATE')}>
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
	};

	const renderContentOverview = () => {
		return (
			<>
				<FilterTable
					data={contentPages || []}
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
						contentToDelete?.isProtected || null
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
