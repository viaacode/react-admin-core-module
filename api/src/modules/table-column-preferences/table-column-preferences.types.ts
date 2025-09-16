import { type GetTableColumnPreferencesForUserQuery } from '../shared/generated/graphql-db-types-avo';

export interface TableColumnPreference {
	id: number;
	values: string;
	key: string;
}

export type GqlTableColumnPreference =
	GetTableColumnPreferencesForUserQuery['users_table_column_preferences'][0];
