import { ButtonType, SelectOption } from "@viaa/avo2-components";
import { Avo } from "@viaa/avo2-types";
import { Config } from "~core/config";
import { CheckboxDropdownModalProps, CheckboxOption } from "~modules/shared/components/CheckboxDropdownModal/CheckboxDropdownModal";
import { FilterableColumn } from "~modules/shared/components/FilterTable/FilterTable";
import { ROUTE_PARTS } from "~modules/shared/consts/routes";
import { NULL_FILTER } from "~modules/shared/helpers/filters";
import { PermissionService } from "~modules/shared/services/permission-service";
import { AvoOrHetArchief } from "~modules/shared/types";
import { CommonUser, Permission, UserBulkAction, UserOverviewTableCol } from "./user.types";

export const ITEMS_PER_PAGE = 50;

export const USER_PATH = {
	USER_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.user}`,
	USER_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.user}/:id`,
	USER_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.user}/:id/${ROUTE_PARTS.edit}`,
};


type UserBulkActionOption = SelectOption<UserBulkAction> & {
	confirm?: boolean;
	confirmButtonType?: ButtonType;
};

export const GET_USER_OVERVIEW_TABLE_COLS: (
	user: CommonUser | undefined,
	userGroupOptions: CheckboxOption[],
	companyOptions: CheckboxOption[],
	businessCategoryOptions: CheckboxOption[],
	educationLevels: CheckboxOption[],
	subjects: CheckboxOption[],
	idps: CheckboxOption[]
) => FilterableColumn[] = (
	user: CommonUser | undefined,
	userGroupOptions: CheckboxOption[],
	companyOptions: CheckboxOption[],
	businessCategoryOptions: CheckboxOption[],
	educationLevels: CheckboxOption[],
	subjects: CheckboxOption[],
	idps: CheckboxOption[]
) => {
	if (Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.avo) {
		return getAvoColumns(user, userGroupOptions, companyOptions, businessCategoryOptions, educationLevels, subjects, idps);
	}
	return getHetArchiefColumns(userGroupOptions, companyOptions, idps);
};

export const GET_TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT = (): Partial<
	{
		[columnId in UserOverviewTableCol]: (order: Avo.Search.OrderDirection) => any
	}
> => {
	if (Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.avo) {
		return tableColumnToDatabaseOrderObjectAvo;
	}
	return tableColumnToDatabaseOrderObjectHetArchief;
}


const tableColumnToDatabaseOrderObjectAvo: Partial<
{
	[columnId in UserOverviewTableCol]: (order: Avo.Search.OrderDirection) => any;
}> = {
	firstName: (order: Avo.Search.OrderDirection) => ({
		first_name_lower: order,
	}),
	lastName: (order: Avo.Search.OrderDirection) => ({
		last_name_lower: order,
	}),
	email: (order: Avo.Search.OrderDirection) => ({
		mail: order,
	}),
	userGroup: (order: Avo.Search.OrderDirection) => ({
		group_name: order,
	}),
	business_category: (order: Avo.Search.OrderDirection) => ({
		business_category: order,
	}),
	is_blocked: (order: Avo.Search.OrderDirection) => ({
		is_blocked: order,
	}),
	blocked_at: (order: Avo.Search.OrderDirection) => ({
		blocked_at: {
			max: order,
		},
	}),
	unblocked_at: (order: Avo.Search.OrderDirection) => ({
		unblocked_at: {
			max: order,
		},
	}),
	stamboek: (order: Avo.Search.OrderDirection) => ({
		stamboek: order,
	}),
	organisation: (order: Avo.Search.OrderDirection) => ({
		company_name: order,
	}),
	created_at: (order: Avo.Search.OrderDirection) => ({
		acc_created_at: order,
	}),
	last_access_at: (order: Avo.Search.OrderDirection) => ({
		last_access_at: order,
	}),
	temp_access: (order: Avo.Search.OrderDirection) => ({
		user: { temp_access: { current: { status: order } } },
	}),
	temp_access_from: (order: Avo.Search.OrderDirection) => ({
		user: { temp_access: { from: order } },
	}),
	temp_access_until: (order: Avo.Search.OrderDirection) => ({
		user: { temp_access: { until: order } },
	}),
};

const tableColumnToDatabaseOrderObjectHetArchief: Partial<
{
	[columnId in UserOverviewTableCol]: (order: Avo.Search.OrderDirection) => any;
}> = {
	firstName: (order: Avo.Search.OrderDirection) => ({
		first_name: order,
	}),
	lastName: (order: Avo.Search.OrderDirection) => ({
		last_name: order,
	}),
	email: (order: Avo.Search.OrderDirection) => ({
		mail: order,
	}),
	userGroup: (order: Avo.Search.OrderDirection) => ({
		group: { label : order },
	}),
	organisation: (order: Avo.Search.OrderDirection) => ({
		maintainer_users_profiles: { maintainer: { schema_name: order } },
	}),
	last_access_at: (order: Avo.Search.OrderDirection) => ({
		last_access_at: order,
	}),
};

const getAvoColumns = (user: CommonUser | undefined,
	userGroupOptions: CheckboxOption[],
	companyOptions: CheckboxOption[],
	businessCategoryOptions: CheckboxOption[],
	educationLevels: CheckboxOption[],
	subjects: CheckboxOption[],
	idps: CheckboxOption[]): FilterableColumn[] => [
	{
		id: 'profileId',
		label: Config.getConfig().services.i18n.t('admin/users/user___id'),
		sortable: false,
		visibleByDefault: false,
	},
	{
		id: 'first_name',
		label: Config.getConfig().services.i18n.t('admin/users/user___voornaam'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'last_name',
		label: Config.getConfig().services.i18n.t('admin/users/user___achternaam'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'mail',
		label: Config.getConfig().services.i18n.t('admin/users/user___email'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'user_group',
		label: Config.getConfig().services.i18n.t('admin/users/user___gebruikersgroep'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...userGroupOptions,
				{ label: Config.getConfig().services.i18n.t('admin/users/user___leeg'), id: NULL_FILTER },
			],
		} as CheckboxDropdownModalProps,
		dataType: 'string',
	},
	{
		id: 'business_category',
		label: Config.getConfig().services.i18n.t('admin/users/user___oormerk'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...businessCategoryOptions,
				{ label: Config.getConfig().services.i18n.t('admin/users/user___leeg'), id: NULL_FILTER },
			],
		} as CheckboxDropdownModalProps,
		dataType: 'string',
	},
	{
		id: 'is_exception',
		label: Config.getConfig().services.i18n.t('admin/users/user___uitzonderingsaccount'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'BooleanCheckboxDropdown',
		dataType: 'boolean',
	},
	{
		id: 'is_blocked',
		label: Config.getConfig().services.i18n.t('admin/users/user___geblokkeerd'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'BooleanCheckboxDropdown',
		dataType: 'boolean',
	},
	{
		id: 'blocked_at',
		label: Config.getConfig().services.i18n.t('admin/users/user___geblokkeerd-op'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: 'dateTime',
	},
	{
		id: 'unblocked_at',
		label: Config.getConfig().services.i18n.t('admin/users/user___ongeblokkeerd-op'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: 'dateTime',
	},
	...((PermissionService.hasPerm(user, Permission.EDIT_USER_TEMP_ACCESS)
		? [
				{
					id: 'temp_access',
					label: Config.getConfig().services.i18n.t('admin/users/user___tijdelijke-toegang'),
					sortable: true,
					visibleByDefault: false,
					filterType: 'CheckboxDropdownModal',
					filterProps: {
						options: [
							{ label: Config.getConfig().services.i18n.t('admin/users/user___tijdelijke-toegang-ja'), id: '1' },
							{ label: Config.getConfig().services.i18n.t('admin/users/user___tijdelijke-toegang-nee'), id: '0' },
						],
					} as CheckboxDropdownModalProps,
					dataType: 'booleanNullsLast', // Users without a value are always last when sorting
				},
				{
					id: 'temp_access_from',
					label: Config.getConfig().services.i18n.t('admin/users/user___te-deblokkeren-op'),
					sortable: true,
					visibleByDefault: false,
					dataType: 'dateTime',
				},
				{
					id: 'temp_access_until',
					label: Config.getConfig().services.i18n.t('admin/users/user___te-blokkeren-op'),
					sortable: true,
					visibleByDefault: false,
					dataType: 'dateTime',
				},
		  ]
		: []) as FilterableColumn[]),
	{
		id: 'stamboek',
		label: Config.getConfig().services.i18n.t('admin/users/user___stamboek'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'BooleanCheckboxDropdown',
		dataType: 'number',
	},
	{
		id: 'organisation',
		label: Config.getConfig().services.i18n.t('admin/users/user___organisatie'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...companyOptions,
				{ label: Config.getConfig().services.i18n.t('admin/users/user___leeg'), id: NULL_FILTER },
			],
		} as CheckboxDropdownModalProps,
		dataType: 'string',
	},
	{
		id: 'created_at',
		label: Config.getConfig().services.i18n.t('admin/users/user___gebruiker-sinds'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: 'dateTime',
	},
	{
		id: 'last_access_at',
		label: Config.getConfig().services.i18n.t('admin/users/user___laatste-toegang'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: 'dateTime',
	},
	{
		id: 'education_levels',
		label: Config.getConfig().services.i18n.t('admin/users/user___onderwijs-niveaus'),
		sortable: false,
		visibleByDefault: false,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...educationLevels,
				{ label: Config.getConfig().services.i18n.t('admin/users/user___leeg'), id: NULL_FILTER },
			],
		} as CheckboxDropdownModalProps,
	},
	{
		id: 'subjects',
		label: Config.getConfig().services.i18n.t('admin/users/user___vakken'),
		sortable: false,
		visibleByDefault: false,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [...subjects, { label: Config.getConfig().services.i18n.t('admin/users/user___leeg'), id: NULL_FILTER }],
		} as CheckboxDropdownModalProps,
	},
	{
		id: 'idps',
		label: Config.getConfig().services.i18n.t('admin/users/user___toegang-via'),
		sortable: false,
		visibleByDefault: false,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [...idps, { label: Config.getConfig().services.i18n.t('admin/users/user___leeg'), id: NULL_FILTER }],
		} as CheckboxDropdownModalProps,
	},
	{
		id: 'educational_organisations',
		label: Config.getConfig().services.i18n.t('admin/users/user___educatieve-organisaties'),
		sortable: false,
		visibleByDefault: false,
		filterType: 'MultiEducationalOrganisationSelectModal',
	},
];

const getHetArchiefColumns = (userGroupOptions: CheckboxOption[],
	companyOptions: CheckboxOption[],
	idps: CheckboxOption[]): FilterableColumn[] => [
	{
		id: 'profileId',
		label: Config.getConfig().services.i18n.t('admin/users/user___id'),
		sortable: false,
		visibleByDefault: false,
	},
	{
		id: 'firstName',
		label: Config.getConfig().services.i18n.t('admin/users/user___voornaam'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'lastName',
		label: Config.getConfig().services.i18n.t('admin/users/user___achternaam'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'email',
		label: Config.getConfig().services.i18n.t('admin/users/user___email'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'last_access_at',
		label: Config.getConfig().services.i18n.t('admin/users/user___laatste-toegang'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: 'dateTime',
	},
	{
		id: 'userGroup',
		label: Config.getConfig().services.i18n.t('admin/users/user___gebruikersgroep'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...userGroupOptions,
				{ label: Config.getConfig().services.i18n.t('admin/users/user___leeg'), id: NULL_FILTER },
			],
		} as CheckboxDropdownModalProps,
		dataType: 'string',
	},

	{
		id: 'organisation',
		label: Config.getConfig().services.i18n.t('admin/users/user___organisatie'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [
				...companyOptions,
				{ label: Config.getConfig().services.i18n.t('admin/users/user___leeg'), id: NULL_FILTER },
			],
		} as CheckboxDropdownModalProps,
		dataType: 'string',
	},

	{
		id: 'idps',
		label: Config.getConfig().services.i18n.t('admin/users/user___toegang-via'),
		sortable: false,
		visibleByDefault: false,
		filterType: 'CheckboxDropdownModal',
		filterProps: {
			options: [...idps, { label: Config.getConfig().services.i18n.t('admin/users/user___leeg'), id: NULL_FILTER }],
		} as CheckboxDropdownModalProps,
	},
];

export const GET_USER_BULK_ACTIONS = (user: CommonUser | undefined): UserBulkActionOption[] => {
	if (!user) {
		return [];
	}
	const actions: UserBulkActionOption[] = [];

	if (PermissionService.hasPerm(user, Permission.EDIT_ANY_USER)) {
		actions.push({
			label: Config.getConfig().services.i18n.t('admin/users/user___blokkeren'),
			value: 'block',
		});
		actions.push({
			label: Config.getConfig().services.i18n.t('admin/users/user___deblokkeren'),
			value: 'unblock',
		});
	}
	if (PermissionService.hasPerm(user, Permission.DELETE_ANY_USER)) {
		actions.push({
			label: Config.getConfig().services.i18n.t('admin/users/user___verwijderen'),
			value: 'delete',
		});
	}
	if (PermissionService.hasPerm(user, Permission.EDIT_ANY_USER)) {
		actions.push({
			label: Config.getConfig().services.i18n.t('admin/users/user___vakken-aanpassen'),
			value: 'change_subjects',
		});
	}
	actions.push({
		label: Config.getConfig().services.i18n.t('admin/users/user___exporteren'),
		value: 'export',
	});

	return actions;
};
