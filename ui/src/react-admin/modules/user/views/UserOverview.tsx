import type { IconName, TagInfo, TagOption } from '@viaa/avo2-components';
import { TagList } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { LomSchemeType } from '@viaa/avo2-types';
import { compact, isNil } from 'lodash-es';
import type { FC, ReactText } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { Icon } from '~shared/components/Icon';
import ActionsDropdown from '~modules/shared/components/ActionsDropdown/ActionsDropdown';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import {
	generateWhereObjectArchief,
	generateWhereObjectAvo,
} from '~modules/user/helpers/generate-filter-where-object-users';
import { hasTempAccess } from '~modules/user/helpers/has-temp-access';
import { useGetProfiles } from '~modules/user/hooks/use-get-profiles';
import { GET_USER_BULK_ACTIONS, GET_USER_OVERVIEW_TABLE_COLS } from '~modules/user/user.consts';
import { UserService } from '~modules/user/user.service';
import type { AddOrRemove } from '~shared/components/AddOrRemoveLinkedElementsModal/AddOrRemoveLinkedElementsModal';
import AddOrRemoveLinkedElementsModal from '~shared/components/AddOrRemoveLinkedElementsModal/AddOrRemoveLinkedElementsModal';
import type { CheckboxOption } from '~shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { ErrorView } from '~shared/components/error';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { CustomError } from '~shared/helpers/custom-error';
import { formatDateString } from '~shared/helpers/formatters/date';
import { idpMapsToTagList } from '~shared/helpers/idps-to-taglist';
import { isAvo } from '~shared/helpers/is-avo';
import { isHetArchief } from '~shared/helpers/is-hetarchief';
import { buildLink, navigate } from '~shared/helpers/link';
import { setSelectedCheckboxes } from '~shared/helpers/set-selected-checkboxes';
import { showToast } from '~shared/helpers/show-toast';
import { stringsToTagList } from '~shared/helpers/strings-to-taglist';

import { tHtml, tText } from '~shared/helpers/translation-functions';
import { truncateTableValue } from '~shared/helpers/truncate';
import { useGetIdps } from '~shared/hooks/use-get-idps';
import { useBusinessCategories } from '~shared/hooks/useBusinessCategory';
import { useCompaniesWithUsers } from '~shared/hooks/useCompanies';
import { useEducationLevels } from '~shared/hooks/useEducationLevels';
import { useSubjects } from '~shared/hooks/useSubjects';

import { SettingsService } from '~shared/services/settings-service/settings.service';

import type { FilterableColumn } from '~shared/components/FilterTable/FilterTable';
import FilterTable, { getFilters } from '../../shared/components/FilterTable/FilterTable';
import UserDeleteModal from '../components/UserDeleteModal';
import type { Idp, UserOverviewTableCol, UserTableState } from '../user.types';
import { UserBulkAction, USERS_PER_PAGE } from '../user.types';
import { ExportAllToCsvModal } from '~shared/components/ExportAllToCsvModal/ExportAllToCsvModal';

import './UserOverview.scss';

export interface UserOverviewProps {
	customFormatDate?: (date: Date | string) => string;
	commonUser: Avo.User.CommonUser;
}

export const UserOverview: FC<UserOverviewProps> = ({ customFormatDate, commonUser }) => {
	// Hooks
	const history = AdminConfigManager.getConfig().services.router.useHistory();

	const [tableState, setTableState] = useState<Partial<UserTableState> | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);
	const [companies] = useCompaniesWithUsers();
	const [businessCategories] = useBusinessCategories();
	const [educationLevels] = useEducationLevels();
	const [subjects] = useSubjects();
	const { data: idps } = useGetIdps();
	const [userGroupOptions] = useUserGroupOptions('CheckboxOption', false, false);
	const [usersDeleteModalOpen, setUsersDeleteModalOpen] = useState<boolean>(false);
	const [changeSubjectsModalOpen, setChangeSubjectsModalOpen] = useState<boolean>(false);
	const [allSubjects, setAllSubjects] = useState<string[]>([]);
	const [exportType, setExportType] = useState<
		UserBulkAction.EXPORT_SELECTION | UserBulkAction.EXPORT_ALL | null
	>(null);

	const bulkActions = AdminConfigManager.getConfig().users?.bulkActions || [];

	const columns = useMemo(
		() =>
			GET_USER_OVERVIEW_TABLE_COLS({
				commonUser,
				userGroupOptions: setSelectedCheckboxes(
					userGroupOptions as CheckboxOption[],
					(tableState?.userGroup ?? []) as string[]
				),
				companyOptions: companies.map(
					(option: Partial<Avo.Organization.Organization>): CheckboxOption => ({
						id: option.or_id as string,
						label: option.name as string,
						checked: ((tableState?.organisation ?? []) as string[]).includes(
							String(option.or_id)
						),
					})
				),
				businessCategoryOptions: businessCategories.map(
					(option: string): CheckboxOption => ({
						id: option,
						label: option,
						checked: ((tableState?.businessCategory ?? []) as string[]).includes(
							option
						),
					})
				),
				educationLevels: setSelectedCheckboxes(
					educationLevels,
					(tableState?.educationLevels ?? []) as string[]
				),
				subjects: setSelectedCheckboxes(subjects, (tableState?.subjects ?? []) as string[]),
				idps: setSelectedCheckboxes(idps || [], (tableState?.idps ?? []) as string[]),
			}),
		[
			businessCategories,
			companies,
			educationLevels,
			idps,
			subjects,
			tableState,
			userGroupOptions,
			commonUser,
		]
	);

	const generateWhereObject = useCallback(
		(filters: Partial<UserTableState> | null, onlySelectedProfiles: boolean): any | null => {
			if (!filters) {
				return null;
			}
			let whereObj;
			if (isHetArchief()) {
				whereObj = generateWhereObjectArchief(
					filters,
					onlySelectedProfiles,
					selectedProfileIds
				);
			} else {
				whereObj = generateWhereObjectAvo(
					filters,
					onlySelectedProfiles,
					selectedProfileIds
				); // TODO avo and split
			}
			if (JSON.stringify(whereObj) === '{"_and":[]}') {
				return null;
			}
			return whereObj;
		},
		[selectedProfileIds]
	);

	const getColumnType = useCallback((): string => {
		const column = columns.find((tableColumn: FilterableColumn) => {
			return (
				!!tableColumn?.id &&
				!!tableState?.sort_column &&
				tableColumn?.id === tableState?.sort_column
			);
		});
		return column?.dataType || '';
	}, [tableState, columns]);

	const {
		data: profilesResponse,
		isLoading: isLoadingProfiles,
		isError: isErrorProfiles,
		refetch: refetchProfiles,
	} = useGetProfiles({
		page: tableState?.page || 0,
		sortColumn: (tableState?.sort_column || 'last_access_at') as UserOverviewTableCol,
		sortOrder: tableState?.sort_order || 'desc',
		tableColumnDataType: getColumnType(),
		where: generateWhereObject(getFilters(tableState), false),
		itemsPerPage: USERS_PER_PAGE,
	});
	const profiles = profilesResponse?.[0] || null;
	const profileCount = profilesResponse?.[1] || null;

	const bulkChangeSubjects = async (addOrRemove: AddOrRemove, subjects: string[]) => {
		try {
			if (!selectedProfileIds || !selectedProfileIds.length) {
				return;
			}

			if (addOrRemove === 'add') {
				await UserService.bulkAddSubjectsToProfiles(subjects, compact(selectedProfileIds));
				showToast({
					title: tText('modules/user/views/user-overview___success'),
					description: tText(
						'admin/users/views/user-overview___de-vakken-zijn-toegevoegd-aan-de-geselecteerde-gebruikers'
					),
					type: ToastType.SUCCESS,
				});
			} else {
				// remove
				await UserService.bulkRemoveSubjectsFromProfiles(
					subjects,
					compact(selectedProfileIds)
				);
				showToast({
					title: tText('modules/user/views/user-overview___success'),
					description: tText(
						'admin/users/views/user-overview___de-vakken-zijn-verwijderd-van-de-geselecteerde-gebruikers'
					),
					type: ToastType.SUCCESS,
				});
			}
		} catch (err) {
			console.error(
				new CustomError('Failed to bulk update subjects of user profiles', err, {
					addOrRemove,
					subjects,
				})
			);
			showToast({
				title: tText('modules/user/views/user-overview___error'),
				description: tText(
					'admin/users/views/user-overview___het-aanpassen-van-de-vakken-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const setAllProfilesAsSelected = async () => {
		setIsLoading(true);
		try {
			const profileIds = await UserService.getProfileIds(
				generateWhereObject(getFilters(tableState), false)
			);
			const numOfSelectedProfiles = String(profileIds.length);
			showToast({
				title: tText('modules/user/views/user-overview___success'),
				description: tText(
					'admin/users/views/user-overview___je-hebt-num-of-selected-profiles-gebruikers-geselecteerd',
					{
						numOfSelectedProfiles,
					}
				),
				type: ToastType.SUCCESS,
			});
			setSelectedProfileIds(profileIds);
		} catch (err) {
			console.error(
				new CustomError(
					'Failed to fetch all profile ids that adhere to the selected filters',
					err,
					{ tableState }
				)
			);

			showToast({
				title: tText('modules/user/views/user-overview___error'),
				description: tText(
					'admin/users/views/user-overview___het-ophalen-van-alle-geselecteerde-gebruiker-ids-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}

		setIsLoading(false);
	};

	/**
	 * Blocks or unblocks all users in the selectedProfileIds list
	 * @param blockOrUnblock set true for block and false for unblock
	 */
	const bulkUpdateBlockStatus = async (blockOrUnblock: boolean) => {
		try {
			setIsLoading(true);
			await UserService.updateBlockStatusByProfileIds(
				selectedProfileIds,
				blockOrUnblock,
				false // TODO sync sendEmail feature
			);
			await refetchProfiles();
			showToast({
				title: tText('modules/user/views/user-overview___success'),
				description: tText(
					blockOrUnblock
						? 'admin/users/views/user-overview___de-geselecteerde-gebruikers-zijn-geblokkeerd'
						: 'admin/users/views/user-overview___de-geselecteerde-gebruikers-zijn-gedeblokkeerd'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			showToast({
				title: tText('modules/user/views/user-overview___error'),
				description: tText(
					'admin/users/views/user-overview___het-blokkeren-van-de-geselecteerde-gebruikers-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
		setIsLoading(false);
	};

	const navigateFilterToOption = (columnId: string) => (tagId: ReactText) => {
		navigate(
			history,
			AdminConfigManager.getAdminRoute('ADMIN_USER_OVERVIEW'),
			{},
			{ [columnId]: tagId.toString(), columns: (tableState?.columns || []).join('~') }
		);
	};

	const handleBulkAction = async (action: UserBulkAction): Promise<void> => {
		const hasSelectedRows = (selectedProfileIds?.length || 0) > 0;

		switch (action) {
			case UserBulkAction.EXPORT_SELECTION:
				if (!hasSelectedRows) return;
				setExportType(UserBulkAction.EXPORT_SELECTION);
				return;

			case UserBulkAction.EXPORT_ALL:
				setExportType(UserBulkAction.EXPORT_ALL);
				return;

			case UserBulkAction.BLOCK:
				if (!hasSelectedRows) return;
				await bulkUpdateBlockStatus(true);
				return;

			case UserBulkAction.UNBLOCK:
				if (!hasSelectedRows) return;
				await bulkUpdateBlockStatus(false);
				return;

			case UserBulkAction.DELETE:
				if (!hasSelectedRows) return;
				setUsersDeleteModalOpen(true);
				return;

			case UserBulkAction.CHANGE_SUBJECTS:
				if (!hasSelectedRows) return;
				setChangeSubjectsModalOpen(true);
				SettingsService.fetchSubjects()
					.then((subjects: string[]) => {
						setAllSubjects(subjects);
					})
					.catch((err: any) => {
						console.error(
							new CustomError('Failed to get subjects from the database', err)
						);
						showToast({
							title: tText('modules/user/views/user-overview___error'),
							description: tText(
								'settings/components/profile___het-ophalen-van-de-vakken-is-mislukt'
							),
							type: ToastType.ERROR,
						});
					});
				return;
		}
	};

	const handleOptionClicked = (profileId: string) => {
		navigator.clipboard.writeText(profileId);
		showToast({
			title: tText('modules/user/views/user-overview___success'),
			description: tText('admin/users/views/user-overview___uuid-gekopieerd'),
			type: ToastType.SUCCESS,
		});
	};

	const renderTableCell = (
		tableRowCommonUser: Avo.User.CommonUser,
		columnId: UserOverviewTableCol
	) => {
		const isBlocked = tableRowCommonUser?.isBlocked;
		const isKeyUser = (tableRowCommonUser as any)?.isKeyUser ?? false;

		switch (columnId) {
			case 'fullName':
				// no user detail for archief yet
				return isAvo() ? (
					<Link
						to={buildLink(AdminConfigManager.getAdminRoute('ADMIN_USER_DETAIL'), {
							id: tableRowCommonUser.profileId,
						})}
					>
						{truncateTableValue(tableRowCommonUser?.fullName)}
					</Link>
				) : (
					truncateTableValue(tableRowCommonUser?.fullName)
				);

			case 'email':
				return truncateTableValue(tableRowCommonUser?.email);

			case 'isBlocked':
				return isBlocked ? 'Ja' : 'Nee';

			case 'isKeyUser':
				return isKeyUser ? 'Ja' : 'Nee';

			case 'blockedAt':
				return formatDateString(tableRowCommonUser?.blockedAt) || '-';

			case 'unblockedAt':
				return formatDateString(tableRowCommonUser?.unblockedAt) || '-';

			case 'isException':
				return tableRowCommonUser?.isException ? 'Ja' : 'Nee';

			case 'organisation':
				return tableRowCommonUser?.organisation?.name || '-';

			case 'createdAt':
				return formatDateString(tableRowCommonUser.createdAt) || '-';

			case 'lastAccessAt': {
				const lastAccessDate = tableRowCommonUser?.lastAccessAt;
				return !isNil(lastAccessDate)
					? customFormatDate
						? customFormatDate(lastAccessDate)
						: formatDateString(lastAccessDate)
					: '-';
			}
			case 'tempAccess': {
				if (hasTempAccess(tableRowCommonUser?.tempAccess)) {
					return tHtml('admin/users/views/user-overview___tijdelijke-toegang-ja');
				} else {
					return tHtml('admin/users/views/user-overview___tijdelijke-toegang-nee');
				}
			}
			case 'tempAccessFrom':
				return formatDateString(tableRowCommonUser?.tempAccess?.from) || '-';

			case 'tempAccessUntil':
				return formatDateString(tableRowCommonUser?.tempAccess?.until) || '-';

			case 'idps':
				return (
					idpMapsToTagList(
						Object.keys(tableRowCommonUser?.idps || {}) as Idp[],
						`user_${tableRowCommonUser?.profileId}`,
						navigateFilterToOption(columnId)
					) || '-'
				);

			case 'educationLevels': {
				const labels = compact(
					(tableRowCommonUser?.loms ?? [])
						.filter((lom) => lom.lom?.scheme === LomSchemeType.structure)
						.map((lom) => lom.lom?.label)
				);
				return stringsToTagList(labels, null, navigateFilterToOption(columnId)) || '-';
			}

			case 'subjects': {
				const labels = compact(
					(tableRowCommonUser?.loms ?? [])
						.filter((lom) => lom.lom?.scheme === LomSchemeType.subject)
						.map((lom) => lom.lom?.label)
				);
				return stringsToTagList(labels, null, navigateFilterToOption(columnId)) || '-';
			}

			case 'educationalOrganisations': {
				const orgs: Avo.EducationOrganization.Organization[] =
					tableRowCommonUser.educationalOrganisations ?? [];
				const tags = orgs.map(
					(org): TagOption => ({
						id: `${org.organisationId}:${org.unitId || ''}`,
						label: org.organisationLabel || org.unitId || org.organisationId,
					})
				);
				return (
					<TagList
						tags={tags}
						swatches={false}
						onTagClicked={navigateFilterToOption(columnId)}
					/>
				);
			}

			case 'userGroup':
				return truncateTableValue(
					tableRowCommonUser.userGroup?.label || tableRowCommonUser.userGroup?.name || '-'
				);

			case 'actions':
				return (
					<ActionsDropdown
						menuItems={[
							{
								id: tableRowCommonUser.profileId || '',
								label:
									tableRowCommonUser.profileId ||
									tText('admin/users/views/user-overview___geen-uuid'),
								iconEnd: <Icon name="copy" />,
							},
						]}
						onOptionClicked={() => handleOptionClicked(tableRowCommonUser.profileId)}
					/>
				);

			default:
				return truncateTableValue(tableRowCommonUser[columnId] || '-');
		}
	};

	const renderNoResults = () => {
		return (
			<ErrorView
				message={tHtml('admin/users/views/user-overview___er-bestaan-nog-geen-gebruikers')}
			>
				<p>
					{tHtml(
						'admin/users/views/user-overview___beschrijving-wanneer-er-nog-geen-gebruikers-zijn'
					)}{' '}
					// Beschrijving wanneer er nog geen gebruikers zijn
				</p>
			</ErrorView>
		);
	};

	const renderUserOverview = () => {
		return (
			<>
				<FilterTable
					columns={columns}
					data={profiles || []}
					dataCount={profileCount || 0}
					renderCell={(rowData: Avo.User.CommonUser, columnId: string) =>
						renderTableCell(rowData, columnId as UserOverviewTableCol)
					}
					searchTextPlaceholder={tText(
						'admin/users/views/user-overview___zoek-op-naam-email-alias'
					)}
					noContentMatchingFiltersMessage={tText(
						'admin/users/views/user-overview___er-zijn-geen-gebruikers-doe-voldoen-aan-de-opgegeven-filters'
					)}
					itemsPerPage={USERS_PER_PAGE}
					onTableStateChanged={(newState) => {
						setTableState(newState);
					}}
					renderNoResults={renderNoResults}
					isLoading={isLoading}
					showCheckboxes={!!bulkActions.length}
					selectedItemIds={selectedProfileIds}
					onSelectionChanged={setSelectedProfileIds as (ids: ReactText[]) => void}
					onSelectAll={setAllProfilesAsSelected}
					onSelectBulkAction={handleBulkAction as any}
					bulkActions={GET_USER_BULK_ACTIONS(
						commonUser,
						bulkActions,
						selectedProfileIds?.length > 0
					)}
					rowKey={(row: Avo.User.CommonUser) =>
						row?.profileId || row?.userId || row?.email || ''
					}
					className="u-spacer-bottom-l u-useroverview-table"
					searchInputAriaLabel={tText(
						'modules/user/views/user-overview___zoek-input-aria-label'
					)}
				/>
				<UserDeleteModal
					selectedProfileIds={selectedProfileIds}
					isOpen={usersDeleteModalOpen}
					onClose={() => setUsersDeleteModalOpen(false)}
					deleteCallback={refetchProfiles}
				/>
				<AddOrRemoveLinkedElementsModal
					title={tText('admin/users/views/user-overview___vakken-aanpassen')}
					addOrRemoveLabel={tText(
						'admin/users/views/user-overview___vakken-toevoegen-of-verwijderen'
					)}
					contentLabel={tText('admin/users/views/user-overview___vakken')}
					isOpen={changeSubjectsModalOpen}
					onClose={() => setChangeSubjectsModalOpen(false)}
					labels={allSubjects.map((subject) => ({
						label: subject,
						value: subject,
					}))}
					callback={(addOrRemove: AddOrRemove, tags: TagInfo[]) =>
						bulkChangeSubjects(
							addOrRemove,
							tags.map((tag) => tag.value.toString())
						)
					}
				/>
				<ExportAllToCsvModal
					title={tText(
						'modules/user/views/user-overview___exporteren-van-alle-gebruikers-naar-csv'
					)}
					isOpen={exportType !== null}
					onClose={() => setExportType(null)}
					fetchingItemsLabel={tText(
						'modules/user/views/user-overview___bezig-met-ophalen-van-gebruikers'
					)}
					generatingCsvLabel={tText(
						'modules/user/views/user-overview___bezig-met-genereren-van-de-csv'
					)}
					fetchTotalItems={async () => {
						const where =
							exportType === UserBulkAction.EXPORT_ALL
								? {}
								: generateWhereObject(getFilters(tableState), true);
						const response = await UserService.getProfiles(
							0,
							0,
							(tableState?.sort_column || 'last_access_at') as UserOverviewTableCol,
							tableState?.sort_order || 'desc',
							getColumnType(),
							where
						);
						return response[1];
					}}
					fetchMoreItems={async (offset: number, limit: number) => {
						const where =
							exportType === UserBulkAction.EXPORT_ALL
								? {}
								: generateWhereObject(getFilters(tableState), true);
						const response = await UserService.getProfiles(
							offset,
							limit,
							(tableState?.sort_column || 'last_access_at') as UserOverviewTableCol,
							tableState?.sort_order || 'desc',
							getColumnType(),
							where
						);
						return response[0];
					}}
					renderValue={(value: any, columnId: string) =>
						renderTableCell(value as any, columnId as UserOverviewTableCol)
					}
					columns={compact(
						columns
							.filter((column) => column.id !== 'actions')
							.map((column) => {
								const label = column.label || column.tooltip;
								if (!label) {
									return null;
								}
								return { label, id: column.id };
							})
					)}
					exportFileName={tText('modules/user/views/user-overview___gebruikers-csv')}
				/>
			</>
		);
	};

	if (isLoadingProfiles) {
		return <CenteredSpinner />;
	}
	if (isErrorProfiles) {
		return (
			<ErrorView
				message={tHtml(
					'admin/users/views/user-overview___het-ophalen-van-de-gebruikers-is-mislukt'
				)}
				icon={'alertTriangle' as IconName}
				actionButtons={['home', 'helpdesk']}
			/>
		);
	}
	return renderUserOverview();
};
