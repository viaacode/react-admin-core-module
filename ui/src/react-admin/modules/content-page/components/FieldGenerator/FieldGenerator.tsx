import { Alert } from '@meemoo/react-components';
import { Button, Flex, FlexItem, FormGroup, IconName, Spacer } from '@viaa/avo2-components';
import type { FunctionComponent, ReactNode } from 'react';
import React, { Fragment } from 'react';
import { GET_EDITOR_TYPES_MAP } from '~modules/content-page/const/editor-types.consts.js';
import { generateFieldAttributes } from '~modules/content-page/helpers/field-attributes.js';
import { Icon } from '~shared/components/Icon/Icon.js';
import type {
	ContentBlockComponentState,
	ContentBlockConfig,
	ContentBlockField,
	ContentBlockFieldGroup,
	ContentBlockState,
	ContentBlockStateType,
} from '../../types/content-block.types.js';
import { FieldGroup } from '../FieldGroup/FieldGroup.js';

interface FieldGeneratorProps {
	fieldKey: keyof ContentBlockComponentState | keyof ContentBlockState;
	fieldId: string;
	fieldOrFieldGroup: ContentBlockField | ContentBlockFieldGroup;
	stateIndex?: number; // Index of state object (within state array).
	// biome-ignore lint/suspicious/noExplicitAny: todo
	state: any;
	type: ContentBlockStateType; // State type
	// biome-ignore lint/suspicious/noExplicitAny: todo
	handleChange: any;
	config: ContentBlockConfig;
}

export const FieldGenerator: FunctionComponent<FieldGeneratorProps> = ({
	fieldKey,
	fieldId,
	fieldOrFieldGroup,
	stateIndex,
	state,
	type,
	handleChange,
	config,
}) => {
	const handleFieldGroup = (
		fieldGroup: ContentBlockFieldGroup,
		// biome-ignore lint/suspicious/noExplicitAny: todo
		currentState: any
	) => {
		if (!fieldGroup) {
			return null;
		}

		// REPEATED FIELDGROUP
		// biome-ignore lint/suspicious/noExplicitAny: todo
		const renderFieldGroups = (singleState: any, singleStateIndex = 0) => (
			<Spacer key={`${fieldGroup.label}-${singleStateIndex}`} margin="top-large">
				<Flex>
					<FlexItem>{`${fieldGroup.label} ${singleStateIndex + 1}`}</FlexItem>
					<FlexItem shrink>
						{currentState.length > (fieldGroup.min !== undefined ? fieldGroup.min : 1) &&
							renderDeleteButton(
								currentState,
								fieldGroup?.repeat?.deleteButtonLabel,
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
					{currentState.map(
						// biome-ignore lint/suspicious/noExplicitAny: todo
						(fieldGroupState: any, fieldGroupStateIndex: number) =>
							renderFieldGroups(fieldGroupState, fieldGroupStateIndex)
					)}
					{(!fieldGroup.max || currentState.length < fieldGroup.max) && (
						<Spacer margin="top">
							<Flex center>
								{renderAddButton(
									currentState,
									fieldGroup?.repeat?.defaultState,
									fieldGroup?.repeat?.addButtonLabel
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

	const renderNote = (field: ContentBlockField): ReactNode | null => {
		if (!field.note) {
			return null;
		}

		if (field.isNoteVisible && !field.isNoteVisible?.(config)) {
			return null;
		}

		return (
			<Spacer margin="top">
				<Alert content={field.note} icon={<Icon name={IconName.alertTriangle} />} variants="info" />
			</Spacer>
		);
	};

	// biome-ignore lint/suspicious/noExplicitAny: todo
	const handleField = (field: ContentBlockField, currentState: any) => {
		const EditorComponent = GET_EDITOR_TYPES_MAP()[(field as ContentBlockField).editorType];

		// biome-ignore lint/suspicious/noExplicitAny: todo
		const handleStateChange = (index: any, value: any, key?: string) => {
			const newState = [...currentState];

			newState[index] = value;

			handleChange(type, key || fieldKey, newState, stateIndex);
		};

		// REPEATED FIELD
		if (field.repeat) {
			return (
				<>
					{/* biome-ignore lint/suspicious/noExplicitAny: todo */}
					{currentState.map((innerState: any, index: number) => {
						// biome-ignore lint/suspicious/noExplicitAny: todo
						const editorProps: any = generateFieldAttributes(
							field as ContentBlockField,
							// biome-ignore lint/suspicious/noExplicitAny: todo
							(value: any, key?: string) => {
								handleStateChange(index, value, key);
							},
							// biome-ignore lint/suspicious/noExplicitAny: todo
							innerState as any,
							`${fieldKey}-${index}`,
							fieldKey,
							currentState
						);

						return (
							// biome-ignore lint/suspicious/noArrayIndexKey: We don't have a better key at this time
							<Spacer margin="top" key={`${fieldKey}-${index}`}>
								<Flex justify="between" center orientation="vertical">
									<FlexItem>
										<FormGroup label={`${field.label} ${index + 1}`}>
											<Spacer margin="top-small">
												<EditorComponent {...editorProps} />
											</Spacer>
											{renderNote(field)}
										</FormGroup>
									</FlexItem>
									{currentState.length > 1 && (
										<Spacer margin="left">
											{renderDeleteButton(currentState, field?.repeat?.deleteButtonLabel, index)}
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
								field?.repeat?.defaultState,
								field?.repeat?.addButtonLabel
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

		// biome-ignore lint/suspicious/noExplicitAny: todo
		const editorProps: any = generateFieldAttributes(
			field,
			// biome-ignore lint/suspicious/noExplicitAny: todo
			(value: any, key?: string) => handleChange(type, key || fieldKey, value, stateIndex),
			// biome-ignore lint/suspicious/noExplicitAny: todo
			(state as any)[fieldKey],
			fieldId,
			fieldKey,
			state
		);

		return (
			<>
				<EditorComponent {...defaultProps} {...editorProps} />
				{renderNote(field)}
			</>
		);
	};

	const renderAddButton = (
		// biome-ignore lint/suspicious/noExplicitAny: todo
		stateCopy: any[],
		// biome-ignore lint/suspicious/noExplicitAny: todo
		defaultState: any,
		label?: string
	) => {
		const handleFieldAdd = () => {
			const newState = [...stateCopy];

			newState.push(defaultState);

			handleChange(type, fieldKey, newState, stateIndex);
		};

		return (
			<Button
				icon={'add' as IconName}
				onClick={handleFieldAdd}
				size="small"
				title={label}
				ariaLabel={label}
				label={label}
				type="secondary"
			/>
		);
	};

	const renderDeleteButton = (
		// biome-ignore lint/suspicious/noExplicitAny: todo
		stateCopy: any,
		label?: string,
		index?: number
	) => {
		// biome-ignore lint/suspicious/noExplicitAny: todo
		const handleFieldDelete = (index: any) => {
			const newState = [...stateCopy];

			newState.splice(index, 1);

			handleChange(type, fieldKey, newState, stateIndex);
		};

		return (
			<Button
				icon={'delete' as IconName}
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
		// biome-ignore lint/suspicious/noExplicitAny: todo
		currentState: any = []
	) => {
		switch ((fieldOrFieldGroupInstance as ContentBlockFieldGroup).type) {
			case 'fieldGroup':
				return handleFieldGroup(fieldOrFieldGroupInstance as ContentBlockFieldGroup, currentState);
			default:
				return handleField(fieldOrFieldGroupInstance as ContentBlockField, currentState);
		}
	};

	return <>{generateFields(fieldOrFieldGroup, state[fieldKey])}</>;
};
