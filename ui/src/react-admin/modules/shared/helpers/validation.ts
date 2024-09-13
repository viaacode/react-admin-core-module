import { isNumber } from 'lodash-es';

import { tText } from '~shared/helpers/translation-functions';

import type { ContentBlockErrors } from '../../content-page/types/content-block.types';

// Handle content-block config components/block state validation
export const validateContentBlockField = (
	fieldKey: string,
	validator: ((value: any) => string[]) | undefined,
	oldErrors: ContentBlockErrors = {},
	value: any,
	stateIndex?: number
): ContentBlockErrors => {
	if (!validator) {
		return oldErrors;
	}

	const errorArray = validator(value);

	if (errorArray.length) {
		if (isNumber(stateIndex)) {
			const errorsByKey = [...(oldErrors[fieldKey] || [])];
			errorsByKey[stateIndex] = errorArray;

			return {
				...oldErrors,
				[fieldKey]: errorsByKey,
			};
		}

		return {
			...oldErrors,
			[fieldKey]: errorArray,
		};
	}

	// If no errors are given, cleanup empty properties
	if (errorArray.length === 0) {
		// No more errors, clear property from error object
		const updatedErrors = {
			...oldErrors,
		};
		delete updatedErrors[fieldKey];
		return updatedErrors;
	} else {
		// Still errors, set errors under fieldKey on error object
		return {
			...oldErrors,
			[fieldKey]: errorArray,
		};
	}
};

export function validateFlowplayerVideoUrl(url: string | null | undefined) {
	if (!url) {
		return [];
	}
	if (!url.startsWith('https://')) {
		return [tText('admin/shared/helpers/validation___video-url-moet-beginnen-met-http')];
	}
	if (!url.endsWith('.m3u8') && !url.endsWith('.mp4')) {
		return [
			tText('admin/shared/helpers/validation___video-url-moet-eindigen-met-m-3-u-8-of-mp-4'),
		];
	}
	return [];
}
