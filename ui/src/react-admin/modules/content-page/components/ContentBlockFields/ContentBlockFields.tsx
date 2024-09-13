import type { FunctionComponent} from 'react';
import React, { memo } from 'react';

import { createKey } from '../../../shared/helpers/create-key';
import type {
	ContentBlockComponentState,
	ContentBlockField,
	ContentBlockFieldGroup,
	ContentBlockMeta,
	ContentBlockState,
	ContentBlockStateType,
} from '../../types/content-block.types';
import { FieldGenerator } from '../FieldGenerator/FieldGenerator';

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
	const { index } = block;
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
		/>
	);
};

export default memo(ContentBlockFields);
