import { ButtonType, SelectOption } from '@viaa/avo2-components';
import { AdminConfig, AdminConfigManager } from '~core/config';
import {
	CheckboxDropdownModalProps,
	CheckboxOption,
} from '~modules/shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { FilterableColumn } from '~modules/shared/components/FilterTable/FilterTable';
import { NULL_FILTER } from '~modules/shared/helpers/filters';
import { PermissionService } from '~modules/shared/services/permission-service';
import { AvoOrHetArchief } from '~modules/shared/types';
import { CommonUser, Permission, UserBulkAction, UserOverviewTableCol } from './user.types';

export const USERS_PER_PAGE = 50;

type UserBulkActionOption = SelectOption<UserBulkAction> & {
	confirm?: boolean;
	confirmButtonType?: ButtonType;
};

export const GET_USER_OVERVIEW_TABLE_COLS: (
	config: AdminConfig,
	userGroupOptions: CheckboxOption[],
	companyOptions: CheckboxOption[],
	businessCategoryOptions: CheckboxOption[],
	educationLevels: CheckboxOption[],
	subjects: CheckboxOption[],
	idps: CheckboxOption[]
) => FilterableColumn[] = (
	config,
	userGroupOptions: CheckboxOption[],
	companyOptions: CheckboxOption[],
	businessCategoryOptions: CheckboxOption[],
	educationLevels: CheckboxOption[],
	subjects: CheckboxOption[],
	idps: CheckboxOption[]
) => {
	if (config.database.databaseApplicationType === AvoOrHetArchief.avo) {
		return getAvoColumns(
			config.user,
			userGroupOptions,
			companyOptions,
			businessCategoryOptions,
			educationLevels,
			subjects,
			idps
		);
	}
	return getHetArchiefColumns(userGroupOptions, companyOptions);
};

const getAvoColumns = (
	user: CommonUser | undefined,
	userGroupOptions: CheckboxOption[],
	companyOptions: CheckboxOption[],
	businessCategoryOptions: CheckboxOption[],
	educationLevels: CheckboxOption[],
	subjects: CheckboxOption[],
	idps: CheckboxOption[]
): FilterableColumn<UserOverviewTableCol>[] => [
	{
		id: 'profileId',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___id'),
		sortable: false,
		visibleByDefault: false,
	},
	{
		id: 'firstName',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___voornaam'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'lastName',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___achternaam'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'email',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___email'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'userGroup',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___gebruikersgroep'
		),
		sortable: true,
		visibleByDefault: true,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...userGroupOptions,
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/users/user___leeg'
					),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
		dataType: 'string',
	},
	{
		id: 'businessCategory',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___oormerk'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...businessCategoryOptions,
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/users/user___leeg'
					),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
		dataType: 'string',
	},
	{
		id: 'isException',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___uitzonderingsaccount'
		),
		sortable: true,
		visibleByDefault: true,
		filterType: 'BooleanCheckboxDropdown',
		dataType: 'boolean',
	},
	{
		id: 'isBlocked',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___geblokkeerd'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'BooleanCheckboxDropdown',
		dataType: 'boolean',
	},
	{
		id: 'blockedAt',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___geblokkeerd-op'
		),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: 'dateTime',
	},
	{
		id: 'unblockedAt',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___ongeblokkeerd-op'
		),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: 'dateTime',
	},
	...((PermissionService.hasPerm(user, Permission.EDIT_USER_TEMP_ACCESS)
		? [
				{
					id: 'tempAccess',
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/users/user___tijdelijke-toegang'
					),
					sortable: true,
					visibleByDefault: false,
					filterType: 'CheckboxDropdownModal',
					filterProps: {
						options: [
							{
								label: AdminConfigManager.getConfig().services.i18n.tText(
									'admin/users/user___tijdelijke-toegang-ja'
								),
								id: '1',
							},
							{
								label: AdminConfigManager.getConfig().services.i18n.tText(
									'admin/users/user___tijdelijke-toegang-nee'
								),
								id: '0',
							},
						],
					} as CheckboxDropdownModalProps,
					dataType: 'booleanNullsLast', // Users without a value are always last when sorting
				},
				{
					id: 'tempAccessFrom',
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/users/user___te-deblokkeren-op'
					),
					sortable: true,
					visibleByDefault: false,
					dataType: 'dateTime',
				},
				{
					id: 'tempAccessUntil',
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/users/user___te-blokkeren-op'
					),
					sortable: true,
					visibleByDefault: false,
					dataType: 'dateTime',
				},
		  ]
		: []) as FilterableColumn<UserOverviewTableCol>[]),
	{
		id: 'stamboek',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___stamboek'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'BooleanCheckboxDropdown',
		dataType: 'number',
	},
	{
		id: 'organisation',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___organisatie'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...companyOptions,
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/users/user___leeg'
					),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
		dataType: 'string',
	},
	{
		id: 'createdAt',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___gebruiker-sinds'
		),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: 'dateTime',
	},
	{
		id: 'lastAccessAt',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___laatste-toegang'
		),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: 'dateTime',
	},
	{
		id: 'educationLevels',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___onderwijs-niveaus'
		),
		sortable: false,
		visibleByDefault: false,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...educationLevels,
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/users/user___leeg'
					),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
	},
	{
		id: 'subjects',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___vakken'),
		sortable: false,
		visibleByDefault: false,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...subjects,
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/users/user___leeg'
					),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
	},
	{
		id: 'idps',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___toegang-via'),
		sortable: false,
		visibleByDefault: false,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...idps,
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/users/user___leeg'
					),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
	},
	{
		id: 'educationalOrganisations',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___educatieve-organisaties'
		),
		sortable: false,
		visibleByDefault: false,
		filterType: 'MultiEducationalOrganisationSelectModal',
	},
];

const getHetArchiefColumns = (
	userGroupOptions: CheckboxOption[],
	companyOptions: CheckboxOption[]
): FilterableColumn<UserOverviewTableCol>[] => [
	{
		id: 'profileId',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___id'),
		sortable: false,
		visibleByDefault: false,
	},
	{
		id: 'firstName',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___voornaam'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'lastName',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___achternaam'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'email',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___email'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'userGroup',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___gebruikersgroep'
		),
		sortable: true,
		visibleByDefault: true,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...userGroupOptions,
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/users/user___leeg'
					),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
		dataType: 'string',
	},
	{
		id: 'organisation',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___organisatie'),
		sortable: false,
		visibleByDefault: true,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...companyOptions,
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/users/user___leeg'
					),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
		dataType: 'string',
	},
	{
		id: 'lastAccessAt',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___laatste-toegang'
		),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: 'dateTime',
	},
];

export const GET_USER_BULK_ACTIONS = (
	user: CommonUser | undefined,
	bulkActions: UserBulkAction[]
): UserBulkActionOption[] => {
	if (!user || !bulkActions) {
		return [];
	}
	const actions: UserBulkActionOption[] = [];

	if (
		PermissionService.hasPerm(user, Permission.EDIT_ANY_USER) &&
		bulkActions.includes('block')
	) {
		actions.push({
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/users/user___blokkeren'
			),
			value: 'block',
		});
		actions.push({
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/users/user___deblokkeren'
			),
			value: 'unblock',
		});
	}
	if (
		PermissionService.hasPerm(user, Permission.DELETE_ANY_USER) &&
		bulkActions.includes('delete')
	) {
		actions.push({
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/users/user___verwijderen'
			),
			value: 'delete',
		});
	}
	if (
		PermissionService.hasPerm(user, Permission.EDIT_ANY_USER) &&
		bulkActions.includes('change_subjects')
	) {
		actions.push({
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/users/user___vakken-aanpassen'
			),
			value: 'change_subjects',
		});
	}
	if (bulkActions.includes('export')) {
		actions.push({
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/users/user___exporteren'
			),
			value: 'export',
		});
	}

	return actions;
};
