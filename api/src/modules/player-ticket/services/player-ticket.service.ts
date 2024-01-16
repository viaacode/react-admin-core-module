import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import publicIp from 'public-ip';
import type { Cache } from 'cache-manager';
import got, { Got } from 'got';
import { trimEnd } from 'lodash';

import { DataService } from '../../data';
import {
	GetItemBrowsePathByExternalIdDocument,
	GetItemBrowsePathByExternalIdQuery,
	GetItemBrowsePathByExternalIdQueryVariables,
} from '../../shared/generated/graphql-db-types-avo';
import {
	GetFileByRepresentationSchemaIdentifierDocument,
	GetFileByRepresentationSchemaIdentifierQuery,
	GetFileByRepresentationSchemaIdentifierQueryVariables,
	GetThumbnailUrlByIdDocument,
	GetThumbnailUrlByIdQuery,
	GetThumbnailUrlByIdQueryVariables,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { cleanMultilineEnv } from '../../shared/helpers/env-vars';
import { isHetArchief } from '../../shared/helpers/is-hetarchief';
import { PLAYER_TICKET_EXPIRY } from '../player-ticket.consts';

import { PlayerTicket } from '../player-ticket.types';

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
		@Inject(forwardRef(() => DataService)) protected dataService: DataService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {
		this.playerTicketsGotInstance = got.extend({
			prefixUrl: process.env.TICKET_SERVICE_URL,
			resolveBodyOnly: true,
			responseType: 'json',
			https: {
				rejectUnauthorized: false,
				certificate: cleanMultilineEnv(process.env.TICKET_SERVICE_CERT),
				key: cleanMultilineEnv(process.env.TICKET_SERVICE_KEY),
				passphrase: process.env.TICKET_SERVICE_PASSPHRASE,
			},
		});
		this.ticketServiceMaxAge = parseInt(
			process.env.TICKET_SERVICE_MAXAGE || String(PLAYER_TICKET_EXPIRY)
		);
		this.mediaServiceUrl = process.env.MEDIA_SERVICE_URL;
		this.host = process.env.HOST;
	}

	protected async getToken(path: string, referer: string, ip: string): Promise<PlayerTicket> {
		const data = {
			app: 'OR-*',
			client: ['::1', '::ffff:127.0.0.1', '127.0.0.1'].includes(ip)
				? await publicIp.v4()
				: ip,
			referer: trimEnd(referer || this.host, '/'),
			maxage: this.ticketServiceMaxAge,
		};

		return this.playerTicketsGotInstance.get<PlayerTicket>(path, {
			searchParams: data,
			resolveBodyOnly: true,
		});
	}

	public async getPlayerToken(embedUrl: string, referer: string, ip: string): Promise<string> {
		// no caching
		const token = await this.getToken(embedUrl, referer, ip);
		return token.jwt;
	}

	public async getThumbnailToken(referer: string, ip: string): Promise<string> {
		const thumbnailPath = 'TESTBEELD/keyframes_all';

		try {
			const token = await this.cacheManager.wrap(
				`thumbnailToken-${referer}`,
				() => this.getToken(thumbnailPath, referer, ip),
				600_000 // 10 minutes
			);
			return token.jwt;
		} catch (err: any) {
			this.logger.error(`Error getting token: ${err.message}`);
			throw new InternalServerErrorException('Could not get a thumbnail token');
		}
	}

	public async getPlayableUrl(
		fileRepresentationSchemaIdentifier: string,
		referer: string,
		ip: string
	): Promise<string> {
		const token = await this.getPlayerToken(fileRepresentationSchemaIdentifier, referer, ip);
		return `${this.mediaServiceUrl}/${fileRepresentationSchemaIdentifier}?token=${token}`;
	}

	public async getEmbedUrl(id: string): Promise<string> {
		let response:
			| GetFileByRepresentationSchemaIdentifierQuery
			| GetItemBrowsePathByExternalIdQuery;
		if (isHetArchief()) {
			// Het archief
			response = await this.dataService.execute<
				GetFileByRepresentationSchemaIdentifierQuery,
				GetFileByRepresentationSchemaIdentifierQueryVariables
			>(GetFileByRepresentationSchemaIdentifierDocument, {
				id,
			});
		} else {
			// AVO
			response = await this.dataService.execute<
				GetItemBrowsePathByExternalIdQuery,
				GetItemBrowsePathByExternalIdQueryVariables
			>(GetItemBrowsePathByExternalIdDocument, {
				externalId: id,
			});
		}

		/* istanbul ignore next */
		const browsePath: string =
			(response as GetItemBrowsePathByExternalIdQuery)?.app_item_meta?.[0]?.browse_path ||
			(response as GetFileByRepresentationSchemaIdentifierQuery)?.object_file?.[0]
				?.schema_identifier;
		if (!browsePath) {
			throw new NotFoundException({
				message: 'Object embed url not found',
				innerException: null,
				additionalInfo: {
					id,
				},
			});
		}

		return browsePath;
	}

	public async resolveThumbnailUrl(path: string, referer: string, ip: string): Promise<string> {
		if (!path || !referer) {
			return path;
		}
		if (path.startsWith('https://') || path.startsWith('http://')) {
			// Already an absolute path => return path
			return path;
		}
		const token = await this.getThumbnailToken(referer, ip);
		return `${this.mediaServiceUrl}/${path}?token=${token}`;
	}

	public async getThumbnailUrl(id: string, referer: string, ip: string): Promise<string> {
		const thumbnailPath = await this.getThumbnailPath(id);
		return this.resolveThumbnailUrl(thumbnailPath, referer, ip);
	}

	public async getThumbnailPath(id: string): Promise<string> {
		const response = await this.dataService.execute<
			GetThumbnailUrlByIdQuery,
			GetThumbnailUrlByIdQueryVariables
		>(GetThumbnailUrlByIdDocument, {
			id,
		});
		if (!response.object_ie?.[0]) {
			throw new NotFoundException(`Object IE with id '${id}' not found`);
		}

		return response.object_ie[0].schema_thumbnail_url;
	}
}
