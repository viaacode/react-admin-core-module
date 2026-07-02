import {
	BadRequestException,
	Controller,
	Get,
	InternalServerErrorException,
	Ip,
	NotFoundException,
	ParseIntPipe,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

// import { LoggedInGuard } from '../shared/guards/logged-in.guard';

import { LoggedInGuard } from '../shared/guards/logged-in.guard';
import { GetPlayableUrlDto } from './dto/GetPlayableUrlDto.dto';
import { PlayerTokenOptions } from './player-ticket.types';
import { PlayerTicketService } from './services/player-ticket.service';

@ApiTags('Player Ticket')
@Controller(`${process.env.ADMIN_CORE_ROUTES_PREFIX}/player-ticket`)
export class PlayerTicketController {
	constructor(private playerTicketService: PlayerTicketService) {}

	@Get('')
	@UseGuards(LoggedInGuard)
	public async getPlayableUrl(
		@Query() queryParams: GetPlayableUrlDto,
		@Req() request: Request,
		@Ip() ip: string
	): Promise<string | string[]> {
		if (!queryParams.externalId && !queryParams.externalIds && !queryParams.browsePath) {
			throw new BadRequestException(
				'Either query param externalId or browsePath is required to fetch a playable url'
			);
		}
		const startTime = /[0-9]+/.test(queryParams.startTime)
			? Number.parseInt(queryParams.startTime, 10)
			: undefined;
		const endTime = /[0-9]+/.test(queryParams.endTime)
			? Number.parseInt(queryParams.endTime, 10)
			: undefined;
		// biome-ignore lint/suspicious/noExplicitAny: get header
		const referer = (request as any).header('Referer') || 'referer-not-defined';
		if (queryParams.externalId) {
			return this.getPlayableUrlByExternalId(queryParams.externalId, {
				referer,
				ip,
				isPublicDomain: false,
				startTime,
				endTime,
			});
		} else if (queryParams.externalIds) {
			return Promise.all(
				queryParams.externalIds.split(',').map((externalId) =>
					this.getPlayableUrlByExternalId(externalId, {
						referer,
						ip,
						startTime,
						endTime,
					})
				)
			);
		} else {
			return this.getPlayableUrlFromBrowsePath(queryParams.browsePath, {
				referer,
				ip,
				startTime,
				endTime,
			});
		}
	}

	/**
	 * Gets a playable url for a given media item
	 * https://viaadocumentation.atlassian.net/wiki/spaces/SI/pages/1063453019/Media+Service
	 * @param externalId external_id of the media item that you want to view
	 * @param options
	 */
	public async getPlayableUrlByExternalId(
		externalId: string,
		options: PlayerTokenOptions
	): Promise<string> {
		try {
			const objectInfo = await this.playerTicketService.getBrowseUrlAndType(externalId);
			if (!objectInfo?.browsePath) {
				throw new NotFoundException({
					message: 'Object with external id was not found',
				});
			}
			return this.getPlayableUrlFromBrowsePath(objectInfo.browsePath, {
				...options,
				startTime: options.startTime || objectInfo.startTime,
			});
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to get player ticket',
				innerException: err,
				additionalInfo: {
					externalId,
					options,
				},
			});
		}
	}

	/**
	 * Generates a playable url for a video
	 * @param browsePath
	 * @param options
	 */
	public async getPlayableUrlFromBrowsePath(
		browsePath: string,
		options: PlayerTokenOptions
	): Promise<string> {
		try {
			const fileRepresentationSchemaIdentifier: string | undefined =
				this.playerTicketService.urlToFilePath(browsePath);

			if (!fileRepresentationSchemaIdentifier) {
				throw new InternalServerErrorException({
					message: 'Failed to extract object name from browse path for media item',
					innerException: null,
					additionalInfo: {
						browsePath,
						objectName: fileRepresentationSchemaIdentifier,
					},
				});
			}

			return this.playerTicketService.getPlayableUrl(fileRepresentationSchemaIdentifier, options);
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to get player ticket',
				innerException: err,
				additionalInfo: {
					browsePath,
					options,
				},
			});
		}
	}

	/**
	 * Generates a ticket for a file path
	 * @param urlOrPath eg: image/3/public%252FOR-1c1tf48%252F13%252F13cdb1aa21704313a6ded7da5fabf53f0a9571a68c6540e18725440376c089c2813e3eec887041e1ab908a4c20a46d15.jp2
	 * @param referer
	 * @param ip
	 * @param startTime
	 * @param endTime
	 */
	@Get('token')
	public async getTicketServiceTokenForFilePath(
		@Query('filePath') urlOrPath: string,
		@Query('referer') referer: string,
		@Ip() ip: string,
		@Query('startTime', ParseIntPipe) startTime: number,
		@Query('endTime', ParseIntPipe) endTime: number
	): Promise<string> {
		try {
			return await this.playerTicketService.getPlayerToken(urlOrPath, {
				referer,
				ip,
				isPublicDomain: false,
				startTime,
				endTime,
			});
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to get ticket for file path',
				innerException: err,
				additionalInfo: {
					filePath: urlOrPath,
					referer,
					ip,
				},
			});
		}
	}
}
