import FileSaver from 'file-saver';
import { compact, get, isNil } from 'lodash-es';
import React, { FC, ReactText, useCallback, useMemo, useState } from 'react';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { ErrorView } from '~modules/shared/components/error';
import { CenteredSpinner } from '~modules/shared/components/Spinner/CenteredSpinner';
import { isHetArchief } from '~modules/shared/helpers/is-hetarchief';
import { useGetIdps } from '~modules/shared/hooks/use-get-idps';

import { useTranslation } from '~modules/shared/hooks/useTranslation';

import reactToString from 'react-to-string';

import { TagInfo, TagList, TagOption } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import {
	generateWhereObjectArchief,
	generateWhereObjectAvo,
} from '~modules/user/helpers/generate-filter-where-object-users';
import { useGetProfiles } from '~modules/user/hooks/use-get-profiles';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';

import FilterTable, {
	FilterableColumn,
	getFilters,
} from '../../shared/components/FilterTable/FilterTable';
import { UserService } from '~modules/user/user.service';
import {
	CommonUser,
	Idp,
	UserBulkAction,
	UserOverviewTableCol,
	USERS_PER_PAGE,
	UserTableState,
} from '../user.types';

import './UserOverview.scss';
import { SettingsService } from '~modules/shared/services/settings-service/settings.service';
import { CheckboxOption } from '~modules/shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { navigate } from '~modules/shared/helpers/link';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { formatDate } from '~modules/shared/helpers/formatters/date';
import { idpMapsToTagList } from '~modules/shared/helpers/idps-to-taglist';
import { setSelectedCheckboxes } from '~modules/shared/helpers/set-selected-checkboxes';
import { stringsToTagList } from '~modules/shared/helpers/strings-to-taglist';
import { truncateTableValue } from '~modules/shared/helpers/truncate';
import { useBusinessCategories } from '~modules/shared/hooks/useBusinessCategory';
import { useCompaniesWithUsers } from '~modules/shared/hooks/useCompanies';
import { useEducationLevels } from '~modules/shared/hooks/useEducationLevels';
import { useSubjects } from '~modules/shared/hooks/useSubjects';
import AddOrRemoveLinkedElementsModal, {
	AddOrRemove,
} from '~modules/shared/components/AddOrRemoveLinkedElementsModal/AddOrRemoveLinkedElementsModal';
import UserDeleteModal from '../components/UserDeleteModal';
import { GET_USER_BULK_ACTIONS, GET_USER_OVERVIEW_TABLE_COLS } from '~modules/user/user.consts';
import ActionsDropdown from '~modules/shared/components/ActionsDropdown/ActionsDropdown';
import { Icon } from '~modules/shared/components';

export interface UserOverviewProps {
	customFormatDate?: (date: Date | string) => string;
}

export const UserOverview: FC<UserOverviewProps> = ({ customFormatDate }) => {
	// Hooks
	const { tHtml, tText } = useTranslation();
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

	const config = AdminConfigManager.getConfig();
	const bulkActions = AdminConfigManager.getConfig().users?.bulkActions || [];

	const columns = useMemo(
		() =>
			GET_USER_OVERVIEW_TABLE_COLS(
				config,
				setSelectedCheckboxes(
					userGroupOptions as CheckboxOption[],
					get(tableState, 'userGroup', []) as string[]
				),
				companies.map(
					(option: Partial<Avo.Organization.Organization>): CheckboxOption => ({
						id: option.or_id as string,
						label: option.name as string,
						checked: get(tableState, 'organisation', [] as string[]).includes(
							String(option.or_id)
						),
					})
				),
				businessCategories.map(
					(option: string): CheckboxOption => ({
						id: option,
						label: option,
						checked: get(tableState, 'businessCategory', [] as string[]).includes(
							option
						),
					})
				),
				setSelectedCheckboxes(
					educationLevels,
					get(tableState, 'educationLevels', []) as string[]
				),
				setSelectedCheckboxes(subjects, get(tableState, 'subjects', []) as string[]),
				setSelectedCheckboxes(idps || [], get(tableState, 'idps', []) as string[])
			),
		[
			businessCategories,
			companies,
			educationLevels,
			idps,
			subjects,
			tableState,
			userGroupOptions,
			config,
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
	});
	const profiles = profilesResponse?.[0] || null;
	const profileCount = profilesResponse?.[1] || null;
	const hidePagination = (profileCount && profileCount < USERS_PER_PAGE) || false;

	const bulkChangeSubjects = async (addOrRemove: AddOrRemove, subjects: string[]) => {
		try {
			if (!selectedProfileIds || !selectedProfileIds.length) {
				return;
			}

			if (addOrRemove === 'add') {
				await UserService.bulkAddSubjectsToProfiles(subjects, compact(selectedProfileIds));
				AdminConfigManager.getConfig().services.toastService.showToast({
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
				AdminConfigManager.getConfig().services.toastService.showToast({
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
			AdminConfigManager.getConfig().services.toastService.showToast({
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
			AdminConfigManager.getConfig().services.toastService.showToast({
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

			AdminConfigManager.getConfig().services.toastService.showToast({
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
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('modules/user/views/user-overview___success'),
				description: tText(
					blockOrUnblock
						? 'admin/users/views/user-overview___de-geselecteerde-gebruikers-zijn-geblokkeerd'
						: 'admin/users/views/user-overview___de-geselecteerde-gebruikers-zijn-gedeblokkeerd'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			AdminConfigManager.getConfig().services.toastService.showToast({
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
			AdminConfigManager.getAdminRoute('USER_OVERVIEW'),
			{},
			{ [columnId]: tagId.toString(), columns: (tableState?.columns || []).join('~') }
		);
	};

	const bulkExport = async () => {
		try {
			setIsLoading(true);
			const column = columns.find(
				(tableColumn: FilterableColumn) =>
					tableColumn.id &&
					tableState?.sort_column &&
					tableColumn.id === tableState?.sort_column
			);
			const columnDataType: string = get(column, 'dataType', '');
			const [profilesTemp] = await UserService.getProfiles(
				0,
				(tableState?.sort_column || 'last_access_at') as UserOverviewTableCol,
				tableState?.sort_order || 'desc',
				columnDataType,
				generateWhereObject(getFilters(tableState), true),
				100000
			);
			const columnIds = tableState?.columns?.length
				? tableState.columns
				: columns.filter((column) => column.visibleByDefault).map((column) => column.id);
			const columnLabels = columnIds.map((columnId) =>
				get(
					columns.find((column) => column.id === columnId),
					'label',
					columnId
				)
			);
			const csvRowValues: string[] = [columnLabels.join(';')];
			profilesTemp.forEach((profile) => {
				const csvCellValues: string[] = [];
				columnIds.forEach((columnId) => {
					const csvCellValue = reactToString(
						renderTableCell(profile, columnId as UserOverviewTableCol)
					);
					csvCellValues.push(`"${csvCellValue.replace(/"/g, '""')}"`);
				});
				csvRowValues.push(csvCellValues.join(';'));
			});
			const csvString = csvRowValues.join('\n');
			const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
			FileSaver.saveAs(blob, 'gebruikers.csv');
		} catch (err) {
			console.error(
				new CustomError('Failed to export users to csv file', err, { tableState })
			);

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('modules/user/views/user-overview___error'),
				description: tText(
					'admin/users/views/user-overview___het-exporteren-van-de-geselecteerde-gebruikers-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}

		setIsLoading(false);
	};

	const handleBulkAction = async (action: UserBulkAction): Promise<void> => {
		if (!selectedProfileIds || !selectedProfileIds.length) {
			return;
		}
		switch (action) {
			case 'export':
				await bulkExport();
				return;

			case 'block':
				await bulkUpdateBlockStatus(true);
				return;

			case 'unblock':
				await bulkUpdateBlockStatus(false);
				return;

			case 'delete':
				setUsersDeleteModalOpen(true);
				return;

			case 'change_subjects':
				setChangeSubjectsModalOpen(true);
				SettingsService.fetchSubjects()
					.then((subjects: string[]) => {
						setAllSubjects(subjects);
					})
					.catch((err: any) => {
						console.error(
							new CustomError('Failed to get subjects from the database', err)
						);
						AdminConfigManager.getConfig().services.toastService.showToast({
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
		AdminConfigManager.getConfig().services.toastService.showToast({
			title: tText('modules/user/views/user-overview___success'),
			description: tText('admin/users/views/user-overview___uuid-gekopieerd'),
			type: ToastType.SUCCESS,
		});
	};

	const renderTableCell = (commonUser: CommonUser, columnId: UserOverviewTableCol) => {
		const isBlocked = commonUser?.isBlocked;

		switch (columnId) {
			case 'fullName':
				return truncateTableValue(commonUser?.fullName);

			case 'email':
				return truncateTableValue(commonUser?.email);

			case 'isBlocked':
				return isBlocked ? 'Ja' : 'Nee';

			case 'blockedAt':
			case 'unblockedAt':
				return formatDate(get(commonUser, ['user', columnId])) || '-';

			case 'isException':
				return commonUser?.isException ? 'Ja' : 'Nee';

			case 'organisation':
				return commonUser?.organisation?.name || '-';

			case 'createdAt':
				return formatDate(commonUser.createdAt) || '-';

			case 'lastAccessAt': {
				const lastAccessDate = commonUser?.lastAccessAt;
				return !isNil(lastAccessDate)
					? customFormatDate
						? customFormatDate(lastAccessDate)
						: formatDate(lastAccessDate)
					: '-';
			}
			case 'tempAccess': {
				const tempAccess = (commonUser?.tempAccess as any)?.status;

				switch (tempAccess) {
					case 1:
						return tHtml('admin/users/views/user-overview___tijdelijke-toegang-nee');
					case 0:
						return tHtml('admin/users/views/user-overview___tijdelijke-toegang-ja');
					default:
						return '-';
				}
			}
			case 'tempAccessFrom':
				return formatDate(commonUser?.tempAccess?.from) || '-';

			case 'tempAccessUntil':
				return formatDate(commonUser?.tempAccess?.until) || '-';

			case 'idps':
				return (
					idpMapsToTagList(
						Object.keys(commonUser?.idps || {}) as Idp[],
						`user_${commonUser?.profileId}`,
						navigateFilterToOption(columnId)
					) || '-'
				);

			case 'educationLevels':
			case 'subjects': {
				const labels = get(commonUser, columnId, []);
				return stringsToTagList(labels, null, navigateFilterToOption(columnId)) || '-';
			}
			case 'educationalOrganisations': {
				const orgs: Avo.EducationOrganization.Organization[] = get(
					commonUser,
					columnId,
					[]
				);
				const tags = orgs.map(
					(org): TagOption => ({
						id: `${org.organizationId}:${org.unitId || ''}`,
						label: org.label || org.unitId || org.organizationId,
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
					commonUser.userGroup?.label || commonUser.userGroup?.name || '-'
				);

			case 'actions':
				return (
					<ActionsDropdown
						menuItems={[
							{
								id: commonUser.profileId || '',
								label:
									commonUser.profileId ||
									tText('admin/users/views/user-overview___geen-uuid'),
								iconEnd: <Icon name="copy" />,
							},
						]}
						onOptionClicked={() => handleOptionClicked(commonUser.profileId)}
					/>
				);

			default:
				return truncateTableValue(commonUser[columnId] || '-');
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
					renderCell={(rowData: CommonUser, columnId: string) =>
						renderTableCell(rowData, columnId as UserOverviewTableCol)
					}
					searchTextPlaceholder={tText(
						'admin/users/views/user-overview___zoek-op-naam-email-alias'
					)}
					noContentMatchingFiltersMessage={tText(
						'admin/users/views/user-overview___er-zijn-geen-gebruikers-doe-voldoen-aan-de-opgegeven-filters'
					)}
					itemsPerPage={USERS_PER_PAGE}
					onTableStateChanged={setTableState}
					renderNoResults={renderNoResults}
					isLoading={isLoading}
					showCheckboxes={!!bulkActions.length}
					selectedItemIds={selectedProfileIds}
					onSelectionChanged={setSelectedProfileIds as (ids: ReactText[]) => void}
					onSelectAll={setAllProfilesAsSelected}
					onSelectBulkAction={handleBulkAction as any}
					bulkActions={GET_USER_BULK_ACTIONS(
						AdminConfigManager.getConfig().user,
						bulkActions
					)}
					rowKey={(row: CommonUser) =>
						row?.profileId || row?.userId || get(row, 'user.mail') || ''
					}
					hidePagination={hidePagination}
					className="u-spacer-bottom-l u-useroverview-table"
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
				icon={'alert-triangle'}
				actionButtons={['home', 'helpdesk']}
			/>
		);
	}
	return renderUserOverview();
};
