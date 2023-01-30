import {
	BadRequestException,
	Controller,
	Get,
	InternalServerErrorException,
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
	) {
		if (
			!queryParams.externalId &&
			!queryParams.externalIds &&
			!queryParams.browsePath
		) {
			throw new BadRequestException(
				'Either query param externalId or browsePath is required to fetch a playable url',
			);
		}
		const referrer = request.header('Referer') || 'referer-not-defined';
		if (queryParams.externalId) {
			return this.getPlayableUrlByExternalId(queryParams.externalId, referrer);
		} else if (queryParams.externalIds) {
			return Promise.all(
				queryParams.externalIds
					.split(',')
					.map((externalId) =>
						this.getPlayableUrlByExternalId(externalId, referrer),
					),
			);
		} else {
			return this.getPlayableUrlFromBrowsePath(
				queryParams.browsePath,
				referrer,
			);
		}
	}

	/**
	 * Gets a playable url for a given media item
	 * https://viaadocumentation.atlassian.net/wiki/spaces/SI/pages/1063453019/Media+Service
	 * @param externalId: external_id of the media item that you want to view
	 * @param referrer
	 */
	public async getPlayableUrlByExternalId(
		externalId: string,
		referrer: string,
	): Promise<string> {
		try {
			const browsePath = await this.playerTicketService.getEmbedUrl(externalId);
			if (!browsePath) {
				throw new NotFoundException({
					message: 'Object with external id was not found',
				});
			}
			return this.getPlayableUrlFromBrowsePath(browsePath, referrer);
		} catch (err) {
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

	public async getPlayableUrlFromBrowsePath(
		browsePath: string,
		referrer: string,
	): Promise<string> {
		try {
			const objectName: string | undefined = browsePath
				.split('archief-media.viaa.be/viaa/')
				.pop();

			if (!objectName) {
				throw new InternalServerErrorException({
					message:
						'Failed to extract object name from browse path for media item',
					innerException: null,
					additionalInfo: {
						browsePath,
						objectName,
					},
				});
			}

			return this.playerTicketService.getPlayableUrl(objectName, referrer);
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to get player ticket',
				innerException: err,
				additionalInfo: {
					referrer,
				},
			});
		}
	}
}
