import { forwardRef, Inject } from '@nestjs/common';
import type { AvoAssignmentAssignment } from '@viaa/avo2-types';
import { DataService } from '../data';
import {
	GetPublicAssignmentsByTitleOrIdDocument,
	type GetPublicAssignmentsByTitleOrIdQuery,
	type GetPublicAssignmentsByTitleOrIdQueryVariables,
} from '../shared/generated/graphql-db-types-avo';
import { customError } from '../shared/helpers/custom-error';
import { logAndThrow } from '../shared/helpers/logAndThrow';
import { isUuid } from '../shared/helpers/uuid';

export class AssignmentsService {
	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {
		// Nothing to do here
	}

	public async fetchPublicAssignmentsByTitleOrId(
		titleOrId: string | null,
		limit: number
	): Promise<AvoAssignmentAssignment[]> {
		try {
			const variables: GetPublicAssignmentsByTitleOrIdQueryVariables = {
				title: `%${titleOrId ?? ''}%`,
				id: isUuid(titleOrId) ? titleOrId : '00000000-0000-0000-0000-000000000000',
				limit,
			};
			const response = await this.dataService.execute<
				GetPublicAssignmentsByTitleOrIdQuery,
				GetPublicAssignmentsByTitleOrIdQueryVariables
			>(GetPublicAssignmentsByTitleOrIdDocument, variables);

			return (response.app_assignments_v2 || []) as AvoAssignmentAssignment[];
		} catch (err) {
			logAndThrow(
				customError('Failed to fetch assignment by title or id', err, {
					titleOrId,
					limit,
					query: 'GetPublicAssignmentsByTitleOrId',
				})
			);
		}
	}
}
