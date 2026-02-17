import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type { AvoStillsStillInfo } from '@viaa/avo2-types';
import * as promiseUtils from 'blend-promise-utils';
import got from 'got';
import { find, isNil, last } from 'lodash';
import { MediahavenService } from '../mediahaven/services/mediahaven.service';
import { PlayerTicketService } from '../player-ticket';
import { toMilliseconds } from '../shared/helpers/duration';
import { logAndThrow } from '../shared/helpers/logAndThrow';
import { DEFAULT_AUDIO_STILL } from './video-stills.consts';
import {
	ObjectNameInfo,
	ObjectNameInfoAndStills,
	StillsObjectType,
	VideoStill,
	VideoStillRaw,
} from './video-stills.types';
import type {
	StillRequest,
	StillRequestByExternalId,
	StillRequestByFileId,
	StillRequestByStoredAt,
} from './video-stills.validation';

@Injectable()
export class VideoStillsService {
	private logger: Logger = new Logger(VideoStillsService.name, {
		timestamp: true,
	});

	constructor(
		protected playerTicketService: PlayerTicketService,
		protected mediahavenService: MediahavenService
	) {}

	private async getAccessToken() {
		return await this.mediahavenService.getAccessToken({
			tokenEndpoint: process.env.VIDEO_STILLS_TOKEN_ENDPOINT as string,
			username: process.env.VIDEO_STILLS_TOKEN_USERNAME as string,
			password: process.env.VIDEO_STILLS_TOKEN_PASSWORD as string,
			clientId: process.env.VIDEO_STILLS_TOKEN_CLIENT_ID as string,
			clientSecret: process.env.VIDEO_STILLS_TOKEN_CLIENT_SECRET as string,
		});
	}

	/**
	 * Get a video stills from the media server for the specified video path id
	 * https://viaadocumentation.atlassian.net/wiki/spaces/AVO2/pages/1056997395/Request+stills+for+item
	 * @param objectId
	 */
	public async getVideoStills(objectId: string): Promise<VideoStill[]> {
		try {
			const accessToken = await this.getAccessToken();
			const videoStills = await got.get<VideoStillRaw[]>(
				`${process.env.VIDEO_STILLS_ENDPOINT as string}/${objectId}/keyframes`,
				{
					resolveBodyOnly: true,
					responseType: 'json',
					headers: {
						Authorization: `Bearer ${accessToken.token.access_token}`,
					},
				}
			);

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
	): Promise<(AvoStillsStillInfo | null)[]> {
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
				(objectNameInfo: ObjectNameInfoAndStills | null): AvoStillsStillInfo | null => {
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
		let id =
			(stillRequest as StillRequestByExternalId).externalId ||
			(stillRequest as StillRequestByFileId).fileId;
		let storedAt: string | undefined = (stillRequest as StillRequestByStoredAt).storedAt;
		let type: StillsObjectType;
		if (!storedAt) {
			// Fetch extra info to fetch the stills
			const item = await this.playerTicketService.getEmbedUrlAndType(id);

			if (!item) {
				return null;
			}
			storedAt = item.browsePath;
			type = item.type as StillsObjectType;
		} else {
			// Use storedAt directly
			id = (stillRequest as StillRequestByStoredAt).id;
			storedAt = (stillRequest as StillRequestByStoredAt).storedAt;
			type = (stillRequest as StillRequestByStoredAt).type;
		}

		const objectName = this.extractObjectName(storedAt);
		const startTime = stillRequest.startTime;
		if (!objectName || isNil(startTime) || startTime === 0) {
			return null;
		}

		return {
			id,
			type,
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
