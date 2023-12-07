import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Avo } from '@viaa/avo2-types';

import { LookupService } from './lookup.service';

@ApiTags('Lookup')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/lookup')
export class LookupController {
	constructor(private lookupService: LookupService) {}

	@Get('subjects')
	public async fetchSubjects(): Promise<Avo.Lom.LomField[]> {
		return this.lookupService.fetchSubjects();
	}

	@Get('education-levels')
	public async fetchEducationLevels(): Promise<Avo.Lom.LomField[]> {
		return this.lookupService.fetchEducationLevels();
	}

	@Get('themes')
	public async fetchThemes(): Promise<Avo.Lom.LomField[]> {
		return this.lookupService.fetchThemes();
	}
}
