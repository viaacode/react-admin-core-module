import type { Avo } from '@viaa/avo2-types';

import {
	type Order_By,
	type Users_Summary_View_Order_By,
} from '../shared/generated/graphql-db-types-avo';
import { isAvo } from '../shared/helpers/is-avo';

import { type UserOverviewTableCol } from './users.types';

export const GET_TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT = (): Partial<{
	[columnId in UserOverviewTableCol]: (order: Avo.Search.OrderDirection) => any;
}> => {
	if (isAvo()) {
		return tableColumnToDatabaseOrderObjectAvo;
	}
	return tableColumnToDatabaseOrderObjectHetArchief;
};

const tableColumnToDatabaseOrderObjectAvo: {
	[columnId in UserOverviewTableCol]: ((order: Avo.Search.OrderDirection) => any) | null;
} = {
	firstName: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		first_name_lower: order as Order_By,
	}),
	lastName: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		last_name_lower: order as Order_By,
	}),
	fullName: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		full_name: order as Order_By,
	}),
	email: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		mail: order as Order_By,
	}),
	userGroup: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		group_name: order as Order_By,
	}),
	businessCategory: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		business_category: order as Order_By,
	}),
	isBlocked: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		is_blocked: order as Order_By,
	}),
	isException: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		is_exception: order as Order_By,
	}),
	blockedAt: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		blocked_at: {
			max: order as Order_By,
		},
	}),
	unblockedAt: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		unblocked_at: {
			max: order as Order_By,
		},
	}),
	stamboek: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		stamboek: order as Order_By,
	}),
	organisation: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		company_name: order as Order_By,
	}),
	createdAt: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		acc_created_at: order as Order_By,
	}),
	lastAccessAt: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		last_access_at: order as Order_By,
	}),
	tempAccess: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		profile: { temp_access: { has_currently_access: { status: order as Order_By } } },
	}),
	tempAccessFrom: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		profile: { temp_access: { from: order as Order_By } },
	}),
	tempAccessUntil: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		profile: { temp_access: { until: order as Order_By } },
	}),
	profileId: (order: Avo.Search.OrderDirection): Users_Summary_View_Order_By => ({
		profile_id: order as Order_By,
	}),
	educationLevels: null,
	subjects: null,
	idps: null,
	educationalOrganisations: null,
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
	fullName: (order: Avo.Search.OrderDirection) => ({
		full_name: order,
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
