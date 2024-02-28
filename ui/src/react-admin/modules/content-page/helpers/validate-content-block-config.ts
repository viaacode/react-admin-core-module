import { has, isFunction } from 'lodash';
import {
	ContentBlockComponentState,
	ContentBlockErrors,
	ContentBlockField,
} from '../types/content-block.types';
import { validateContentBlockField } from '~modules/shared/helpers/validation';

export function validateContentBlockConfig(
	errors: ContentBlockErrors,
	fields: {
		[key: string]: { validator?: ContentBlockField['validator'] };
	},
	state: ContentBlockComponentState
) {
	let newErrors = { ...errors } || {};

	const keysToValidate = Object.keys(fields).filter((key) => fields[key].validator);

	if (keysToValidate.length > 0) {
		keysToValidate.forEach((key) => {
			const validator = fields[key].validator;

			if (validator && isFunction(validator)) {
				if (Array.isArray(state) && state.length > 0) {
					state.forEach((singleState: ContentBlockComponentState, stateIndex: number) => {
						newErrors = validateContentBlockField(
							key,
							validator,
							newErrors,
							singleState[key as keyof ContentBlockComponentState],
							stateIndex
						);
					});
				} else if (has(state, key)) {
					newErrors = validateContentBlockField(
						key,
						validator,
						newErrors,
						state[key as keyof ContentBlockComponentState]
					);
				}
			}
		});
    }

	return newErrors;
}
