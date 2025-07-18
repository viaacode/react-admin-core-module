import { FormGroup, Spacer } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React, { memo } from 'react';

import { createKey } from '~shared/helpers/create-key';
import type {
	ContentBlockBlockConfig,
	ContentBlockComponentsConfig,
	ContentBlockComponentState,
	ContentBlockConfig,
	ContentBlockField,
	ContentBlockState,
	ContentBlockStateType,
} from '../../types/content-block.types';
import ContentBlockFields from '../ContentBlockFields/ContentBlockFields';

interface ContentBlockFormGroupProps {
	config: ContentBlockConfig;
	blockIndex: number;
	formGroup: ContentBlockComponentsConfig | ContentBlockBlockConfig;
	formGroupState: ContentBlockComponentState | ContentBlockState;
	formGroupType: ContentBlockStateType;
	stateIndex?: number;
	handleChange: (
		formGroupType: ContentBlockStateType,
		key: keyof ContentBlockComponentState | keyof ContentBlockState,
		// biome-ignore lint/suspicious/noExplicitAny: todo
		value: any,
		stateIndex?: number
	) => void;
}

const ContentBlockFormGroup: FunctionComponent<ContentBlockFormGroupProps> = ({
	config,
	blockIndex,
	formGroup,
	formGroupState,
	formGroupType,
	stateIndex,
	handleChange,
}) => (
	<div className="c-content-block-form-group">
		{Object.keys(formGroup.fields).map((key: string, formGroupIndex: number) => {
			let error: string[];
			const configErrors = config.errors || {};
			const stateKey = key as keyof ContentBlockComponentState | keyof ContentBlockState;
			const formErrorsForBlock = configErrors[stateKey];

			if (typeof stateIndex === 'number') {
				error = (formErrorsForBlock?.[stateIndex] || []) as string[];
			} else {
				error = formErrorsForBlock as string[];
			}

			const field = formGroup.fields[key] as ContentBlockField; // TODO fix type to ContentBlockField | ContentBlockFieldGroup
			if (field.isVisible && !field.isVisible?.(config)) {
				return null;
			}

			return (
				<Spacer
					key={createKey('form-group', blockIndex, formGroupIndex, stateIndex)}
					margin="bottom"
				>
					<FormGroup label={field.repeat ? undefined : field.label} error={error}>
						<ContentBlockFields
							block={{ config, index: blockIndex }}
							fieldKey={stateKey}
							fieldOrFieldGroup={field}
							state={formGroupState}
							type={formGroupType}
							formGroupIndex={formGroupIndex}
							stateIndex={stateIndex}
							handleChange={handleChange}
						/>
					</FormGroup>
				</Spacer>
			);
		})}
	</div>
);

export default memo(ContentBlockFormGroup);
