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
import { isNil, trimEnd } from 'lodash';
import publicIp from 'public-ip';
import { stringifyUrl } from 'query-string';
import type { ContentTypeNumber } from '../../collections';
import { DataService } from '../../data';
import {
	GetItemBrowsePathByExternalIdDocument,
	type GetItemBrowsePathByExternalIdQuery,
	type GetItemBrowsePathByExternalIdQueryVariables,
} from '../../shared/generated/graphql-db-types-avo';
import {
	GetFileByByIdDocument,
	GetFileByByIdQuery,
	GetFileByByIdQueryVariables,
	GetThumbnailUrlByIdDocument,
	type GetThumbnailUrlByIdQuery,
	type GetThumbnailUrlByIdQueryVariables,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { cleanMultilineEnv } from '../../shared/helpers/env-vars';
import { CustomError } from '../../shared/helpers/error';
import { isHetArchief } from '../../shared/helpers/is-hetarchief';
import { mapToMediaType } from '../../shared/helpers/mapToMediaType';
import { PLAYER_TICKET_EXPIRY } from '../player-ticket.consts';
import {
	PlayerTicket,
	PlayerTicketServiceOptions,
	PlayerTokenOptions,
} from '../player-ticket.types';

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
			process.env.TICKET_SERVICE_MAXAGE || String(PLAYER_TICKET_EXPIRY),
			10
		);
		this.mediaServiceUrl = process.env.MEDIA_SERVICE_URL;
		this.host = process.env.HOST;
	}

	/**
	 * @param path
	 * @param options
	 * @protected
	 */
	protected async getToken(path: string, options: PlayerTokenOptions): Promise<PlayerTicket> {
		const resolvedIp = ['::1', '::ffff:127.0.0.1', '127.0.0.1'].includes(options.ip)
			? await publicIp.v4()
			: options.ip;
		const resolvedReferer = trimEnd(options.referer || this.host, '/');
		const resolvedMaxAge = this.ticketServiceMaxAge;
		const maxAge15Years = 15 * 365 * 24 * 60 * 60; // 15 years in seconds

		// If the domain is public, we allow any client and referer and set the maxage to 15 years
		// This is needed so social media and chat apps can come fetch a thumbnail for the detail page of an ie object
		// https://meemoo.atlassian.net/browse/ARC-2891
		const hasValidStartAndEndTime =
			!isNil(options.startTime) && !isNil(options.endTime) && options.endTime > options.startTime;
		const fragment = hasValidStartAndEndTime
			? {
					start: options.startTime || 0,
					end: options.endTime,
				}
			: undefined;

		const data: PlayerTicketServiceOptions = {
			app: 'hetarchief.be',
			client: options.isPublicDomain ? '' : resolvedIp,
			referer: options.isPublicDomain ? '' : resolvedReferer,
			maxage: options.isPublicDomain ? maxAge15Years : resolvedMaxAge,
			fragment,
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
				.post(`${baseUrl}/${path}`, {
					https: {
						certificate: cleanMultilineEnv(process.env.TICKET_SERVICE_CERT),
						key: cleanMultilineEnv(process.env.TICKET_SERVICE_KEY),
						passphrase: process.env.TICKET_SERVICE_PASSPHRASE,
					},
					body: JSON.stringify(data),
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

	/**
	 * Generates a player token for the given url or path
	 * @param urlOrPath
	 * @param options
	 */
	public async getPlayerToken(urlOrPath: string, options: PlayerTokenOptions): Promise<string> {
		// no caching
		const token = await this.getToken(this.urlToFilePath(urlOrPath), options);
		return token.jwt;
	}

	/**
	 * Returns a token for the given browsePath, tokens are cached for identical requests for 1 hour
	 * @param browsePath
	 * @param options
	 */
	public async getThumbnailTokenCached(
		browsePath: string,
		options: PlayerTokenOptions
	): Promise<string> {
		try {
			const token = await this.cacheManager.wrap(
				options.isPublicDomain
					? `thumbnailToken-${browsePath}`
					: `thumbnailToken-${browsePath}-${options.endTime}-${options.ip}`,
				() => this.getToken(browsePath, options),
				60 * 60 * 1000 // Cache for 1 hour
			);
			return token.jwt;
			// biome-ignore lint/suspicious/noExplicitAny: error can be any type
		} catch (err: any) {
			this.logger.error(
				new CustomError('Error getting token', err, {
					browsePath,
					options,
					errorMessage: err.message,
				})
			);
			throw new InternalServerErrorException('Could not get a thumbnail token');
		}
	}

	/**
	 * Returns a playable URL for the given urlOrPath.
	 * The playable url will have a token attached for authentication on the media service
	 * And a start and end time if that is specified in the options
	 * @param urlOrPath
	 * @param options
	 */
	public async getPlayableUrl(urlOrPath: string, options: PlayerTokenOptions): Promise<string> {
		const token = await this.getPlayerToken(urlOrPath, options);
		return stringifyUrl({
			url: `${this.mediaServiceUrl}/${this.urlToFilePath(urlOrPath)}`,
			query: {
				token,
				t: options.endTime ? `${options.startTime},${options.endTime}` : undefined,
			},
		});
	}

	/**
	 * Get the url of the media file for the current representation or external id of an ie object
	 * @param representationOrExternalId
	 */
	public async getBrowseUrl(representationOrExternalId: string): Promise<string> {
		return (await this.getBrowseUrlAndType(representationOrExternalId)).browsePath;
	}

	/**
	 * Get the url of the media file for the current representation or external id of an ie object
	 * @param fileOrExternalId
	 */
	public async getBrowseUrlAndType(fileOrExternalId: string): Promise<{
		browsePath: string;
		type: 'audio' | 'video' | 'other';
		startTime: number;
		endTime: number;
	}> {
		let response: GetFileByByIdQuery | GetItemBrowsePathByExternalIdQuery;
		if (isHetArchief()) {
			// Het archief
			response = await this.dataService.execute<GetFileByByIdQuery, GetFileByByIdQueryVariables>(
				GetFileByByIdDocument,
				{
					fileId: fileOrExternalId,
				}
			);
		} else {
			// AVO
			response = await this.dataService.execute<
				GetItemBrowsePathByExternalIdQuery,
				GetItemBrowsePathByExternalIdQueryVariables
			>(GetItemBrowsePathByExternalIdDocument, {
				externalId: fileOrExternalId,
			});
		}

		/* istanbul ignore next */
		const browsePath: string =
			(response as GetItemBrowsePathByExternalIdQuery)?.app_item_meta?.[0]?.browse_path ||
			(response as GetFileByByIdQuery)?.graph_file?.[0]?.premis_stored_at;
		const fileType: string | ContentTypeNumber =
			(response as GetItemBrowsePathByExternalIdQuery)?.app_item_meta?.[0]?.type_id ||
			(response as GetFileByByIdQuery)?.graph_file?.[0]?.isRootOf?.[0]?.includes?.[0]
				?.representation?.represents?.dctermsFormat?.[0]?.dcterms_format;
		const startTime: number | undefined = (response as GetFileByByIdQuery)?.graph_file?.[0]
			?.hasMediaFragment?.[0]?.schema_start_time;
		const endTime: number | undefined = (response as GetFileByByIdQuery)?.graph_file?.[0]
			?.hasMediaFragment?.[0]?.schema_end_time;

		if (!browsePath) {
			throw new NotFoundException({
				message: 'Object browse url not found',
				innerException: null,
				additionalInfo: {
					id: fileOrExternalId,
				},
			});
		}

		return { browsePath, type: mapToMediaType(fileType), startTime, endTime };
	}

	/**
	 * Returns a thumbnail URL for the given urlOrPath with a token attached for authentication on the media service
	 * @param urlOrPath
	 * @param options
	 */
	public async resolveThumbnailUrl(
		urlOrPath: string | null | undefined,
		options: PlayerTokenOptions
	): Promise<string> {
		try {
			if (!urlOrPath) {
				return null;
			}
			if (!options.referer) {
				console.error(
					new CustomError(
						'Failed to generate token for thumbnailUrl, since referer is empty',
						null,
						{ urlOrPath, referer: options.referer }
					)
				);
				return urlOrPath;
			}
			if (urlOrPath.includes('?token=')) {
				// URL already has a token
				return urlOrPath;
			}
			const browsePath = this.urlToFilePath(urlOrPath);
			const token = await this.getThumbnailTokenCached(browsePath, options);
			return `${this.mediaServiceUrl}/${browsePath}?token=${token}`;
		} catch (err) {
			console.error(
				new CustomError('Failed to resolveThumbnailUrl', err, {
					urlOrPath,
					options,
				})
			);
			return urlOrPath;
		}
	}

	/**
	 * Get a thumbnail URL for the given id
	 * @param id the schema identifier of the intellectual entity
	 * @param options
	 */
	public async getThumbnailUrl(id: string, options: PlayerTokenOptions): Promise<string> {
		const thumbnailPath = await this.getThumbnailPath(id);
		return this.resolveThumbnailUrl(thumbnailPath, options);
	}

	/**
	 * Get the thumbnail path for the given schema identifier of an ie object
	 * @param id
	 */
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
		return (
			url
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
				.pop()
		);
	}
}
