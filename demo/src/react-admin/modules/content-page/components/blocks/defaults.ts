import { SelectOption } from '@viaa/avo2-components';
import { isEmpty, isNil } from 'lodash-es';

import { FileUploadProps } from '../../../shared/components/FileUpload/FileUpload';
import { UserGroupSelectProps } from '../../../shared/components/UserGroupSelect/UserGroupSelect';
import { RichTextEditorWrapperProps } from '../../../shared/components/RichTextEditorWrapper/RichTextEditorWrapper';
import { RICH_TEXT_EDITOR_OPTIONS_FULL_WITHOUT_ALIGN } from '../../../shared/consts/rich-text-editor.consts';
import {
	GET_ALIGN_OPTIONS,
	GET_BACKGROUND_COLOR_OPTIONS,
	GET_FOREGROUND_COLOR_OPTIONS,
} from '../../const/content-block.common.consts';
import {
	Color,
	ContentBlockEditor,
	ContentBlockField,
	DefaultContentBlockState,
	PaddingFieldState,
} from '../../types/content-block.types';

import { Config } from '~core/config';

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
		Config.getConfig().services.i18n.t(
			'admin/content-block/helpers/generators/defaults___achtergrondkleur'
		),
		GET_BACKGROUND_COLOR_OPTIONS()[1]
	),
	padding: PADDING_FIELD(
		Config.getConfig().services.i18n.t(
			'admin/content-block/helpers/generators/defaults___padding'
		)
	),
	margin: PADDING_FIELD(
		Config.getConfig().services.i18n.t(
			'admin/content-block/helpers/generators/defaults___marge'
		)
	),
	userGroupIds: USER_GROUP_SELECT(
		Config.getConfig().services.i18n.t(
			'admin/content-block/helpers/generators/defaults___zichtbaar-voor'
		),
		Config.getConfig().services.i18n.t(
			'admin/content-block/helpers/generators/defaults___iedereen-met-toegang-tot-de-pagina'
		)
	),

	// Used to link to this block from inside the same page using the anchors-block
	anchor: INPUT_FIELD({
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/helpers/generators/defaults___anchor-id'
		),
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
		options: GET_FOREGROUND_COLOR_OPTIONS(),
		defaultValue: defaultValue || GET_FOREGROUND_COLOR_OPTIONS()[0],
	},
});

export const BACKGROUND_COLOR_FIELD = (
	label: string,
	defaultValue: SelectOption<Color>
): ContentBlockField => ({
	label,
	editorType: ContentBlockEditor.ColorSelect,
	editorProps: {
		options: GET_BACKGROUND_COLOR_OPTIONS(),
		defaultValue: defaultValue || GET_BACKGROUND_COLOR_OPTIONS()[0],
	},
});

export const PADDING_FIELD = (label: string): ContentBlockField => ({
	label,
	editorType: ContentBlockEditor.PaddingSelect,
});

export const USER_GROUP_SELECT = (label: string, placeholder: string): ContentBlockField => ({
	label,
	editorType: ContentBlockEditor.UserGroupSelect,
	editorProps: {
		placeholder,
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
	label: Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/defaults___tekst'
	),
	editorType: ContentBlockEditor.RICH_TEXT_EDITOR,
	validator: (value: string) => {
		const errorArray: string[] = [];

		if (isNil(value) || isEmpty(value)) {
			errorArray.push(
				emptyFieldValidatorMessage ||
					Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/defaults___tekst-is-verplicht'
					)
			);
		}

		return errorArray;
	},
	editorProps: {
		controls: [...RICH_TEXT_EDITOR_OPTIONS_FULL_WITHOUT_ALIGN, 'media'],
		fileType: 'CONTENT_BLOCK_IMAGE',
	} as Partial<RichTextEditorWrapperProps>,
	...propOverride,
});

export const INPUT_FIELD = (propOverride?: Partial<ContentBlockField>): ContentBlockField => ({
	label: Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/defaults___tekst'
	),
	editorType: ContentBlockEditor.TextInput,
	...propOverride,
});

export const FILE_FIELD = (
	emptyFieldValidatorMessage = Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/defaults___een-bestand-is-verplicht'
	) || 'een-bestand-is-verplicht',
	propOverride?: Partial<ContentBlockField>
): ContentBlockField => ({
	label: Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/defaults___bestand'
	),
	editorType: ContentBlockEditor.FileUpload,
	validator: (value: string) => {
		const errorArray: string[] = [];

		if (isNil(value) || isEmpty(value)) {
			errorArray.push(emptyFieldValidatorMessage);
		}

		return errorArray;
	},
	editorProps: { assetType: 'CONTENT_BLOCK_IMAGE' } as FileUploadProps,
	...propOverride,
});

export const ITEM_PICKER_FIELD = (
	emptyFieldValidatorMessage = Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/defaults___selecteren-van-video-item-is-verplicht'
	),
	propOverride?: Partial<ContentBlockField>
): ContentBlockField => ({
	label: Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/media-player___video-of-audio-item'
	),
	editorType: ContentBlockEditor.ContentPicker,
	validator: (value: string) => {
		const errorArray: string[] = [];

		if (isNil(value) || isEmpty(value)) {
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
	label: Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/defaults___type-en-labels'
	),
	editorType: ContentBlockEditor.ContentTypeAndLabelsPicker,
	validator: undefined,
	...propOverride,
});
