import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { AvoStillsStillInfo } from '@viaa/avo2-types';
import type { ValidationResult } from 'joi';
import { SessionUser } from '../shared/decorators/user.decorator';
import { LoggedInGuard } from '../shared/guards/logged-in.guard';
import { addPrefix } from '../shared/helpers/add-route-prefix';
import { CustomError } from '../shared/helpers/error';
import { TranslationsService } from '../translations';
import { SessionUserEntity } from '../users/classes/session-user';
import { VideoStillRequestBodyDto } from './video-stills.dto';
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
		@Body() body: VideoStillRequestBodyDto,
		@SessionUser() sessionUser: SessionUserEntity
	): Promise<(AvoStillsStillInfo | null)[]> {
		// Check inputs
		if (!body.requests || !body.requests.length) {
			throw new BadRequestException(
				this.translationsService.tText(
					'No still requests were passed to the video-stills route',
					{},
					sessionUser.getLanguage()
				)
			);
		}
		const validationResult: ValidationResult<StillRequest[]> = stillRequestValidation.validate(
			body.requests
		);
		if (validationResult.error) {
			throw new BadRequestException(
				this.translationsService.tText(
					"The still requests array doesn't have the expected format",
					{},
					sessionUser.getLanguage()
				) +
					': ' +
					JSON.stringify({ validationResult: JSON.stringify(validationResult.error) })
			);
		}

		// Execute controller
		try {
			return await this.videoStillsService.getFirstVideoStills(body.requests as StillRequest[]);
		} catch (err) {
			const error = new CustomError('Failed during get video stills route', err, {
				videoStillRequests: body.requests,
			});
			console.log(error);
			error.innerException = null;
			throw error;
		}
	}
}
