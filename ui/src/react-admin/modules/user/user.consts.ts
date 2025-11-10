import type { ButtonType, SelectOption } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { PermissionName } from '@viaa/avo2-types';
import { isAfter, isBefore } from 'date-fns';
import { compact } from 'es-toolkit';

import type {
	CheckboxDropdownModalProps,
	CheckboxOption,
} from '~shared/components/CheckboxDropdownModal/CheckboxDropdownModal.js';
import type { FilterableColumn } from '~shared/components/FilterTable/FilterTable.js';
import { NULL_FILTER } from '~shared/helpers/filters.js';
import { normalizeTimestamp } from '~shared/helpers/formatters/date.js';
import { isAvo } from '~shared/helpers/is-avo.js';
import { tText } from '~shared/helpers/translation-functions.js';
import { PermissionService } from '~shared/services/permission-service.js';
import { AVO, HET_ARCHIEF } from '~shared/types/index.js';
import { TableColumnDataType } from '~shared/types/table-column-data-type.js';
import { TableFilterType } from '~shared/types/table-filter-types.js';
import type { UserOverviewTableCol } from './user.types.js';
import { UserBulkAction } from './user.types.js';

type UserBulkActionOption = SelectOption<UserBulkAction> & {
	confirm?: boolean;
	confirmButtonType?: ButtonType;
	disabled?: boolean;
};

export const GET_USER_OVERVIEW_TABLE_COLS: (props: {
	commonUser?: Avo.User.CommonUser;
	userGroupOptions: CheckboxOption[];
	companyOptions: CheckboxOption[];
	businessCategoryOptions: CheckboxOption[];
	educationLevels: CheckboxOption[];
	subjects: CheckboxOption[];
	idps: CheckboxOption[];
}) => FilterableColumn<UserOverviewTableCol>[] = ({
	commonUser,
	userGroupOptions,
	companyOptions,
	businessCategoryOptions,
	educationLevels,
	subjects,
	idps,
}) => {
	if (isAvo()) {
		return getAvoColumns(
			commonUser,
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
	user: Avo.User.CommonUser | undefined,
	userGroupOptions: CheckboxOption[],
	companyOptions: CheckboxOption[],
	businessCategoryOptions: CheckboxOption[],
	educationLevels: CheckboxOption[],
	subjects: CheckboxOption[],
	idps: CheckboxOption[]
): FilterableColumn<UserOverviewTableCol>[] => [
	{
		id: 'profileId',
		label: tText('admin/users/user___id', {}, [AVO]),
		sortable: false,
		visibleByDefault: false,
	},
	{
		id: 'fullName',
		label: tText('admin/users/user___naam', {}, [AVO]),
		sortable: true,
		visibleByDefault: true,
		dataType: TableColumnDataType.string,
	},
	{
		id: 'email',
		label: tText('admin/users/user___email', {}, [AVO]),
		sortable: true,
		visibleByDefault: true,
		dataType: TableColumnDataType.string,
	},
	{
		id: 'userGroup',
		label: tText('admin/users/user___gebruikersgroep', {}, [AVO]),
		sortable: true,
		visibleByDefault: true,
		filterType: TableFilterType.CheckboxDropdownModal,
		filterProps: {
			options: [
				...userGroupOptions,
				{
					label: tText('admin/users/user___leeg', {}, [AVO]),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
		dataType: TableColumnDataType.string,
	},
	{
		id: 'businessCategory',
		label: tText('admin/users/user___oormerk', {}, [AVO]),
		sortable: true,
		visibleByDefault: true,
		filterType: TableFilterType.CheckboxDropdownModal,
		filterProps: {
			options: [
				...businessCategoryOptions,
				{
					label: tText('admin/users/user___leeg', {}, [AVO]),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
		dataType: TableColumnDataType.string,
	},
	{
		id: 'isException',
		label: tText('admin/users/user___uitzonderingsaccount', {}, [AVO]),
		sortable: true,
		visibleByDefault: true,
		filterType: TableFilterType.BooleanCheckboxDropdown,
		dataType: TableColumnDataType.boolean,
	},
	{
		id: 'isBlocked',
		label: tText('admin/users/user___geblokkeerd', {}, [AVO]),
		sortable: true,
		visibleByDefault: true,
		filterType: TableFilterType.BooleanCheckboxDropdown,
		dataType: TableColumnDataType.boolean,
	},
	{
		id: 'blockedAt',
		label: tText('admin/users/user___geblokkeerd-op', {}, [AVO]),
		sortable: true,
		visibleByDefault: true,
		filterType: TableFilterType.DateRangeDropdown,
		dataType: TableColumnDataType.dateTime,
	},
	{
		id: 'unblockedAt',
		label: tText('admin/users/user___ongeblokkeerd-op', {}, [AVO]),
		sortable: true,
		visibleByDefault: true,
		filterType: TableFilterType.DateRangeDropdown,
		dataType: TableColumnDataType.dateTime,
	},
	...((PermissionService.hasPerm(user, PermissionName.EDIT_USER_TEMP_ACCESS)
		? [
				{
					id: 'tempAccess',
					label: tText('admin/users/user___tijdelijke-toegang', {}, [AVO]),
					sortable: true,
					visibleByDefault: false,
					filterType: TableFilterType.CheckboxDropdownModal,
					filterProps: {
						options: [
							{
								label: tText('admin/users/user___tijdelijke-toegang-ja', {}, [AVO]),
								id: '1',
							},
							{
								label: tText('admin/users/user___tijdelijke-toegang-nee', {}, [AVO]),
								id: '0',
							},
						],
					} as CheckboxDropdownModalProps,
					dataType: TableColumnDataType.booleanNullsLast, // Users without a value are always last when sorting
				},
				{
					id: 'tempAccessFrom',
					label: tText('admin/users/user___te-deblokkeren-op', {}, [AVO]),
					sortable: true,
					visibleByDefault: false,
					dataType: TableColumnDataType.dateTime,
				},
				{
					id: 'tempAccessUntil',
					label: tText('admin/users/user___te-blokkeren-op', {}, [AVO]),
					sortable: true,
					visibleByDefault: false,
					dataType: TableColumnDataType.dateTime,
				},
			]
		: []) as FilterableColumn<UserOverviewTableCol>[]),
	{
		id: 'stamboek',
		label: tText('admin/users/user___stamboek', {}, [AVO]),
		sortable: true,
		visibleByDefault: true,
		filterType: TableFilterType.BooleanCheckboxDropdown,
		dataType: TableColumnDataType.number,
	},
	{
		id: 'organisation',
		label: tText('admin/users/user___organisatie', {}, [AVO]),
		sortable: true,
		visibleByDefault: true,
		filterType: TableFilterType.CheckboxDropdownModal,
		filterProps: {
			options: [
				...companyOptions,
				{
					label: tText('admin/users/user___leeg', {}, [AVO]),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
		dataType: TableColumnDataType.string,
	},
	{
		id: 'createdAt',
		label: tText('admin/users/user___gebruiker-sinds', {}, [AVO]),
		sortable: true,
		visibleByDefault: true,
		filterType: TableFilterType.DateRangeDropdown,
		dataType: TableColumnDataType.dateTime,
	},
	{
		id: 'lastAccessAt',
		label: tText('admin/users/user___laatste-toegang', {}, [AVO]),
		sortable: true,
		visibleByDefault: true,
		filterType: TableFilterType.DateRangeDropdown,
		dataType: TableColumnDataType.dateTime,
	},
	{
		id: 'educationLevels',
		label: tText('admin/users/user___onderwijs-niveaus', {}, [AVO]),
		sortable: false,
		visibleByDefault: false,
		filterType: TableFilterType.CheckboxDropdownModal,
		filterProps: {
			options: [
				...educationLevels,
				{
					label: tText('admin/users/user___leeg', {}, [AVO]),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
	},
	{
		id: 'subjects',
		label: tText('admin/users/user___vakken', {}, [AVO]),
		sortable: false,
		visibleByDefault: false,
		filterType: TableFilterType.CheckboxDropdownModal,
		filterProps: {
			options: [
				...subjects,
				{
					label: tText('admin/users/user___leeg', {}, [AVO]),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
	},
	{
		id: 'idps',
		label: tText('admin/users/user___toegang-via', {}, [AVO]),
		sortable: false,
		visibleByDefault: false,
		filterType: TableFilterType.CheckboxDropdownModal,
		filterProps: {
			options: [
				...idps,
				{
					label: tText('admin/users/user___leeg', {}, [AVO]),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
	},
	{
		id: 'educationalOrganisations',
		label: tText('admin/users/user___educatieve-organisaties', {}, [AVO]),
		sortable: false,
		visibleByDefault: false,
		filterType: TableFilterType.MultiEducationalOrganisationSelectModal,
	},
];

const getHetArchiefColumns = (
	userGroupOptions: CheckboxOption[],
	companyOptions: CheckboxOption[]
): FilterableColumn<UserOverviewTableCol>[] => [
	{
		id: 'profileId',
		label: tText('admin/users/user___id', {}, [HET_ARCHIEF]),
		sortable: false,
		visibleByDefault: false,
	},
	{
		id: 'fullName',
		label: tText('admin/users/user___naam', {}, [HET_ARCHIEF]),
		sortable: true,
		visibleByDefault: true,
		dataType: TableColumnDataType.string,
	},
	{
		id: 'email',
		label: tText('admin/users/user___email', {}, [HET_ARCHIEF]),
		sortable: true,
		visibleByDefault: true,
		dataType: TableColumnDataType.string,
	},
	{
		id: 'userGroup',
		label: tText('admin/users/user___gebruikersgroep', {}, [HET_ARCHIEF]),
		sortable: true,
		visibleByDefault: true,
		filterType: TableFilterType.CheckboxDropdownModal,
		filterProps: {
			options: [
				...userGroupOptions,
				{
					label: tText('admin/users/user___leeg', {}, [HET_ARCHIEF]),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
		dataType: TableColumnDataType.string,
	},
	{
		id: 'organisation',
		label: tText('admin/users/user___organisatie', {}, [HET_ARCHIEF]),
		sortable: false,
		visibleByDefault: true,
		filterType: TableFilterType.CheckboxDropdownModal,
		filterProps: {
			options: [
				...companyOptions,
				{
					label: tText('admin/users/user___leeg', {}, [HET_ARCHIEF]),
					id: NULL_FILTER,
				},
			],
		} as CheckboxDropdownModalProps,
		dataType: TableColumnDataType.string,
	},
	{
		id: 'isKeyUser',
		label: tText('admin/users/user___sleutelgebruiker', {}, [HET_ARCHIEF]),
		sortable: true,
		visibleByDefault: false,
		filterType: TableFilterType.BooleanCheckboxDropdown,
		dataType: TableColumnDataType.boolean,
	},
	{
		id: 'lastAccessAt',
		label: tText('admin/users/user___laatste-toegang', {}, [HET_ARCHIEF]),
		sortable: true,
		visibleByDefault: true,
		// Ward: hide lastAccessAt filter (ARC-1428)
		//filterType: TableFilterType.DateRangeDropdown,
		dataType: TableColumnDataType.dateTime,
	},
	{
		id: 'actions',
		tooltip: tText('admin/users/user___acties', {}, [HET_ARCHIEF]),
		visibleByDefault: true,
	},
];

export const GET_USER_BULK_ACTIONS = (
	user: Avo.User.CommonUser | undefined,
	bulkActions: UserBulkAction[],
	hasSelection: boolean
): UserBulkActionOption[] => {
	if (!user || !bulkActions) {
		return [];
	}
	const actions: UserBulkActionOption[] = [];

	if (
		PermissionService.hasPerm(user, PermissionName.EDIT_ANY_USER) &&
		bulkActions.includes(UserBulkAction.BLOCK)
	) {
		actions.push({
			label: tText('modules/user/user___selectie-blokkeren'),
			value: UserBulkAction.BLOCK,
			disabled: !hasSelection,
		});
		actions.push({
			label: tText('modules/user/user___selectie-deblokkeren'),
			value: UserBulkAction.UNBLOCK,
			disabled: !hasSelection,
		});
	}
	if (
		PermissionService.hasPerm(user, PermissionName.DELETE_ANY_USER) &&
		bulkActions.includes(UserBulkAction.DELETE)
	) {
		actions.push({
			label: tText('modules/user/user___selectie-verwijderen'),
			value: UserBulkAction.DELETE,
			disabled: !hasSelection,
		});
	}
	if (
		PermissionService.hasPerm(user, PermissionName.EDIT_ANY_USER) &&
		bulkActions.includes(UserBulkAction.CHANGE_SUBJECTS)
	) {
		actions.push({
			label: tText('modules/user/user___selectie-vakken-aanpassen'),
			value: UserBulkAction.CHANGE_SUBJECTS,
			disabled: !hasSelection,
		});
	}
	if (bulkActions.includes(UserBulkAction.EXPORT_SELECTION)) {
		actions.push({
			label: tText('modules/user/user___selectie-exporteren'),
			value: UserBulkAction.EXPORT_SELECTION,
			disabled: !hasSelection,
		});
	}
	if (bulkActions.includes(UserBulkAction.EXPORT_ALL)) {
		actions.push({
			label: tText('modules/user/user___alles-exporteren'),
			value: UserBulkAction.EXPORT_ALL,
			disabled: false,
		});
	}

	return actions;
};

type ValidationRule<T> = {
	error: string | ((object: T) => string);
	isValid: (object: T) => boolean;
};

function getError<T>(rule: ValidationRule<T>, object: T) {
	if (typeof rule.error === 'string') {
		return rule.error;
	}
	return rule.error(object);
}

function GET_TEMP_ACCESS_VALIDATION_RULES_FOR_SAVE(): ValidationRule<
	Partial<Avo.User.TempAccess>
>[] {
	return [
		{
			// until cannot be null and must be in the future
			error: tText('admin/users/user___de-einddatum-is-verplicht-en-moet-in-de-toekomst-liggen'),
			isValid: (tempAccess: Partial<Avo.User.TempAccess>) =>
				!!tempAccess.until && isAfter(normalizeTimestamp(tempAccess.until), new Date()),
		},
		{
			// When both from and until date are set, the from date must be < the until date
			error: tText('admin/users/user___de-startdatum-moet-voor-de-einddatum-liggen'),
			isValid: (tempAccess: Partial<Avo.User.TempAccess>) => {
				return tempAccess.from
					? !!tempAccess.until &&
							isBefore(normalizeTimestamp(tempAccess.from), normalizeTimestamp(tempAccess.until))
					: true;
			},
		},
	];
}

export const getTempAccessValidationErrors = (tempAccess: Avo.User.TempAccess): string[] => {
	const validationErrors = [...GET_TEMP_ACCESS_VALIDATION_RULES_FOR_SAVE()].map((rule) => {
		return rule.isValid(tempAccess) ? null : getError(rule, tempAccess);
	});
	return compact(validationErrors);
};
