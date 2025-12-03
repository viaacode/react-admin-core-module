import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { type Avo } from '@viaa/avo2-types';
import * as promiseUtils from 'blend-promise-utils';
import { addSeconds } from 'date-fns';
import got, { type Got } from 'got';
import { find, isNil, last } from 'lodash';
import { stringify } from 'query-string';

import { PlayerTicketService } from '../player-ticket';
import { toMilliseconds } from '../shared/helpers/duration';
import { logAndThrow } from '../shared/helpers/logAndThrow';

import { DEFAULT_AUDIO_STILL } from './video-stills.consts';
import {
	type ObjectNameInfo,
	type ObjectNameInfoAndStills,
	type VideoStill,
	type VideoStillRaw,
	type VideoStillToken,
} from './video-stills.types';
import type { StillRequest } from './video-stills.validation';

@Injectable()
export class VideoStillsService {
	private logger: Logger = new Logger(VideoStillsService.name, {
		timestamp: true,
	});

	private token: VideoStillToken | null = null;
	private gotInstance: Got;

	constructor(protected playerTicketService: PlayerTicketService) {
		this.gotInstance = got.extend({});
	}

	private async getAccessToken() {
		try {
			const tokenExpiry = new Date(this.token?.expires_at).getTime();
			const now = new Date().getTime();
			const fiveMinutes = 5 * 60 * 1000;

			if (!this.token || tokenExpiry - fiveMinutes < now) {
				const response = await this.gotInstance.post<VideoStillToken>('', {
					prefixUrl: process.env.VIDEO_STILLS_TOKEN_ENDPOINT,
					resolveBodyOnly: true,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					responseType: 'json',
					body: stringify({
						username: process.env.VIDEO_STILLS_TOKEN_USERNAME as string,
						password: process.env.VIDEO_STILLS_TOKEN_PASSWORD as string,
						client_id: process.env.VIDEO_STILLS_TOKEN_CLIENT_ID as string,
						client_secret: process.env.VIDEO_STILLS_TOKEN_CLIENT_SECRET as string,
					}),
				});
				this.token = {
					...response,
					expires_at: addSeconds(new Date(), response.expires_in),
				};
			}
			return this.token.access_token as string;
		} catch (err) {
			logAndThrow(
				new InternalServerErrorException({
					message: 'Failed to get stills service token',
					innerException: err,
					additionalInfo: {
						endpoint: process.env.VIDEO_STILLS_TOKEN_ENDPOINT as string,
						username: process.env.VIDEO_STILLS_TOKEN_USERNAME as string,
						password: process.env.VIDEO_STILLS_TOKEN_PASSWORD as string,
						client_id: process.env.VIDEO_STILLS_TOKEN_CLIENT_ID as string,
						client_secret: process.env.VIDEO_STILLS_TOKEN_CLIENT_SECRET as string,
					},
				})
			);
		}
	}

	/**
	 * Get a video stills from the media server for the specified video path id
	 * https://viaadocumentation.atlassian.net/wiki/spaces/AVO2/pages/1056997395/Request+stills+for+item
	 * @param objectId
	 */
	public async getVideoStills(objectId: string): Promise<VideoStill[]> {
		const config: Record<string, any> | null = null;
		try {
			const accessToken = await this.getAccessToken();
			const videoStills = (await got
				.get(`${process.env.VIDEO_STILLS_ENDPOINT as string}/${objectId}/keyframes`, {
					resolveBodyOnly: true,
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.json()) as VideoStillRaw[];
			return videoStills.map((videoStill: VideoStillRaw): VideoStill => {
				return {
					thumbnailImagePath: videoStill.ThumbnailImagePath,
					previewImagePath: videoStill.PreviewImagePath,
					time: toMilliseconds(videoStill.AbsoluteTimeCode) || 0,
				};
			});
		} catch (err) {
			logAndThrow(
				new InternalServerErrorException({
					message: 'Failed to get stills from video stills service',
					innerException: err,
					additionalInfo: {
						config,
					},
				})
			);
		}
	}

	/**
	 * Get the first video still after the provided start times for all provided videos
	 * @param stillRequests list of info objects containing the video id and their desired start time
	 */
	public async getFirstVideoStills(
		stillRequests: StillRequest[]
	): Promise<(Avo.Stills.StillInfo | null)[]> {
		try {
			// Get browse paths for all items
			const objectNameInfos: (ObjectNameInfo | null)[] = await promiseUtils.mapLimit(
				stillRequests,
				20,
				this.getObjectNameInfo.bind(this)
			);

			// Get stills for all videos
			const allVideoStills: (ObjectNameInfoAndStills | null)[] = await promiseUtils.mapLimit(
				objectNameInfos,
				20,
				this.getVideoStillsWithLogging.bind(this)
			);
			// Get first video still for each video after their startTime
			return allVideoStills.map(
				(objectNameInfo: ObjectNameInfoAndStills | null): Avo.Stills.StillInfo | null => {
					if (!objectNameInfo || objectNameInfo.type === 'other') {
						return null;
					}
					if (objectNameInfo.type === 'audio') {
						// Audio items should never need video keyframes, but always default to the DEFAULT_AUDIO_STILL
						return {
							previewImagePath: DEFAULT_AUDIO_STILL,
							thumbnailImagePath: DEFAULT_AUDIO_STILL,
						};
					}
					const firstVideoStill = find(
						objectNameInfo.videoStills,
						(videoStill: VideoStill) => videoStill.time > objectNameInfo.startTime
					);

					if (!firstVideoStill) {
						return last(objectNameInfo.videoStills) || null;
					}
					return {
						previewImagePath: firstVideoStill.previewImagePath,
						thumbnailImagePath: firstVideoStill.thumbnailImagePath,
					};
				}
			);
		} catch (err) {
			throw new InternalServerErrorException({
				message: 'Failed to get stills in video stills controller',
				innerException: err,
				additionalInfo: {
					stillRequests,
				},
			});
		}
	}

	private async getObjectNameInfo(stillRequest: StillRequest): Promise<ObjectNameInfo | null> {
		const item = await this.playerTicketService.getEmbedUrlAndType(stillRequest.externalId);

		if (!item) {
			return null;
		}

		const objectName = this.extractObjectName(item.browsePath);
		const startTime = stillRequest.startTime;
		if (!objectName || isNil(startTime) || startTime === 0) {
			return null;
		}

		return {
			externalId: stillRequest.externalId,
			type: item.type,
			objectName,
			startTime,
		};
	}

	private async getVideoStillsWithLogging(
		objectNameInfo: ObjectNameInfo | null
	): Promise<ObjectNameInfoAndStills | null> {
		try {
			if (!objectNameInfo) {
				return null;
			}
			return {
				...objectNameInfo,
				videoStills: await this.getVideoStills(objectNameInfo.objectName),
			};
		} catch (err) {
			this.logger.error({
				message: 'Failed to get video stills for objectName',
				innerException: err,
				additionalInfo: {
					objectNameInfo,
				},
			});
			return null; // Avoid failing on a single error, so the other stills still get returned, We'll just log the error
		}
	}

	private extractObjectName(browsePath: string) {
		return browsePath
			.split(/(\/keyframes|\/browse)/g)[0]
			.split('/')
			.pop();
	}
}
