import { ButtonType, SelectOption } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { PermissionName } from '@viaa/avo2-types';
import { isAfter, isBefore } from 'date-fns';
import { compact } from 'lodash-es';

import { AdminConfigManager, I18n } from '~core/config';
import {
	CheckboxDropdownModalProps,
	CheckboxOption,
} from '~shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { FilterableColumn } from '~shared/components/FilterTable/FilterTable';
import { NULL_FILTER } from '~shared/helpers/filters';
import { isAvo } from '~shared/helpers/is-avo';
import { normalizeTimestamp } from '~shared/helpers/formatters/date';
import { PermissionService } from '~shared/services/permission-service';
import { TableColumnDataType } from '~shared/types/table-column-data-type';
import { UserBulkAction, UserOverviewTableCol } from './user.types';

type UserBulkActionOption = SelectOption<UserBulkAction> & {
	confirm?: boolean;
	confirmButtonType?: ButtonType;
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
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___id'),
		sortable: false,
		visibleByDefault: false,
	},
	{
		id: 'fullName',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___naam'),
		sortable: true,
		visibleByDefault: true,
		dataType: TableColumnDataType.string,
	},
	{
		id: 'email',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___email'),
		sortable: true,
		visibleByDefault: true,
		dataType: TableColumnDataType.string,
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
		dataType: TableColumnDataType.string,
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
		dataType: TableColumnDataType.string,
	},
	{
		id: 'isException',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___uitzonderingsaccount'
		),
		sortable: true,
		visibleByDefault: true,
		filterType: 'BooleanCheckboxDropdown',
		dataType: TableColumnDataType.boolean,
	},
	{
		id: 'isBlocked',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___geblokkeerd'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'BooleanCheckboxDropdown',
		dataType: TableColumnDataType.boolean,
	},
	{
		id: 'blockedAt',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___geblokkeerd-op'
		),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: TableColumnDataType.dateTime,
	},
	{
		id: 'unblockedAt',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___ongeblokkeerd-op'
		),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: TableColumnDataType.dateTime,
	},
	...((PermissionService.hasPerm(user, PermissionName.EDIT_USER_TEMP_ACCESS)
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
					dataType: TableColumnDataType.booleanNullsLast, // Users without a value are always last when sorting
				},
				{
					id: 'tempAccessFrom',
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/users/user___te-deblokkeren-op'
					),
					sortable: true,
					visibleByDefault: false,
					dataType: TableColumnDataType.dateTime,
				},
				{
					id: 'tempAccessUntil',
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/users/user___te-blokkeren-op'
					),
					sortable: true,
					visibleByDefault: false,
					dataType: TableColumnDataType.dateTime,
				},
		  ]
		: []) as FilterableColumn<UserOverviewTableCol>[]),
	{
		id: 'stamboek',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___stamboek'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'BooleanCheckboxDropdown',
		dataType: TableColumnDataType.number,
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
		dataType: TableColumnDataType.string,
	},
	{
		id: 'createdAt',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___gebruiker-sinds'
		),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: TableColumnDataType.dateTime,
	},
	{
		id: 'lastAccessAt',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___laatste-toegang'
		),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: TableColumnDataType.dateTime,
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
		id: 'fullName',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___naam'),
		sortable: true,
		visibleByDefault: true,
		dataType: TableColumnDataType.string,
	},
	{
		id: 'email',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___email'),
		sortable: true,
		visibleByDefault: true,
		dataType: TableColumnDataType.string,
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
		dataType: TableColumnDataType.string,
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
		dataType: TableColumnDataType.string,
	},
	{
		id: 'isKeyUser',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___sleutelgebruiker'
		),
		sortable: true,
		visibleByDefault: false,
		filterType: 'BooleanCheckboxDropdown',
		dataType: TableColumnDataType.boolean,
	},
	{
		id: 'lastAccessAt',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/users/user___laatste-toegang'
		),
		sortable: true,
		visibleByDefault: true,
		// Ward: hide lastAccessAt filter (ARC-1428)
		//filterType: 'DateRangeDropdown',
		dataType: TableColumnDataType.dateTime,
	},
	{
		id: 'actions',
		tooltip: AdminConfigManager.getConfig().services.i18n.tText('admin/users/user___acties'),
		visibleByDefault: true,
	},
];

export const GET_USER_BULK_ACTIONS = (
	user: Avo.User.CommonUser | undefined,
	bulkActions: UserBulkAction[]
): UserBulkActionOption[] => {
	if (!user || !bulkActions) {
		return [];
	}
	const actions: UserBulkActionOption[] = [];

	if (
		PermissionService.hasPerm(user, PermissionName.EDIT_ANY_USER) &&
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
		PermissionService.hasPerm(user, PermissionName.DELETE_ANY_USER) &&
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
		PermissionService.hasPerm(user, PermissionName.EDIT_ANY_USER) &&
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

const GET_TEMP_ACCESS_VALIDATION_RULES_FOR_SAVE: (
	i18n: I18n
) => ValidationRule<Partial<Avo.User.TempAccess>>[] = (i18n: I18n) => [
	{
		// until cannot be null and must be in the future
		error: i18n.tText(
			'admin/users/user___de-einddatum-is-verplicht-en-moet-in-de-toekomst-liggen'
		),
		isValid: (tempAccess: Partial<Avo.User.TempAccess>) =>
			!!tempAccess.until && isAfter(normalizeTimestamp(tempAccess.until), new Date()),
	},
	{
		// When both from and until date are set, the from date must be < the until date
		error: i18n.tText('admin/users/user___de-startdatum-moet-voor-de-einddatum-liggen'),
		isValid: (tempAccess: Partial<Avo.User.TempAccess>) => {
			return tempAccess.from
				? !!tempAccess.until &&
						isBefore(
							normalizeTimestamp(tempAccess.from),
							normalizeTimestamp(tempAccess.until)
						)
				: true;
		},
	},
];

export const getTempAccessValidationErrors = (
	tempAccess: Avo.User.TempAccess,
	i18n: I18n
): string[] => {
	const validationErrors = [...GET_TEMP_ACCESS_VALIDATION_RULES_FOR_SAVE(i18n)].map((rule) => {
		return rule.isValid(tempAccess) ? null : getError(rule, tempAccess);
	});
	return compact(validationErrors);
};
