import type { AvoSearchOrderDirection } from '@viaa/avo2-types';
import type {
	Order_By,
	Users_Summary_View_Order_By,
} from '../shared/generated/graphql-db-types-avo';
import { isAvo } from '../shared/helpers/is-avo';
import type { UserOverviewTableCol } from './users.types';

export const GET_TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT = (): Partial<{
	// biome-ignore lint/suspicious/noExplicitAny: todo
	[columnId in UserOverviewTableCol]: (order: AvoSearchOrderDirection) => any;
}> => {
	if (isAvo()) {
		return tableColumnToDatabaseOrderObjectAvo;
	}
	return tableColumnToDatabaseOrderObjectHetArchief;
};

const tableColumnToDatabaseOrderObjectAvo: {
	// biome-ignore lint/suspicious/noExplicitAny: todo
	[columnId in UserOverviewTableCol]: ((order: AvoSearchOrderDirection) => any) | null;
} = {
	firstName: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		first_name_lower: order as unknown as Order_By,
	}),
	lastName: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		last_name_lower: order as unknown as Order_By,
	}),
	fullName: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		full_name: order as unknown as Order_By,
	}),
	email: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		mail: order as unknown as Order_By,
	}),
	userGroup: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		group_name: order as unknown as Order_By,
	}),
	businessCategory: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		business_category: order as unknown as Order_By,
	}),
	isBlocked: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		is_blocked: order as unknown as Order_By,
	}),
	isException: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		is_exception: order as unknown as Order_By,
	}),
	blockedAt: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		blocked_at: {
			max: order as unknown as Order_By,
		},
	}),
	unblockedAt: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		unblocked_at: {
			max: order as unknown as Order_By,
		},
	}),
	stamboek: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		stamboek: order as unknown as Order_By,
	}),
	organisation: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		company_name: order as unknown as Order_By,
	}),
	createdAt: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		acc_created_at: order as unknown as Order_By,
	}),
	lastAccessAt: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		last_access_at: order as unknown as Order_By,
	}),
	tempAccess: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		profile: {
			temp_access: { has_currently_access: { status: order as unknown as Order_By } },
		},
	}),
	tempAccessFrom: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		profile: { temp_access: { from: order as unknown as Order_By } },
	}),
	tempAccessUntil: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		profile: { temp_access: { until: order as unknown as Order_By } },
	}),
	profileId: (order: AvoSearchOrderDirection): Users_Summary_View_Order_By => ({
		profile_id: order as unknown as Order_By,
	}),
	educationLevels: null,
	subjects: null,
	idps: null,
	educationalOrganisations: null,
};

const tableColumnToDatabaseOrderObjectHetArchief: Partial<{
	// biome-ignore lint/suspicious/noExplicitAny: todo
	[columnId in UserOverviewTableCol]: (order: AvoSearchOrderDirection) => any;
}> = {
	firstName: (order: AvoSearchOrderDirection) => ({
		first_name: order,
	}),
	lastName: (order: AvoSearchOrderDirection) => ({
		last_name: order,
	}),
	fullName: (order: AvoSearchOrderDirection) => ({
		full_name: order,
	}),
	email: (order: AvoSearchOrderDirection) => ({
		mail: order,
	}),
	userGroup: (order: AvoSearchOrderDirection) => ({
		group: { label: order },
	}),
	organisation: (order: AvoSearchOrderDirection) => ({
		maintainer_users_profiles: { maintainer: { schema_name: order } },
	}),
	lastAccessAt: (order: AvoSearchOrderDirection) => ({
		last_access_at: order,
	}),
};
