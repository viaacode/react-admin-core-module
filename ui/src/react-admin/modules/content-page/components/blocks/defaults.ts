import type { CheckboxProps, SelectOption } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { GET_ALIGN_OPTIONS } from '~modules/content-page/const/get-align-options';
import {
	GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF,
	GET_BACKGROUND_COLOR_OPTIONS_AVO,
	GET_COLOR_OPTIONS_EXTENDED_AVO,
	GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF,
	GET_FOREGROUND_COLOR_OPTIONS_AVO,
} from '~modules/content-page/const/get-color-options';

import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload';
import type { RichTextEditorWrapperProps } from '~shared/components/RichTextEditorWrapper/RichTextEditorWrapper';
import type { UserGroupSelectProps } from '~shared/components/UserGroupSelect/UserGroupSelect';
import { RICH_TEXT_EDITOR_OPTIONS_FULL_WITHOUT_ALIGN } from '~shared/consts/rich-text-editor.consts';
import { isAvo } from '~shared/helpers/is-avo';
import { IeObjectType } from '~shared/helpers/map-format-to-type.ts';
import { tText } from '~shared/helpers/translation-functions';
import { validateRequiredValue } from '~shared/helpers/validation.ts';
import { HET_ARCHIEF } from '~shared/types';
import { SpecialUserGroups } from '~shared/types/authentication.types';
import type { PickerItem } from '~shared/types/content-picker.ts';
import {
	Color,
	type ContentBlockComponentsConfig,
	ContentBlockEditor,
	type ContentBlockField,
	type CopyrightComponentState,
	type CustomBackground,
	type DefaultContentBlockState,
	type GradientColor,
	type IsVisibleFunc,
	type PaddingFieldState,
} from '../../types/content-block.types';

// Block config defaults
export const BLOCK_STATE_DEFAULTS = (
	state: Partial<DefaultContentBlockState> = {}
): DefaultContentBlockState => {
	return {
		backgroundColor: state?.backgroundColor || Color.Transparent,
		headerBackgroundColor: state?.headerBackgroundColor || Color.Transparent,
		padding:
			state?.padding ||
			({
				top: 'top-small',
				bottom: 'bottom-small',
			} as PaddingFieldState),
		margin:
			state?.margin ||
			({
				top: 'none',
				bottom: 'none',
			} as PaddingFieldState),
		userGroupIds: state?.userGroupIds || [],
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
	anchor: TEXT_FIELD({
		label: tText('admin/content-block/helpers/generators/defaults___anchor-id'),
		validator: undefined,
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
		checkedOptions: [SpecialUserGroups.loggedInUsers],
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
	propOverride?: Partial<ContentBlockField>,
	emptyFieldValidatorMessage?: string
): ContentBlockField => ({
	label: tText('admin/content-block/helpers/generators/defaults___tekst'),
	editorType: ContentBlockEditor.TextInput, // Default text input type. also supported: textarea and rich text editor
	validator: emptyFieldValidatorMessage
		? (value: string) => validateRequiredValue(value, emptyFieldValidatorMessage)
		: undefined,
	editorProps: {
		controls: [...RICH_TEXT_EDITOR_OPTIONS_FULL_WITHOUT_ALIGN, 'media'],
		fileType: 'CONTENT_BLOCK_IMAGE',
	} as Partial<RichTextEditorWrapperProps>,
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
	validator: (value: string) => validateRequiredValue(value, emptyFieldValidatorMessage),
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
	validator: (value: string) => validateRequiredValue(value, emptyFieldValidatorMessage),
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

export const COPYRIGHT_FIELDS = (overrides?: {
	title?: {
		fieldName?: string;
		overrides?: Partial<ContentBlockField>;
	};
	showIcon?: {
		fieldName?: string;
		overrides?: Partial<ContentBlockField>;
	};
	text?: {
		fieldName?: string;
		overrides?: Partial<ContentBlockField>;
	};
}): ContentBlockComponentsConfig['fields'] => ({
	[overrides?.title?.fieldName || 'copyrightTitle']: TEXT_FIELD({
		label: tText('modules/content-page/components/blocks/defaults___bijschrift-titel'),
		validator: undefined,
		...overrides?.title?.overrides,
	}),
	[overrides?.showIcon?.fieldName || 'copyrightIconVisible']: {
		editorType: ContentBlockEditor.Checkbox,
		editorProps: {
			label: tText('modules/content-page/components/blocks/defaults___toon-bijschrift-icoon'),
		} as CheckboxProps,
		...overrides?.showIcon?.overrides,
	},
	[overrides?.text?.fieldName || 'copyrightText']: TEXT_FIELD({
		label: tText('modules/content-page/components/blocks/defaults___bijschrift-beschrijving'),
		validator: undefined,
		...overrides?.text?.overrides,
	}),
});

export const COPYRIGHT_STATE = (): CopyrightComponentState => ({
	copyrightTitle: '',
	copyrightIconVisible: true,
	copyrightText: '',
});

/**
 * The object picker every block uses to point at one ie-object: it searches by title and stores the
 * pid, so nobody has to type one by hand.
 *
 * The state key is `mediaItem` wherever this is used, because `generateFieldAttributes` reads
 * `state.item || state.mediaItem` to tell a video-still picker which object to fetch stills for.
 * A block without a still picker keeps the name anyway, so the proxy can read every block the same
 * way. https://meemoo.atlassian.net/browse/ARC-3813
 */
export const IE_OBJECT_FIELD = ({
	allowedObjectTypes = Object.values(IeObjectType),
	label,
	isVisible,
	fieldsToResetOnChange,
	isRequired = true,
}: {
	/** Formats the picker offers. Every format by default, which is no restriction at all. */
	allowedObjectTypes?: IeObjectType[];
	/** Overrides the generic "Object" label where a block names the field its own way. */
	label?: string;
	isVisible?: IsVisibleFunc;
	fieldsToResetOnChange?: string[];
	/** False where a block may hold the field empty, e.g. an optional repeated entry. */
	isRequired?: boolean;
} = {}): ContentBlockField => ({
	label:
		label ||
		tText('modules/content-page/helpers/snippet-time-fields___object', undefined, [HET_ARCHIEF]),
	editorType: ContentBlockEditor.ContentPicker,
	editorProps: {
		allowedTypes: [AvoCoreContentPickerType.IE_OBJECT],
		hideTypeDropdown: true,
		hideTargetSwitch: true,
		ieObjectFormats: allowedObjectTypes,
	},
	fieldsToResetOnChange,
	validator: isRequired
		? (value: PickerItem | undefined) =>
				value?.value
					? []
					: [
							tText(
								'modules/content-page/helpers/snippet-time-fields___een-object-is-verplicht',
								undefined,
								[HET_ARCHIEF]
							),
						]
		: undefined,
	isVisible,
});
