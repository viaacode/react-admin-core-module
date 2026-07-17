import { isFunction } from 'es-toolkit';
import { validateContentBlockField } from '~modules/shared/helpers/validation';
import type {
	ContentBlockComponentState,
	ContentBlockConfig,
	ContentBlockErrors,
	ContentBlockField,
	ContentBlockFieldGroup,
	ContentBlockFieldGroupErrors,
} from '../types/content-block.types';

/**
 * Validate the inner fields of a repeated field group (mechanism B, e.g. `elements`).
 * The group itself has no validator; the validators live on its inner fields, and its
 * state is an array with one object per repeated element. Errors are namespaced under
 * the group key to avoid collisions with equally named top-level fields.
 */
export function validateFieldGroup(
	errors: ContentBlockErrors,
	config: ContentBlockConfig,
	groupKey: string,
	groupFields: Record<string, ContentBlockField>,
	// biome-ignore lint/suspicious/noExplicitAny: element state shape varies per block
	groupState: any[]
): ContentBlockErrors {
	const groupErrors: ContentBlockFieldGroupErrors = [];
	let hasError = false;

	groupState.forEach((elementState, elementIndex: number) => {
		const elementErrors: Record<string, string[]> = {};

		Object.keys(groupFields).forEach((innerKey) => {
			const innerField = groupFields[innerKey];
			const validator = innerField.validator;
			const isVisible = innerField.isVisible;

			if (validator && isFunction(validator)) {
				if (!isVisible || isVisible(config, elementState)) {
					const messages = validator(elementState?.[innerKey]);
					if (messages.length) {
						elementErrors[innerKey] = messages;
						hasError = true;
					}
				}
			}
		});

		groupErrors[elementIndex] = elementErrors;
	});

	if (hasError) {
		return {
			...errors,
			[groupKey]: groupErrors,
		};
	}

	// No more errors in this group, clear its property from the error object
	const updatedErrors = { ...errors };
	delete updatedErrors[groupKey];
	return updatedErrors;
}

export function validateContentBlockConfig(
	errors: ContentBlockErrors,
	config: ContentBlockConfig,
	fields: Record<string, ContentBlockField | ContentBlockFieldGroup>,
	state: ContentBlockComponentState
) {
	let newErrors = { ...errors };

	Object.keys(fields).forEach((key) => {
		const field = fields[key];

		// Mechanism B: repeated field group (e.g. `elements`). Validators live on the
		// inner fields, so validate each element against the group's inner fields.
		if ((field as ContentBlockFieldGroup).type === 'fieldGroup') {
			const groupFields = (field as ContentBlockFieldGroup).fields;
			// biome-ignore lint/suspicious/noExplicitAny: state is a single object here (mechanism B)
			const groupState = (state as any)?.[key];

			if (Array.isArray(groupState)) {
				newErrors = validateFieldGroup(newErrors, config, key, groupFields, groupState);
			}
			return;
		}

		const validator = (field as ContentBlockField).validator;
		const isVisible = (field as ContentBlockField).isVisible;

		if (validator && isFunction(validator)) {
			if (Array.isArray(state) && state.length > 0) {
				// Validate repeatable fields inside a block
				state.forEach((singleState: ContentBlockComponentState, stateIndex: number) => {
					if (!isVisible || isVisible(config, singleState)) {
						newErrors = validateContentBlockField(
							key,
							validator,
							newErrors,
							singleState[key as keyof ContentBlockComponentState],
							stateIndex
						);
					}
				});
			} else if (Object.hasOwn(state, key)) {
				// Validate the block fields itself
				if (!isVisible || isVisible(config, state)) {
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
