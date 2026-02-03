import Joi from 'joi';
import { StillsObjectType } from './video-stills.types';

export type StillRequestByExternalId = {
	// For avo you can use the external id of a video
	externalId: string;
	startTime: number; // milliseconds
};

export type StillRequestByFileId = {
	// For hetarchief you need to use the fileId of the video file
	fileId: string;
	startTime: number; // milliseconds
};

export type StillRequestByStoredAt = {
	// For both you can use the stored at url (one less lookup, most efficient)
	id: string;
	storedAt: string;
	type: StillsObjectType;
	startTime: number; // milliseconds
};

export type StillRequest = StillRequestByExternalId | StillRequestByFileId | StillRequestByStoredAt;

export const stillRequestValidation = Joi.array().items(
	Joi.alternatives().try(
		Joi.object({
			externalId: Joi.string().min(3).required(),
			startTime: Joi.number().min(0).required(),
		}),
		Joi.object({
			fileId: Joi.string().min(3).required(),
			startTime: Joi.number().min(0).required(),
		}),
		Joi.object({
			id: Joi.string().min(1).required(),
			storedAt: Joi.string().uri().required(),
			type: Joi.string()
				.valid(...Object.values(StillsObjectType))
				.required(),
			startTime: Joi.number().min(0).required(),
		})
	)
);
