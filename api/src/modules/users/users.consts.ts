import type { Avo } from '@viaa/avo2-types';
import { DatabaseType } from '@viaa/avo2-types';
import { UserOverviewTableCol } from './users.types';

export const GET_TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT = (): Partial<{
	[columnId in UserOverviewTableCol]: (order: Avo.Search.OrderDirection) => any;
}> => {
	if (process.env.DATABASE_APPLICATION_TYPE === DatabaseType.avo) {
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
	last_access_at: (order: Avo.Search.OrderDirection) => ({
		last_access_at: order,
	}),
};
