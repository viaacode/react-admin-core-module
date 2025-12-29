import {
	BadRequestException,
	Body,
	Controller,
	InternalServerErrorException,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { AvoStillsStillInfo } from '@viaa/avo2-types';
import type { ValidationResult } from 'joi';
import { SessionUser } from '../shared/decorators/user.decorator';
import { LoggedInGuard } from '../shared/guards/logged-in.guard';
import { addPrefix } from '../shared/helpers/add-route-prefix';
import { logAndThrow } from '../shared/helpers/logAndThrow';
import { TranslationsService } from '../translations';
import { SessionUserEntity } from '../users/classes/session-user';
import { VideoStillsService } from './video-stills.service';
import { type StillRequest, stillRequestValidation } from './video-stills.validation';

@UseGuards(LoggedInGuard)
@ApiTags('VideoStills')
@Controller(addPrefix(process, 'video-stills'))
export class VideoStillsController {
	constructor(
		private translationsService: TranslationsService,
		private videoStillsService: VideoStillsService
	) {}

	/**
	 * Get the first video still for each external id after the provided start time
	 */
	@Post()
	async getVideoStills(
		@Body() stillRequests: StillRequest[],
		@SessionUser() sessionUser: SessionUserEntity
	): Promise<(AvoStillsStillInfo | null)[]> {
		// Check inputs
		if (!stillRequests || !stillRequests.length) {
			throw new BadRequestException(
				this.translationsService.tText(
					'No still requests were passed to the video-stills route',
					{},
					sessionUser.getLanguage()
				)
			);
		}
		const validationResult: ValidationResult<StillRequest[]> =
			stillRequestValidation.validate(stillRequests);
		if (validationResult.error) {
			throw new BadRequestException(
				this.translationsService.tText(
					"The still requests array doesn't have the expected format",
					{ validationResult: JSON.stringify(validationResult.error) },
					sessionUser.getLanguage()
				)
			);
		}

		// Execute controller
		try {
			return await this.videoStillsService.getFirstVideoStills(stillRequests);
		} catch (err) {
			logAndThrow(
				new InternalServerErrorException({
					message: 'Failed during get video stills route',
					innerException: err,
					additionalInfo: {
						stillRequests,
					},
				})
			);
		}
	}
}
