import type { SelectOption } from '@viaa/avo2-components';
import { GET_ALIGN_OPTIONS } from '~modules/content-page/const/get-align-options';
import {
	GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF,
	GET_BACKGROUND_COLOR_OPTIONS_AVO,
	GET_COLOR_OPTIONS_EXTENDED_AVO,
	GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF,
	GET_FOREGROUND_COLOR_OPTIONS_AVO,
} from '~modules/content-page/const/get-color-options';

import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload';
import type { RichTextEditorWithInternalStateWrapperProps } from '~shared/components/RichTextEditorWithInternalStateWrapper/RichTextEditorWithInternalStateWrapper';
import type { UserGroupSelectProps } from '~shared/components/UserGroupSelect/UserGroupSelect';
import { RICH_TEXT_EDITOR_OPTIONS_FULL_WITHOUT_ALIGN } from '~shared/consts/rich-text-editor.consts';
import { isAvo } from '~shared/helpers/is-avo';
import { tText } from '~shared/helpers/translation-functions';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';
import type {
	ContentBlockField,
	CustomBackground,
	DefaultContentBlockState,
	GradientColor,
	PaddingFieldState,
} from '../../types/content-block.types';
import { Color, ContentBlockEditor } from '../../types/content-block.types';

// Block config defaults
export const BLOCK_STATE_DEFAULTS = (
	state: Partial<DefaultContentBlockState> = {}
): DefaultContentBlockState => {
	return {
		backgroundColor: state.backgroundColor || Color.Transparent,
		headerBackgroundColor: state.headerBackgroundColor || Color.Transparent,
		padding:
			state.padding ||
			({
				top: 'small',
				bottom: 'small',
			} as PaddingFieldState),
		margin:
			state.margin ||
			({
				top: 'none',
				bottom: 'none',
			} as PaddingFieldState),
		userGroupIds: state.userGroupIds || [],
	};
};

export const BLOCK_FIELD_DEFAULTS = () => ({
	backgroundColor: BACKGROUND_COLOR_FIELD(
		tText('admin/content-block/helpers/generators/defaults___achtergrondkleur'),
		isAvo() ? GET_BACKGROUND_COLOR_OPTIONS_AVO()[1] : GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[1]
	),
	padding: PADDING_TOP_BOTTOM_FIELD(
		tText('admin/content-block/helpers/generators/defaults___padding')
	),
	margin: PADDING_TOP_BOTTOM_FIELD(
		tText('admin/content-block/helpers/generators/defaults___marge')
	),
	userGroupIds: USER_GROUP_SELECT(
		tText('admin/content-block/helpers/generators/defaults___zichtbaar-voor'),
		tText('admin/content-block/helpers/generators/defaults___iedereen-met-toegang-tot-de-pagina')
	),

	// Used to link to this block from inside the same page using the anchors-block
	anchor: INPUT_FIELD({
		label: tText('admin/content-block/helpers/generators/defaults___anchor-id'),
	}),
});

// Recurring fields
export const FOREGROUND_COLOR_FIELD = (
	label?: string,
	defaultValue?: SelectOption<Color>
): ContentBlockField => ({
	label,
	editorType: ContentBlockEditor.ColorSelect,
	editorProps: {
		options: isAvo() ? GET_FOREGROUND_COLOR_OPTIONS_AVO() : GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF(),
		defaultValue:
			defaultValue || isAvo()
				? GET_FOREGROUND_COLOR_OPTIONS_AVO()[0]
				: GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF()[0],
	},
});

export const BACKGROUND_COLOR_FIELD = (
	label: string,
	defaultValue: SelectOption<Color | GradientColor | CustomBackground>
): ContentBlockField => ({
	label,
	editorType: ContentBlockEditor.ColorSelect,
	editorProps: {
		options: isAvo() ? GET_BACKGROUND_COLOR_OPTIONS_AVO() : GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF(),
		defaultValue:
			defaultValue || isAvo()
				? GET_BACKGROUND_COLOR_OPTIONS_AVO()[0]
				: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[0],
	},
});

export const BACKGROUND_COLOR_EXTENDED_FIELD = (
	label: string,
	defaultValue?: SelectOption<Color | GradientColor | CustomBackground>
): ContentBlockField => ({
	label,
	editorType: ContentBlockEditor.ColorSelect,
	editorProps: {
		options: isAvo() ? GET_COLOR_OPTIONS_EXTENDED_AVO() : GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF(),
		defaultValue:
			defaultValue || isAvo()
				? GET_COLOR_OPTIONS_EXTENDED_AVO()[0]
				: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[0],
	},
});

export const PADDING_TOP_BOTTOM_FIELD = (label: string): ContentBlockField => ({
	label,
	editorType: ContentBlockEditor.PaddingSelect,
});

export const PADDING_SINGLE_VALUE_FIELD = (label: string): ContentBlockField => ({
	label,
	editorType: ContentBlockEditor.PaddingSelectSingleValue,
});

export const USER_GROUP_SELECT = (label: string, placeholder: string): ContentBlockField => ({
	label,
	editorType: ContentBlockEditor.UserGroupSelect,
	editorProps: {
		placeholder,
		checkedOptions: [SpecialPermissionGroups.loggedInUsers],
	} as UserGroupSelectProps,
});

export const ALIGN_FIELD = (label: string): ContentBlockField => ({
	label,
	editorType: ContentBlockEditor.AlignSelect,
	editorProps: {
		options: GET_ALIGN_OPTIONS(),
	},
});

export const TEXT_FIELD = (
	emptyFieldValidatorMessage?: string,
	propOverride?: Partial<ContentBlockField>
): ContentBlockField => ({
	label: tText('admin/content-block/helpers/generators/defaults___tekst'),
	editorType: ContentBlockEditor.RICH_TEXT_EDITOR,
	validator: (value: string) => {
		const errorArray: string[] = [];

		if (!value && emptyFieldValidatorMessage) {
			errorArray.push(
				emptyFieldValidatorMessage ||
					tText('admin/content-block/helpers/generators/defaults___tekst-is-verplicht')
			);
		}

		return errorArray;
	},
	editorProps: {
		controls: [...RICH_TEXT_EDITOR_OPTIONS_FULL_WITHOUT_ALIGN, 'media'],
		fileType: 'CONTENT_BLOCK_IMAGE',
	} as Partial<RichTextEditorWithInternalStateWrapperProps>,
	...propOverride,
});

export const INPUT_FIELD = (propOverride?: Partial<ContentBlockField>): ContentBlockField => ({
	label: tText('admin/content-block/helpers/generators/defaults___tekst'),
	editorType: ContentBlockEditor.TextInput,
	...propOverride,
});

export const FILE_FIELD = (
	emptyFieldValidatorMessage = tText(
		'admin/content-block/helpers/generators/defaults___een-bestand-is-verplicht'
	) || 'een-bestand-is-verplicht',
	propOverride?: Partial<ContentBlockField>
): ContentBlockField => ({
	label: tText('admin/content-block/helpers/generators/defaults___bestand'),
	editorType: ContentBlockEditor.FileUpload,
	validator: (value: string) => {
		const errorArray: string[] = [];

		if (!value) {
			errorArray.push(emptyFieldValidatorMessage);
		}

		return errorArray;
	},
	editorProps: { assetType: 'CONTENT_BLOCK_IMAGE' } as FileUploadProps,
	...propOverride,
});

export const ITEM_PICKER_FIELD = (
	emptyFieldValidatorMessage = tText(
		'admin/content-block/helpers/generators/defaults___selecteren-van-video-item-is-verplicht'
	),
	propOverride?: Partial<ContentBlockField>
): ContentBlockField => ({
	label: tText('admin/content-block/helpers/generators/media-player___video-of-audio-item'),
	editorType: ContentBlockEditor.ContentPicker,
	validator: (value: string) => {
		const errorArray: string[] = [];

		if (!value) {
			errorArray.push(emptyFieldValidatorMessage);
		}

		return errorArray;
	},
	editorProps: {
		allowedTypes: ['ITEM'],
		hideTargetSwitch: true,
	},
	...propOverride,
});

export const CONTENT_TYPE_AND_LABELS_INPUT = (
	propOverride?: Partial<ContentBlockField>
): ContentBlockField => ({
	label: tText('admin/content-block/helpers/generators/defaults___type-en-labels'),
	editorType: ContentBlockEditor.ContentTypeAndLabelsPicker,
	validator: undefined,
	...propOverride,
});
