import { Button, Flex, FlexItem, FormGroup, Spacer } from '@viaa/avo2-components';
import { get } from 'lodash-es';
import React, { Fragment, FunctionComponent } from 'react';

import { GET_EDITOR_TYPES_MAP } from '../../const/content-block.consts';
import { generateFieldAttributes } from '../../helpers/field-attributes';
import {
	ContentBlockComponentState,
	ContentBlockField,
	ContentBlockFieldGroup,
	ContentBlockState,
	ContentBlockStateType,
} from '../../types/content-block.types';
import { FieldGroup } from '../FieldGroup/FieldGroup';

interface FieldGeneratorProps {
	fieldKey: keyof ContentBlockComponentState | keyof ContentBlockState;
	fieldId: string;
	fieldOrFieldGroup: ContentBlockField | ContentBlockFieldGroup;
	stateIndex?: number; // Index of state object (within state array).
	state: any;
	type: ContentBlockStateType; // State type
	handleChange: any;
}

export const FieldGenerator: FunctionComponent<FieldGeneratorProps> = ({
	fieldKey,
	fieldId,
	fieldOrFieldGroup,
	stateIndex,
	state,
	type,
	handleChange,
}) => {
	const handleFieldGroup = (fieldGroup: ContentBlockFieldGroup, currentState: any) => {
		if (!fieldGroup) {
			return null;
		}

		// REPEATED FIELDGROUP
		const renderFieldGroups = (singleState: any, singleStateIndex = 0) => (
			<Spacer key={`${fieldGroup.label}-${singleStateIndex}`} margin="top-large">
				<Flex>
					<FlexItem>{`${fieldGroup.label} ${singleStateIndex + 1}`}</FlexItem>
					<FlexItem shrink>
						{currentState.length >
							(fieldGroup.min !== undefined ? fieldGroup.min : 1) &&
							renderDeleteButton(
								currentState,
								get(fieldGroup, 'repeat.deleteButtonLabel'),
								singleStateIndex
							)}
					</FlexItem>
				</Flex>
				<FieldGroup
					globalState={currentState}
					globalStateIndex={stateIndex || 0}
					fieldKey={fieldKey}
					fieldGroup={fieldGroup}
					fieldGroupState={singleState}
					fieldGroupStateIndex={singleStateIndex}
					type={type}
					handleChange={handleChange}
				/>
			</Spacer>
		);

		if (fieldGroup.repeat) {
			return (
				<>
					{currentState.map((fieldGroupState: any, fieldGroupStateIndex: number) =>
						renderFieldGroups(fieldGroupState, fieldGroupStateIndex)
					)}
					{(!fieldGroup.max || currentState.length < fieldGroup.max) && (
						<Spacer margin="top">
							<Flex center>
								{renderAddButton(
									currentState,
									get(fieldGroup, 'repeat.defaultState'),
									get(fieldGroup, 'repeat.addButtonLabel')
								)}
							</Flex>
						</Spacer>
					)}
				</>
			);
		}

		// FIELDGROUP
		return <Fragment key={stateIndex}>{renderFieldGroups(currentState, stateIndex)}</Fragment>;
	};

	const handleField = (field: ContentBlockField, currentState: any) => {
		const EditorComponent = GET_EDITOR_TYPES_MAP()[(field as ContentBlockField).editorType];

		const handleStateChange = (index: any, value: any, key?: string) => {
			const newState = [...currentState];

			newState[index] = value;

			handleChange(type, key || fieldKey, newState, stateIndex);
		};

		// REPEATED FIELD
		if (field.repeat) {
			return (
				<>
					{currentState.map((innerState: any, index: number) => {
						const editorProps: any = generateFieldAttributes(
							field as ContentBlockField,
							(value: any, key?: string) => {
								handleStateChange(index, value, key);
							},
							innerState as any,
							`${fieldKey}-${index}`,
							fieldKey,
							currentState
						);

						return (
							<Spacer margin="top" key={`${fieldKey}-${index}`}>
								<Flex justify="between" center orientation="vertical">
									<FlexItem>
										<FormGroup label={`${field.label} ${index + 1}`}>
											<Spacer margin="top-small">
												<EditorComponent {...editorProps} />
											</Spacer>
										</FormGroup>
									</FlexItem>
									{currentState.length > 1 && (
										<Spacer margin="left">
											{renderDeleteButton(
												currentState,
												get(field, 'repeat.deleteButtonLabel'),
												index
											)}
										</Spacer>
									)}
								</Flex>
							</Spacer>
						);
					})}
					<Spacer margin="top">
						<Flex center>
							{renderAddButton(
								currentState,
								get(field, 'repeat.defaultState'),
								get(field, 'repeat.addButtonLabel')
							)}
						</Flex>
					</Spacer>
				</>
			);
		}

		// FIELD
		const defaultProps = {
			...field.editorProps,
			editorId: fieldId,
			name: fieldId,
		};

		const editorProps: any = generateFieldAttributes(
			field,
			(value: any, key?: string) => handleChange(type, key || fieldKey, value, stateIndex),
			(state as any)[fieldKey],
			fieldId,
			fieldKey,
			state
		);

		return <EditorComponent {...defaultProps} {...editorProps} />;
	};

	const renderAddButton = (stateCopy: any[], defaultState: any, label?: string) => {
		const handleFieldAdd = () => {
			const newState = [...stateCopy];

			newState.push(defaultState);

			handleChange(type, fieldKey, newState, stateIndex);
		};

		return (
			<Button
				icon="add"
				onClick={handleFieldAdd}
				size="small"
				title={label}
				ariaLabel={label}
				label={label}
				type="secondary"
			/>
		);
	};

	const renderDeleteButton = (stateCopy: any, label?: string, index?: number) => {
		const handleFieldDelete = (index: any) => {
			const newState = [...stateCopy];

			newState.splice(index, 1);

			handleChange(type, fieldKey, newState, stateIndex);
		};

		return (
			<Button
				icon="delete"
				onClick={() => handleFieldDelete(index)}
				size="small"
				title={label}
				ariaLabel={label}
				type="danger"
			/>
		);
	};

	const generateFields = (
		fieldOrFieldGroupInstance: ContentBlockField | ContentBlockFieldGroup,
		currentState: any = []
	) => {
		switch ((fieldOrFieldGroupInstance as ContentBlockFieldGroup).type) {
			case 'fieldGroup':
				return handleFieldGroup(
					fieldOrFieldGroupInstance as ContentBlockFieldGroup,
					currentState
				);

			case 'field':
			default:
				return handleField(fieldOrFieldGroupInstance as ContentBlockField, currentState);
		}
	};

	return <>{generateFields(fieldOrFieldGroup, state[fieldKey])}</>;
};