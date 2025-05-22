import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import type { Cache } from 'cache-manager';
import got from 'got';
import { trimEnd } from 'lodash';
import publicIp from 'public-ip';

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

import { CustomError } from 'src/modules/shared/helpers/error';

@Injectable()
export class PlayerTicketService {
	private logger: Logger = new Logger(PlayerTicketService.name, {
		timestamp: true,
	});
	private readonly ticketServiceMaxAge: number;
	private readonly mediaServiceUrl: string;
	private readonly host: string;

	constructor(
		@Inject(forwardRef(() => DataService)) protected dataService: DataService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {
		// Create an HTTPS agent to handle custom TLS configuration:
		this.ticketServiceMaxAge = parseInt(
			process.env.TICKET_SERVICE_MAXAGE || String(PLAYER_TICKET_EXPIRY)
		);
		this.mediaServiceUrl = process.env.MEDIA_SERVICE_URL;
		this.host = process.env.HOST;
	}

	/**
	 * @param path
	 * @param referer
	 * @param ip
	 * @protected
	 */
	protected async getToken(path: string, referer: string, ip: string): Promise<PlayerTicket> {
		const data = {
			app: 'hetarchief.be',
			client: ['::1', '::ffff:127.0.0.1', '127.0.0.1'].includes(ip)
				? await publicIp.v4()
				: ip,
			referer: trimEnd(referer || this.host, '/'),
			maxage: this.ticketServiceMaxAge,
		};

		/**
		 * Build the full URL from the base TICKET_SERVICE_URL and the path;
		 * then append the query params from `data`.
		 */
		try {
			const baseUrl = process.env.TICKET_SERVICE_URL as string;
			// Use baseUrl + / + path instead of query param name to pass the browsePath
			// Since it seems like the query param is being truncated: https://meemoo.atlassian.net/browse/ARC-2817
			const response = await got
				.get(baseUrl + '/' + path, {
					https: {
						certificate: cleanMultilineEnv(process.env.TICKET_SERVICE_CERT),
						key: cleanMultilineEnv(process.env.TICKET_SERVICE_KEY),
						passphrase: process.env.TICKET_SERVICE_PASSPHRASE,
					},
					searchParams: data,
					headers: {
						Accept: '*/*',
					},
				})
				.json();

			return response as PlayerTicket;
		} catch (err) {
			console.error(err);
			throw err;
		}
	}

	public async getPlayerToken(urlOrPath: string, referer: string, ip: string): Promise<string> {
		// no caching
		const token = await this.getToken(this.urlToFilePath(urlOrPath), referer, ip);
		return token.jwt;
	}

	public async getThumbnailTokenCached(
		browsePath: string,
		referer: string,
		ip: string
	): Promise<string> {
		try {
			const token = await this.cacheManager.wrap(
				`thumbnailToken-${browsePath}-${referer}-${ip}`,
				() => this.getToken(browsePath, referer, ip),
				60 * 60 * 1000 // 1 hour
			);
			return token.jwt;
		} catch (err: any) {
			this.logger.error(
				new CustomError('Error getting token', err, {
					browsePath,
					referer,
					ip,
					errorMessage: err.message,
				})
			);
			throw new InternalServerErrorException('Could not get a thumbnail token');
		}
	}

	public async getPlayableUrl(urlOrPath: string, referer: string, ip: string): Promise<string> {
		const token = await this.getPlayerToken(urlOrPath, referer, ip);
		return `${this.mediaServiceUrl}/${this.urlToFilePath(urlOrPath)}?token=${token}`;
	}

	public async getEmbedUrl(representationOrExternalId: string): Promise<string> {
		let response:
			| GetFileByRepresentationSchemaIdentifierQuery
			| GetItemBrowsePathByExternalIdQuery;
		if (isHetArchief()) {
			// Het archief
			response = await this.dataService.execute<
				GetFileByRepresentationSchemaIdentifierQuery,
				GetFileByRepresentationSchemaIdentifierQueryVariables
			>(GetFileByRepresentationSchemaIdentifierDocument, {
				id: representationOrExternalId,
			});
		} else {
			// AVO
			response = await this.dataService.execute<
				GetItemBrowsePathByExternalIdQuery,
				GetItemBrowsePathByExternalIdQueryVariables
			>(GetItemBrowsePathByExternalIdDocument, {
				externalId: representationOrExternalId,
			});
		}

		/* istanbul ignore next */
		const browsePath: string =
			(response as GetItemBrowsePathByExternalIdQuery)?.app_item_meta?.[0]?.browse_path ||
			(response as GetFileByRepresentationSchemaIdentifierQuery)?.graph_representation?.[0]
				?.includes?.[0]?.file?.premis_stored_at;
		if (!browsePath) {
			throw new NotFoundException({
				message: 'Object embed url not found',
				innerException: null,
				additionalInfo: {
					id: representationOrExternalId,
				},
			});
		}

		return browsePath;
	}

	public async resolveThumbnailUrl(
		urlOrPath: string | null | undefined,
		referer: string,
		ip: string
	): Promise<string> {
		try {
			if (!urlOrPath) {
				return null;
			}
			if (!referer) {
				console.error(
					new CustomError(
						'Failed to generate token for thumbnailUrl, since referer is empty',
						null,
						{ urlOrPath, referer }
					)
				);
				return urlOrPath;
			}
			const browsePath = this.urlToFilePath(urlOrPath);
			const token = await this.getThumbnailTokenCached(browsePath, referer, ip);
			return `${this.mediaServiceUrl}/${browsePath}?token=${token}`;
		} catch (err) {
			console.error(
				new CustomError('Failed to resolveThumbnailUrl', err, {
					urlOrPath,
					referer,
					ip,
				})
			);
			return urlOrPath;
		}
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
		if (!response.graph__intellectual_entity?.[0]) {
			throw new NotFoundException(`Object IE with id '${id}' not found`);
		}

		const thumbnailPath = response.graph__intellectual_entity[0].schema_thumbnail_url;
		if (typeof thumbnailPath === 'string') {
			return thumbnailPath;
		} else {
			if (!thumbnailPath || !thumbnailPath[0]) {
				return null;
			}
			return thumbnailPath[0];
		}
	}

	public urlToFilePath(url: string): string {
		const filePath = url
			// Deprecated unprotected url
			.split(/archief-media(-int|-tst|-qas|-prd)?\.viaa\.be\/viaa\//g)
			.pop()
			// New protected url
			.split(/media(-int|-tst|-qas|-prd)?\.viaa\.be[/.]play\/v2\//)
			// .split(/media(-int|-tst|-qas|-prd)?\.viaa\.be\/play\/v2\//) // TODO enable once https://meemoo.atlassian.net/browse/ARC-2816 is fixed
			.pop()
			// IIIF urls
			.split(/iiif(-int|-tst|-qas|-prd)?\.meemoo\.be\//)
			.pop()
			// Alto urls
			.split(/s3(-int|-tst|-qas|-prd)?\.do\.viaa\.be\//)
			.pop();
		return filePath;
	}
}
