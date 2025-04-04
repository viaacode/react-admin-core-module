import {
	BadRequestException,
	Controller,
	Get,
	InternalServerErrorException,
	Ip,
	NotFoundException,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LoggedInGuard } from '../shared/guards/logged-in.guard';

import { GetPlayableUrlDto } from './dto/GetPlayableUrlDto.dto';
import { PlayerTicketService } from './services/player-ticket.service';

@ApiTags('Player Ticket')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/player-ticket')
export class PlayerTicketController {
	constructor(private playerTicketService: PlayerTicketService) {}

	@Get('')
	@UseGuards(LoggedInGuard)
	public async getPlayableUrl(
		@Query() queryParams: GetPlayableUrlDto,
		@Req() request,
		@Ip() ip
	): Promise<string | string[]> {
		if (!queryParams.externalId && !queryParams.externalIds && !queryParams.browsePath) {
			throw new BadRequestException(
				'Either query param externalId or browsePath is required to fetch a playable url'
			);
		}
		const referrer = request.header('Referer') || 'referer-not-defined';
		if (queryParams.externalId) {
			return this.getPlayableUrlByExternalId(queryParams.externalId, referrer, ip);
		} else if (queryParams.externalIds) {
			return Promise.all(
				queryParams.externalIds
					.split(',')
					.map((externalId) => this.getPlayableUrlByExternalId(externalId, referrer, ip))
			);
		} else {
			return this.getPlayableUrlFromBrowsePath(queryParams.browsePath, referrer, ip);
		}
	}

	/**
	 * Gets a playable url for a given media item
	 * https://viaadocumentation.atlassian.net/wiki/spaces/SI/pages/1063453019/Media+Service
	 * @param externalId external_id of the media item that you want to view
	 * @param referrer
	 * @param ip
	 */
	public async getPlayableUrlByExternalId(
		externalId: string,
		referrer: string,
		ip: string
	): Promise<string> {
		try {
			const browsePath = await this.playerTicketService.getEmbedUrl(externalId);
			if (!browsePath) {
				throw new NotFoundException({
					message: 'Object with external id was not found',
				});
			}
			return this.getPlayableUrlFromBrowsePath(browsePath, referrer, ip);
		} catch (err: any) {
			throw new InternalServerErrorException({
				message: 'Failed to get player ticket',
				innerException: err,
				additionalInfo: {
					externalId,
					referrer,
				},
			});
		}
	}

	/**
	 * Generates a playable url for a video
	 * @param browsePath
	 * @param referrer
	 * @param ip
	 */
	public async getPlayableUrlFromBrowsePath(
		browsePath: string,
		referrer: string,
		ip: string
	): Promise<string> {
		try {
			const fileRepresentationSchemaIdentifier: string | undefined = browsePath
				// Deprecated unprotected url
				.split(/archief-media(-qas|-tst|-int|-prd)?\.viaa\.be\/viaa\//g)
				.pop()
				// New protected url
				.split(/media(-qas|-tst|-int|-prd)?\.viaa\.be[/.]play\/v2\//)
				// .split(/media(-qas|-tst|-int|-prd)?\.viaa\.be\/play\/v2\//) // TODO enable once https://meemoo.atlassian.net/browse/ARC-2816 is fixed
				.pop();

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

			return this.playerTicketService.getPlayableUrl(
				fileRepresentationSchemaIdentifier,
				referrer,
				ip
			);
		} catch (err: any) {
			throw new InternalServerErrorException({
				message: 'Failed to get player ticket',
				innerException: err,
				additionalInfo: {
					referrer,
				},
			});
		}
	}

	/**
	 * Generates a ticket for a file path
	 * @param filePath eg: image/3/public%252FOR-1c1tf48%252F13%252F13cdb1aa21704313a6ded7da5fabf53f0a9571a68c6540e18725440376c089c2813e3eec887041e1ab908a4c20a46d15.jp2
	 * @param referrer
	 * @param ip
	 */
	@Get('token')
	public async getTicketServiceTokenForFilePath(
		@Query('filePath') filePath: string,
		@Query('referrer') referrer: string,
		@Ip() ip: string
	): Promise<string> {
		try {
			return await this.playerTicketService.getPlayerToken(filePath, referrer, ip);
		} catch (err: any) {
			throw new InternalServerErrorException({
				message: 'Failed to get ticket for file path',
				innerException: err,
				additionalInfo: {
					filePath,
					referrer,
					ip,
				},
			});
		}
	}
}
