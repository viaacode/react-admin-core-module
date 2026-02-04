import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { DataService } from '../../data';
import {
	GetTableColumnPreferencesForUserDocument,
	GetTableColumnPreferencesForUserQuery,
	GetTableColumnPreferencesForUserQueryVariables,
	InsertTableColumnPreferencesForUserDocument,
	InsertTableColumnPreferencesForUserMutation,
	InsertTableColumnPreferencesForUserMutationVariables,
	UpdateTableColumnPreferencesForUserDocument,
	UpdateTableColumnPreferencesForUserMutation,
	UpdateTableColumnPreferencesForUserMutationVariables,
} from '../../shared/generated/graphql-db-types-avo';
import { customError } from '../../shared/helpers/custom-error';
import { GqlTableColumnPreference } from '../table-column-preferences.types';

@Injectable()
export class TableColumnPreferencesService {
	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {}

	public getColumnsFromPreference(dbTableColumnPreference?: GqlTableColumnPreference): string[] {
		return JSON.parse(dbTableColumnPreference?.visible_columns || '[]');
	}

	public async fetchTableColumnPreference(profileId: string, columnKey: string): Promise<string[]> {
		try {
			const response = await this.dataService.execute<
				GetTableColumnPreferencesForUserQuery,
				GetTableColumnPreferencesForUserQueryVariables
			>(GetTableColumnPreferencesForUserDocument, {
				profileId,
				columnKey,
			});

			return this.getColumnsFromPreference(response?.users_table_column_preferences?.[0]);
		} catch (err) {
			throw customError('Failed to get table column preference from the database', err, {
				query: 'GetTableColumnPreferencesForUser',
			});
		}
	}

	public async saveTableColumnPreference(
		profileId: string,
		columnKey: string,
		columns: string
	): Promise<string[]> {
		try {
			const existingPreference = await this.dataService.execute<
				GetTableColumnPreferencesForUserQuery,
				GetTableColumnPreferencesForUserQueryVariables
			>(GetTableColumnPreferencesForUserDocument, {
				profileId,
				columnKey,
			});

			if (existingPreference?.users_table_column_preferences?.length) {
				return this.updateExistingTableColumnPreference(profileId, columnKey, columns);
			}

			return this.insertTableColumnPreference(profileId, columnKey, columns);
		} catch (err) {
			throw customError('Failed to save table column preference from the database', err, {
				method: 'saveTableColumnPreference',
			});
		}
	}

	public async insertTableColumnPreference(
		profileId: string,
		columnKey: string,
		columns: string
	): Promise<string[]> {
		try {
			const response = await this.dataService.execute<
				InsertTableColumnPreferencesForUserMutation,
				InsertTableColumnPreferencesForUserMutationVariables
			>(InsertTableColumnPreferencesForUserDocument, {
				profileId,
				columnKey,
				columns,
			});

			return this.getColumnsFromPreference(
				response?.insert_users_table_column_preferences?.returning?.[0]
			);
		} catch (err) {
			throw customError('Failed to insert table column preference to the database', err, {
				query: 'InsertTableColumnPreferencesForUserDocument',
			});
		}
	}

	private async updateExistingTableColumnPreference(
		profileId: string,
		columnKey: string,
		columns: string
	): Promise<string[]> {
		try {
			const response = await this.dataService.execute<
				UpdateTableColumnPreferencesForUserMutation,
				UpdateTableColumnPreferencesForUserMutationVariables
			>(UpdateTableColumnPreferencesForUserDocument, {
				profileId,
				columnKey,
				columns,
			});

			return this.getColumnsFromPreference(
				response?.update_users_table_column_preferences?.returning?.[0]
			);
		} catch (err) {
			throw customError('Failed to update table column preference in the database', err, {
				query: 'UpdateTableColumnPreferencesForUserDocument',
			});
		}
	}
}
