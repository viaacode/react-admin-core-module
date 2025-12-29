import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import type { AvoAssignmentAssignment } from '@viaa/avo2-types';
import { AssignmentsService } from './assignments.service';

@ApiTags('Assignments')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/assignments')
export class AssignmentsController {
	constructor(private assignmentsService: AssignmentsService) {}

	@Get('public')
	@ApiQuery({
		name: 'titleOrId',
		description: 'The partial title or the full uuid of the assignment',
		required: false,
		type: String,
	})
	@ApiQuery({
		name: 'limit',
		description: 'The number of results you want to receive',
		required: true,
		type: Number,
		example: 5,
	})
	public async fetchPublicAssignmentsByTitleOrId(
		@Query('titleOrId') titleOrId: string | undefined,
		@Query('limit', ParseIntPipe) limit: number
	): Promise<AvoAssignmentAssignment[]> {
		return this.assignmentsService.fetchPublicAssignmentsByTitleOrId(titleOrId, limit);
	}
}
