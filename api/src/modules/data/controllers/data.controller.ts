import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoggedInGuard } from '../../shared/guards/logged-in.guard';

import { GraphQlQueryDto } from '../dto/graphql-query.dto';
import { DataService } from '../services/data.service';

// import { SessionUserEntity } from '../../users/classes/session-user';
// import { SessionUser } from '../../shared/decorators/user.decorator';

@UseGuards(LoggedInGuard)
@ApiTags('GraphQL')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/data')
export class DataController {
	constructor(private dataService: DataService) {}

	@Post()
	public async post(
		@Body() dataQueryDto: GraphQlQueryDto,
		// @SessionUser() user: SessionUserEntity,
	): Promise<any> {
		return {
			data: await this.dataService.execute(
				dataQueryDto.query,
				dataQueryDto.variables,
			),
			// data: await this.dataService.executeClientQuery(user.getUser(), dataQueryDto);
		};
	}
}
