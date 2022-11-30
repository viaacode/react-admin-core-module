import { Avo } from '@viaa/avo2-types';
import { isAvo } from '../shared/helpers/is-avo';
import { UserOverviewTableCol } from './users.types';

export const GET_TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT = (): Partial<{
	[columnId in UserOverviewTableCol]: (order: Avo.Search.OrderDirection) => any;
}> => {
	if (isAvo()) {
		return tableColumnToDatabaseOrderObjectAvo;
	}
	return tableColumnToDatabaseOrderObjectHetArchief;
};

const tableColumnToDatabaseOrderObjectAvo: Partial<{
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
	businessCategory: (order: Avo.Search.OrderDirection) => ({
		business_category: order,
	}),
	isBlocked: (order: Avo.Search.OrderDirection) => ({
		is_blocked: order,
	}),
	blockedAt: (order: Avo.Search.OrderDirection) => ({
		blocked_at: {
			max: order,
		},
	}),
	unblockedAt: (order: Avo.Search.OrderDirection) => ({
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
	createdAt: (order: Avo.Search.OrderDirection) => ({
		acc_created_at: order,
	}),
	lastAccessAt: (order: Avo.Search.OrderDirection) => ({
		last_access_at: order,
	}),
	tempAccess: (order: Avo.Search.OrderDirection) => ({
		user: { temp_access: { current: { status: order } } },
	}),
	tempAccessFrom: (order: Avo.Search.OrderDirection) => ({
		user: { temp_access: { from: order } },
	}),
	tempAccessUntil: (order: Avo.Search.OrderDirection) => ({
		user: { temp_access: { until: order } },
	}),
};

const tableColumnToDatabaseOrderObjectHetArchief: Partial<{
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
		group: { label: order },
	}),
	organisation: (order: Avo.Search.OrderDirection) => ({
		maintainer_users_profiles: { maintainer: { schema_name: order } },
	}),
	lastAccessAt: (order: Avo.Search.OrderDirection) => ({
		last_access_at: order,
	}),
};
