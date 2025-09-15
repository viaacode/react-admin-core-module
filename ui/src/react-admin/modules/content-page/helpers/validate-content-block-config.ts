import { has, isFunction } from 'lodash-es';
import { validateContentBlockField } from '~modules/shared/helpers/validation';
import type {
	ContentBlockComponentState,
	ContentBlockConfig,
	ContentBlockErrors,
	ContentBlockField,
} from '../types/content-block.types';

export function validateContentBlockConfig(
	errors: ContentBlockErrors,
	config: ContentBlockConfig,
	fields: Record<string, ContentBlockField>,
	state: ContentBlockComponentState
) {
	let newErrors = { ...errors };

	const keysToValidate = Object.keys(fields).filter((key) => fields[key].validator);

	keysToValidate.forEach((key) => {
		const validator = fields[key].validator;
		const isVisible = fields[key].isVisible;

		if (validator && isFunction(validator)) {
			if (Array.isArray(state) && state.length > 0) {
				state.forEach((singleState: ContentBlockComponentState, stateIndex: number) => {
					if (!(isVisible && !isVisible(config, singleState))) {
						newErrors = validateContentBlockField(
							key,
							validator,
							newErrors,
							singleState[key as keyof ContentBlockComponentState],
							stateIndex
						);
					}
				});
			} else if (has(state, key)) {
				if (!(isVisible && !isVisible(config, state))) {
					newErrors = validateContentBlockField(
						key,
						validator,
						newErrors,
						state[key as keyof ContentBlockComponentState]
					);
				}
			}
		}
	});

	return newErrors;
}
