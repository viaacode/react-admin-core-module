import { FormGroup, Spacer } from "@viaa/avo2-components";
import type { FunctionComponent } from "react";
import React from "react";
import { GET_EDITOR_TYPES_MAP } from "~modules/content-page/const/editor-types.consts";

import { generateFieldAttributes } from "~modules/content-page/helpers/field-attributes";
import type {
	ContentBlockComponentState,
	ContentBlockEditor,
	ContentBlockFieldGroup,
	ContentBlockState,
	ContentBlockStateType,
} from "../../types/content-block.types";

interface FieldGroupProps {
	// biome-ignore lint/suspicious/noExplicitAny: todo
	globalState: any;
	globalStateIndex: number;
	fieldKey: keyof ContentBlockComponentState | keyof ContentBlockState;
	fieldGroup: ContentBlockFieldGroup;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	fieldGroupState: any;
	fieldGroupStateIndex: number;
	type: ContentBlockStateType; // State type
	// biome-ignore lint/suspicious/noExplicitAny: todo
	handleChange: any;
}

export const FieldGroup: FunctionComponent<FieldGroupProps> = ({
	globalState,
	globalStateIndex,
	fieldKey,
	fieldGroup,
	fieldGroupState,
	fieldGroupStateIndex,
	type,
	handleChange,
}) => {
	const { fields } = fieldGroup;

	const handleFieldGroupStateChange = (
		// biome-ignore lint/suspicious/noExplicitAny: todo
		stateCopy: any,
		key: string,
		// biome-ignore lint/suspicious/noExplicitAny: todo
		index: any,
		// biome-ignore lint/suspicious/noExplicitAny: todo
		value: any,
	) => {
		const newState = [...stateCopy];

		newState[index] = {
			...newState[index],
			[key]: value,
		};

		handleChange(type, fieldKey, newState, globalStateIndex);
	};

	return (
		<>
			{/* biome-ignore lint/suspicious/noExplicitAny: todo */}
			{Object.entries(fields).map((fieldState: any, fieldIndex: number) => {
				// biome-ignore lint/suspicious/noExplicitAny: todo
				const editorProps: any = {
					...fieldState[1].editorProps,
					...generateFieldAttributes(
						fieldState[1],
						// biome-ignore lint/suspicious/noExplicitAny: todo
						(value: any, key?: string) =>
							handleFieldGroupStateChange(
								globalState,
								key || fieldState[0],
								fieldGroupStateIndex,
								value,
							),
						// biome-ignore lint/suspicious/noExplicitAny: todo
						fieldGroupState[fieldState[0]] as any,
						`${fieldKey}-${fieldState[0]}-${fieldIndex}`,
						fieldState[0],
						fieldGroupState,
					),
				};

				const EditorComponents =
					GET_EDITOR_TYPES_MAP()[
						fieldState[1].editorType as ContentBlockEditor
					];

				return (
					<Spacer
						margin="top"
						key={`${fieldKey}-${fieldState[0]}-${fieldIndex}`}
					>
						<FormGroup label={`${fieldState[1].label}`}>
							<Spacer margin="top-small">
								<EditorComponents {...editorProps} />
							</Spacer>
						</FormGroup>
					</Spacer>
				);
			})}
		</>
	);
};
