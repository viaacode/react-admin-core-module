import { Controller, Get } from "@nestjs/common";
import { ApiTags } from '@nestjs/swagger';

import { LookupService } from './lookup.service';

@ApiTags('Lookup')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/lookup')
export class LookupController {
	constructor(private lookupService: LookupService) {
	}

	@Get('subjects')
	public async fetchSubjects(): Promise<string[]> {
		return this.lookupService.fetchSubjects();
	}

	@Get('education-levels')
	public async fetchEducationLevels(): Promise<string[]> {
		return this.lookupService.fetchEducationLevels();
	}
}
