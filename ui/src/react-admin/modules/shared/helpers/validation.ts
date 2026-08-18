import { tText } from '~shared/helpers/translation-functions';

import type {
	ContentBlockComponentState,
	ContentBlockErrors,
	ContentBlockField,
	ContentBlockState,
} from '../../content-page/types/content-block.types';

// Handle content-block config components/block state validation
export const validateContentBlockField = (
	fieldKey: string,
	validator: ContentBlockField['validator'],
	oldErrors: ContentBlockErrors = {},
	// biome-ignore lint/suspicious/noExplicitAny: todo
	value: any,
	stateIndex?: number,
	// The state object the field lives in, so validators can express cross-field rules
	siblingState?: ContentBlockComponentState | ContentBlockState
): ContentBlockErrors => {
	if (!validator) {
		return oldErrors;
	}

	const errorArray = validator(value, siblingState);

	if (errorArray.length) {
		if (typeof stateIndex === 'number') {
			const errorsByKey = [...((oldErrors[fieldKey] as (string | string[])[]) || [])];
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
	}
	// Still errors, set errors under fieldKey on error object
	return {
		...oldErrors,
		[fieldKey]: errorArray,
	};
};

export function validateFlowplayerVideoUrl(url: string | null | undefined) {
	if (!url) {
		return [];
	}
	if (!url.startsWith('https://')) {
		return [tText('admin/shared/helpers/validation___video-url-moet-beginnen-met-http')];
	}
	if (!url.endsWith('.m3u8') && !url.endsWith('.mp4')) {
		return [tText('admin/shared/helpers/validation___video-url-moet-eindigen-met-m-3-u-8-of-mp-4')];
	}
	return [];
}

export function validateRequiredValue(value: string, emptyFieldValidatorMessage: string) {
	const errorArray: string[] = [];

	if (!value && emptyFieldValidatorMessage) {
		errorArray.push(emptyFieldValidatorMessage);
	}

	return errorArray;
}
