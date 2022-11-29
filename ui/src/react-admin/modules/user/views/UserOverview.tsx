import FileSaver from 'file-saver';
import { compact, first, get, isNil, without } from 'lodash-es';
import React, { FC, ReactText, useCallback, useEffect, useMemo, useState } from 'react';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';

import { useTranslation } from '~modules/shared/hooks/useTranslation';

import reactToString from 'react-to-string';

import { TagInfo, TagList, TagOption } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { ClientEducationOrganization } from '@viaa/avo2-types/types/education-organizations';

import FilterTable, {
	FilterableColumn,
	getFilters,
} from '../../shared/components/FilterTable/FilterTable';
import {
	getBooleanFilters,
	getDateRangeFilters,
	getMultiOptionFilters,
	getMultiOptionsFilters,
	NULL_FILTER,
} from '../../shared/helpers/filters';
import { UserService } from '../user.service';
import { CommonUser, UserBulkAction, UserOverviewTableCol, UserTableState } from '../user.types';

import './UserOverview.scss';
import { SettingsService } from '~modules/shared/services/settings-service/settings.service';
import { CheckboxOption } from '~modules/shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { buildLink, navigate } from '~modules/shared/helpers/link';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { formatDate } from '~modules/shared/helpers/formatters/date';
import { eduOrgToClientOrg } from '~modules/shared/helpers/edu-org-string-to-client-org';
import { idpMapsToTagList } from '~modules/shared/helpers/idps-to-taglist';
import { setSelectedCheckboxes } from '~modules/shared/helpers/set-selected-checkboxes';
import { stringsToTagList } from '~modules/shared/helpers/strings-to-taglist';
import { truncateTableValue } from '~modules/shared/helpers/truncate';
import { AvoOrHetArchief } from '~modules/shared/types';
import { useBusinessCategories } from '~modules/shared/hooks/useBusinessCategory';
import { useCompaniesWithUsers } from '~modules/shared/hooks/useCompanies';
import { useEducationLevels } from '~modules/shared/hooks/useEducationLevels';
import { useSubjects } from '~modules/shared/hooks/useSubjects';
import { useIdps } from '~modules/shared/hooks/useIdps';
import { ADMIN_PATH } from '~modules/shared/consts/admin.const';
import AddOrRemoveLinkedElementsModal, {
	AddOrRemove,
} from '~modules/shared/components/AddOrRemoveLinkedElementsModal/AddOrRemoveLinkedElementsModal';
import { useUserGroupOptions } from '~modules/content-page/hooks/useUserGroupOptions';
import UserDeleteModal from '../components/UserDeleteModal';
import {
	GET_USER_BULK_ACTIONS,
	GET_USER_OVERVIEW_TABLE_COLS,
	USERS_PER_PAGE,
} from '../user.consts';
import { UserOverviewProps } from './UserOverview.types';

export const UserOverview: FC<UserOverviewProps> = ({ customFormatDate }) => {
	// Hooks
	const { tHtml, tText } = useTranslation();
	const history = AdminConfigManager.getConfig().services.router.useHistory();

	const [profiles, setProfiles] = useState<CommonUser[] | null>(null);
	const [profileCount, setProfileCount] = useState<number>(0);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [tableState, setTableState] = useState<Partial<UserTableState>>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);
	const [companies] = useCompaniesWithUsers();
	const [businessCategories] = useBusinessCategories();
	const [educationLevels] = useEducationLevels();
	const [subjects] = useSubjects();
	const [idps] = useIdps();
	const [userGroupOptions] = useUserGroupOptions('CheckboxOption', false) as [
		CheckboxOption[],
		boolean
	];
	const [usersDeleteModalOpen, setUsersDeleteModalOpen] = useState<boolean>(false);
	const [changeSubjectsModalOpen, setChangeSubjectsModalOpen] = useState<boolean>(false);
	const [allSubjects, setAllSubjects] = useState<string[]>([]);

	const config = AdminConfigManager.getConfig();
	const app = AdminConfigManager.getConfig().database.databaseApplicationType;
	const bulkActions = AdminConfigManager.getConfig().users?.bulkActions || [];

	const columns = useMemo(
		() =>
			GET_USER_OVERVIEW_TABLE_COLS(
				config,
				setSelectedCheckboxes(
					userGroupOptions,
					get(tableState, 'author.user_groups', []) as string[]
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
						checked: get(tableState, 'business_category', [] as string[]).includes(
							option
						),
					})
				),
				setSelectedCheckboxes(
					educationLevels,
					get(tableState, 'education_levels', []) as string[]
				),
				setSelectedCheckboxes(subjects, get(tableState, 'subjects', []) as string[]),
				setSelectedCheckboxes(idps, get(tableState, 'idps', []) as string[])
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
		(filters: Partial<UserTableState>, onlySelectedProfiles: boolean) => {
			if (app === AvoOrHetArchief.hetArchief) {
				return generateWhereObjectArchief(
					filters,
					onlySelectedProfiles,
					selectedProfileIds
				);
			}
			return generateWhereObjectAvo(filters, onlySelectedProfiles, selectedProfileIds); // TODO avo and split
		},
		[app, selectedProfileIds]
	);

	const generateWhereObjectAvo = (
		filters: Partial<UserTableState>,
		onlySelectedProfiles: boolean,
		theSelectedProfileIds: string[]
	) => {
		const andFilters: any[] = [];

		if (filters.query) {
			const query = `%${filters.query}%`;

			andFilters.push({
				_or: [
					{ stamboek: { _ilike: query } },
					{ mail: { _ilike: query } },
					{ full_name: { _ilike: query } },
					{ company_name: { _ilike: query } },
					{ group_name: { _ilike: query } },
					{ business_category: { _ilike: query } },
				],
			});
		}

		andFilters.push(...getBooleanFilters(filters, ['is_blocked', 'is_exception']));

		andFilters.push(
			...getDateRangeFilters(
				filters,
				['blocked_at', 'unblocked_at'],
				['blocked_at.max', 'unblocked_at.max']
			)
		);

		andFilters.push(
			...getMultiOptionFilters(
				filters,
				['userGroup', 'organisation', 'business_category'],
				['group_id', 'company_id', 'business_category']
			)
		);

		andFilters.push(
			...getMultiOptionsFilters(
				filters,
				['education_levels', 'subjects', 'idps'],
				['contexts', 'classifications', 'idps'],
				['key', 'key', 'idp'],
				true
			)
		);

		andFilters.push(
			...getMultiOptionFilters(filters, ['temp_access'], ['user.temp_access.current.status'])
		);

		andFilters.push(
			...getDateRangeFilters(
				filters,
				['created_at', 'last_access_at'],
				['acc_created_at', 'last_access_at']
			)
		);

		if (filters.educational_organisations && filters.educational_organisations.length) {
			const orFilters: any[] = [];

			eduOrgToClientOrg(without(filters.educational_organisations, NULL_FILTER)).forEach(
				(org) => {
					orFilters.push({
						organisations: {
							organization_id: { _eq: org.organizationId },
							unit_id: org.unitId ? { _eq: org.unitId } : { _is_null: true },
						},
					});
				}
			);

			if (filters.educational_organisations.includes(NULL_FILTER)) {
				orFilters.push({
					_not: {
						organisations: {},
					},
				});
			}

			andFilters.push({
				_or: orFilters,
			});
		}

		if (onlySelectedProfiles) {
			andFilters.push({ profile_id: { _in: theSelectedProfileIds } });
		}

		// Filter users by wether the user has a Stamboeknummer or not.
		if (!isNil(filters.stamboek)) {
			const hasStamboek = first(filters.stamboek) === 'true';
			const isStamboekNull = !hasStamboek;

			andFilters.push({ stamboek: { _is_null: isStamboekNull } });
		}

		return { _and: andFilters };
	};

	const generateWhereObjectArchief = (
		filters: Partial<UserTableState>,
		onlySelectedProfiles: boolean,
		theSelectedProfileIds: string[]
	) => {
		const andFilters: any[] = [];

		if (filters.query) {
			const query = `%${filters.query}%`;

			andFilters.push({
				_or: [
					{ mail: { _ilike: query } },
					{ full_name: { _ilike: query } },
					{
						maintainer_users_profiles: {
							maintainer: {
								schema_name: {
									_ilike: query,
								},
							},
						},
					},
					{
						group: {
							label: {
								_ilike: query,
							},
						},
					},
				],
			});
		}

		andFilters.push(...getMultiOptionFilters(filters, ['userGroup'], ['group_id']));

		andFilters.push(
			...getMultiOptionsFilters(
				filters,
				['idps', 'organisation'],
				['identities', 'maintainer_users_profiles'],
				['identity_provider_name', 'maintainer_identifier'],
				true
			)
		);

		andFilters.push(...getDateRangeFilters(filters, ['last_access_at'], ['last_access_at']));

		if (onlySelectedProfiles) {
			andFilters.push({ profile_id: { _in: theSelectedProfileIds } });
		}

		return { _and: andFilters };
	};

	const fetchProfiles = useCallback(async () => {
		try {
			setIsLoading(true);

			const column = columns.find((tableColumn: FilterableColumn) => {
				return get(tableColumn, 'id', '') === get(tableState, 'sort_column', 'empty');
			});
			const columnDataType: string = get(column, 'dataType', '');
			const [profilesTemp, profileCountTemp] = await UserService.getProfiles(
				tableState.page || 0,
				(tableState.sort_column || 'last_access_at') as UserOverviewTableCol,
				tableState.sort_order || 'desc',
				columnDataType,
				generateWhereObject(getFilters(tableState), false)
			);

			setProfiles(profilesTemp);
			setProfileCount(profileCountTemp);
		} catch (err) {
			console.error(
				new CustomError('Failed to get users from the database', err, { tableState })
			);
			setLoadingInfo({
				state: 'error',
				message: tHtml(
					'admin/users/views/user-overview___het-ophalen-van-de-gebruikers-is-mislukt'
				),
			});
		}
		setIsLoading(false);
	}, [columns, tableState, generateWhereObject, tHtml]);

	useEffect(() => {
		fetchProfiles();
	}, [fetchProfiles]);

	useEffect(() => {
		if (profiles) {
			setLoadingInfo({
				state: 'loaded',
			});
		}
	}, [profiles]);

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
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('modules/user/views/user-overview___success'),
				description: tText(
					'admin/users/views/user-overview___je-hebt-num-of-selected-profiles-gebuikers-geselecteerd',
					{
						numOfSelectedProfiles: `${profileIds.length}`,
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
			await UserService.updateBlockStatusByProfileIds(selectedProfileIds, blockOrUnblock);
			await fetchProfiles();
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
			ADMIN_PATH.USER_OVERVIEW,
			{},
			{ [columnId]: tagId.toString(), columns: (tableState.columns || []).join('~') }
		);
	};

	const bulkExport = async () => {
		try {
			setIsLoading(true);
			const column = columns.find(
				(tableColumn: FilterableColumn) => tableColumn.id || '' === tableState.sort_column
			);
			const columnDataType: string = get(column, 'dataType', '');
			const [profilesTemp] = await UserService.getProfiles(
				0,
				(tableState.sort_column || 'last_access_at') as UserOverviewTableCol,
				tableState.sort_order || 'desc',
				columnDataType,
				generateWhereObject(getFilters(tableState), true),
				100000
			);
			const columnIds =
				tableState.columns && tableState.columns.length
					? tableState.columns
					: columns
							.filter((column) => column.visibleByDefault)
							.map((column) => column.id);
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

	const renderTableCell = (commonUser: CommonUser, columnId: UserOverviewTableCol) => {
		const Link = AdminConfigManager.getConfig().services.router.Link;

		const isBlocked = get(commonUser, 'user.is_blocked');

		switch (columnId) {
			case 'firstName':
				// no user detail for archief yet

				return app === AvoOrHetArchief.avo ? (
					<Link to={buildLink(ADMIN_PATH.USER_DETAIL, { id: commonUser.profileId })}>
						{truncateTableValue(get(commonUser, columnId))}
					</Link>
				) : (
					get(commonUser, 'firstName') || '-'
				);

			case 'lastName':
				return truncateTableValue(get(commonUser, 'lastName'));

			case 'email':
				return truncateTableValue(get(commonUser, 'email'));

			case 'is_blocked':
				return isBlocked ? 'Ja' : 'Nee';

			case 'blocked_at':
			case 'unblocked_at':
				return formatDate(get(commonUser, columnId)) || '-';

			case 'is_exception':
				return get(commonUser, 'is_exception') ? 'Ja' : 'Nee';

			case 'organisation':
				return get(commonUser, 'organisation.name') || '-';

			case 'created_at':
				return formatDate(commonUser.created_at) || '-';

			case 'last_access_at': {
				const lastAccessDate = get(commonUser, 'last_access_at');
				return !isNil(lastAccessDate)
					? customFormatDate
						? customFormatDate(lastAccessDate)
						: formatDate(lastAccessDate)
					: '-';
			}
			case 'temp_access': {
				const tempAccess = get(commonUser, 'user.temp_access.current.status');

				switch (tempAccess) {
					case 0:
						return tHtml('admin/users/views/user-overview___tijdelijke-toegang-nee');
					case 1:
						return tHtml('admin/users/views/user-overview___tijdelijke-toegang-ja');
					default:
						return '-';
				}
			}
			case 'temp_access_from':
				return formatDate(get(commonUser, 'user.temp_access.from')) || '-';

			case 'temp_access_until':
				return formatDate(get(commonUser, 'user.temp_access.until')) || '-';

			case 'idps':
				return (
					idpMapsToTagList(
						get(commonUser, 'idps', []),
						`user_${get(commonUser, 'user.profileId')}`,
						navigateFilterToOption(columnId)
					) || '-'
				);

			case 'education_levels':
			case 'subjects': {
				const labels = get(commonUser, columnId, []);
				return stringsToTagList(labels, null, navigateFilterToOption(columnId)) || '-';
			}
			case 'educational_organisations': {
				const orgs: ClientEducationOrganization[] = get(commonUser, columnId, []);
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

			default:
				return truncateTableValue(commonUser[columnId] || '-');
		}
	};

	const renderNoResults = () => {
		return <>{tHtml('admin/users/views/user-overview___er-bestaan-nog-geen-gebruikers')}</>;
		// return (
		// 	<ErrorView
		// 		message={t('admin/users/views/user-overview___er-bestaan-nog-geen-gebruikers')}
		// 	>
		// 		<p>
		// 			{tHtml('admin/users/views/user-overview___beschrijving-wanneer-er-nog-geen-gebruikers-zijn')} //  Beschrijving wanneer er nog geen gebruikers zijn
		// 		</p>
		// 	</ErrorView>
		// );
	};

	const renderUserOverview = () => {
		if (!profiles) {
			return null;
		}

		console.info({ app, profiles, columns });

		return (
			<>
				<FilterTable
					columns={columns}
					data={profiles}
					dataCount={profileCount}
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
					onTableStateChanged={(newTableState) => setTableState(newTableState)}
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
						row?.profileId || row?.userId || get(row, 'user.mail')
					}
				/>
				<UserDeleteModal
					selectedProfileIds={selectedProfileIds}
					isOpen={usersDeleteModalOpen}
					onClose={() => setUsersDeleteModalOpen(false)}
					deleteCallback={fetchProfiles}
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

	return (
		<LoadingErrorLoadedComponent
			loadingInfo={loadingInfo}
			dataObject={profiles}
			render={renderUserOverview}
		/>
	);
};
