import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import { createKey } from '~shared/helpers/create-key.js';
import type {
	ContentBlockComponentState,
	ContentBlockField,
	ContentBlockFieldGroup,
	ContentBlockMeta,
	ContentBlockState,
	ContentBlockStateType,
} from '../../types/content-block.types.js';
import { FieldGenerator } from '../FieldGenerator/FieldGenerator.js';

interface ContentBlockFieldProps {
	block: ContentBlockMeta; // Block metadata
	fieldKey: keyof ContentBlockComponentState | keyof ContentBlockState;
	fieldOrFieldGroup: ContentBlockField | ContentBlockFieldGroup; // Field options
	type: ContentBlockStateType; // State type
	state: ContentBlockComponentState | ContentBlockState; // State object (within state array).
	formGroupIndex?: number; // Index of form group.
	stateIndex?: number; // Index of state object (within state array).
	handleChange: (
		formGroupType: ContentBlockStateType,
		fieldKey: keyof ContentBlockComponentState | keyof ContentBlockState,
		// biome-ignore lint/suspicious/noExplicitAny: todo
		value: any,
		stateIndex?: number
	) => void;
}

const ContentBlockFields: FunctionComponent<ContentBlockFieldProps> = ({
	block,
	fieldKey,
	fieldOrFieldGroup,
	stateIndex,
	state,
	formGroupIndex,
	type,
	handleChange,
}) => {
	// Generate field id
	const { index, config } = block;
	const fieldId = createKey('editor', index, formGroupIndex, stateIndex);

	// Generate fields
	return (
		<FieldGenerator
			fieldKey={fieldKey}
			fieldId={fieldId}
			fieldOrFieldGroup={fieldOrFieldGroup}
			stateIndex={stateIndex}
			state={state}
			type={type}
			handleChange={handleChange}
			config={config}
		/>
	);
};

export default memo(ContentBlockFields);
