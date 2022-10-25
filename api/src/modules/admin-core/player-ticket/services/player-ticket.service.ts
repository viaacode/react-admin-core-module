import {
	CACHE_MANAGER,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Cache } from 'cache-manager';
import { differenceInSeconds } from 'date-fns';
import got, { Got } from 'got';

import { Configuration } from '../../../../config';

import { PlayerTicket } from '../player-ticket.types';

import { AvoOrHetArchief } from '../../content-pages/content-pages.types';
import { DataService } from '../../data/services/data.service';
import {
	GetFileByRepresentationSchemaIdentifierDocument,
	GetFileByRepresentationSchemaIdentifierQuery,
	GetFileByRepresentationSchemaIdentifierQueryVariables,
	GetThumbnailUrlByIdDocument,
	GetThumbnailUrlByIdQuery,
	GetThumbnailUrlByIdQueryVariables,
} from '../../shared/generated/graphql-db-types-hetarchief';
import {
	GetItemBrowsePathByExternalIdDocument,
	GetItemBrowsePathByExternalIdQuery,
	GetItemBrowsePathByExternalIdQueryVariables,
} from '../../shared/generated/graphql-db-types-avo';

@Injectable()
export class PlayerTicketService {
	private logger: Logger = new Logger(PlayerTicketService.name, {
		timestamp: true,
	});
	private playerTicketsGotInstance: Got;
	private readonly ticketServiceMaxAge: number;
	private readonly mediaServiceUrl: string;
	private readonly host: string;

	constructor(
			protected configService: ConfigService<Configuration>,
			@Inject(forwardRef(() => DataService)) protected dataService: DataService,
			@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {
		this.playerTicketsGotInstance = got.extend({
			prefixUrl: this.configService.get('TICKET_SERVICE_URL'),
			resolveBodyOnly: true,
			responseType: 'json',
			https: {
				rejectUnauthorized: false,
				certificate:
						this.configService.get('TICKET_SERVICE_CERTIFICATE',
						),
				key: this.configService.get('TICKET_SERVICE_KEY'),
				passphrase: this.configService.get('TICKET_SERVICE_PASSPHRASE'),
			},
		});
		this.ticketServiceMaxAge =
				this.configService.get(
						'TICKET_SERVICE_MAX_AGE',
				);
		this.mediaServiceUrl = this.configService.get('MEDIA_SERVICE_URL');
		this.host = this.configService.get('HOST');
	}

	protected async getToken(
			path: string,
			referer: string,
	): Promise<PlayerTicket> {
		const data = {
			app: 'OR-*',
			client: '', // TODO: Wait for reply on ARC-536 and implement resolution
			referer: referer || this.host,
			maxage: this.ticketServiceMaxAge,
		};

		const playerTicket: PlayerTicket =
				await this.playerTicketsGotInstance.get<PlayerTicket>(path, {
					searchParams: data,
					resolveBodyOnly: true,
				});

		return playerTicket;
	}

	public async getPlayerToken(
			embedUrl: string,
			referer: string,
	): Promise<string> {
		// no caching
		const token = await this.getToken(embedUrl, referer);
		return token.jwt;
	}

	public async getThumbnailToken(referer: string): Promise<string> {
		const thumbnailPath = 'TESTBEELD/keyframes_all';

		const options = {
			ttl: (token) =>
					differenceInSeconds(new Date(token.context.expiration), new Date()) -
					60, // 60s margin to get the new token
		};
		try {
			const token = await this.cacheManager.wrap(
					`thumbnailToken-${referer}`,
					() => this.getToken(thumbnailPath, referer),
					options,
			);
			return token.jwt;
		} catch (err) {
			this.logger.error(`Error getting token: ${err.message}`);
			throw new InternalServerErrorException('Could not get a thumbnail token');
		}
	}

	public async getPlayableUrl(
			embedUrl: string,
			referer: string,
	): Promise<string> {
		const token = await this.getPlayerToken(embedUrl, referer);

		return `${this.mediaServiceUrl}/${embedUrl}?token=${token}`;
	}

	public async getEmbedUrl(id: string): Promise<string> {
		let response;
		if (
				this.configService.get('DATABASE_APPLICATION_TYPE') ===
				AvoOrHetArchief.hetArchief
		) {
			// Het archief
			response = await this.dataService.execute<GetFileByRepresentationSchemaIdentifierQuery,
					GetFileByRepresentationSchemaIdentifierQueryVariables>(GetFileByRepresentationSchemaIdentifierDocument, {
				id,
			});
		} else {
			// AVO
			response = await this.dataService.execute<GetItemBrowsePathByExternalIdQuery,
					GetItemBrowsePathByExternalIdQueryVariables>(GetItemBrowsePathByExternalIdDocument, {
				externalId: id,
			});
		}

		/* istanbul ignore next */
		const browsePath: string =
				response?.data?.app_item_meta?.[0]?.browse_path ||
				response?.data?.object_file?.[0]?.schema_embed_url;
		if (!browsePath) {
			throw new NotFoundException(
					`Object file with representation_id '${id}' not found`,
			);
		}

		return browsePath;
	}

	public async resolveThumbnailUrl(
			path: string,
			referer: string,
	): Promise<string> {
		if (!path || !referer) {
			return path;
		}
		if (path.startsWith('https://') || path.startsWith('http://')) {
			// Already an absolute path => return path
			return path;
		}
		const token = await this.getThumbnailToken(referer);
		return `${this.mediaServiceUrl}/${path}?token=${token}`;
	}

	public async getThumbnailUrl(id: string, referer: string): Promise<string> {
		const thumbnailPath = await this.getThumbnailPath(id);
		return this.resolveThumbnailUrl(thumbnailPath, referer);
	}

	public async getThumbnailPath(id: string): Promise<string> {
		const response = await this.dataService.execute<GetThumbnailUrlByIdQuery,
				GetThumbnailUrlByIdQueryVariables>(GetThumbnailUrlByIdDocument, {
			id,
		});
		if (!response.object_ie?.[0]) {
			throw new NotFoundException(`Object IE with id '${id}' not found`);
		}

		return response.object_ie[0].schema_thumbnail_url;
	}
}
