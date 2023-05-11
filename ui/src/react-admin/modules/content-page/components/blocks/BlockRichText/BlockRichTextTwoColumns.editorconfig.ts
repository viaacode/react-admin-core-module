import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import { RICH_TEXT_EDITOR_OPTIONS_FULL } from '~shared/consts/rich-text-editor.consts';

import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockFieldGroup,
	ContentBlockType,
	DEFAULT_BUTTON_PROPS,
	DefaultContentBlockState,
	RichTextBlockComponentState,
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

import { AdminConfigManager } from '~core/config';
import { isAvo } from '~modules/shared/helpers/is-avo';
import { ContentPickerType } from '~modules/shared/components/ContentPicker/ContentPicker.types';

export const INITIAL_RICH_TEXT_TWO_COLUMNS_COMPONENTS_STATE = (): RichTextBlockComponentState[] => [
	{
		content: '',
		contentRichEditorState: undefined,
		buttons: [],
	},
	{
		content: '',
		contentRichEditorState: undefined,
		buttons: [],
	},
];

export const INITIAL_RICH_TEXT_TWO_COLUMNS_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-small',
			bottom: 'bottom-small',
		},
	});

export const RICH_TEXT_TWO_COLUMNS_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/rich-text-two-columns___tekst-2-kolommen'
	),
	type: ContentBlockType.RichTextTwoColumns,
	components: {
		name: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/helpers/generators/rich-text-two-columns___kolom'
		),
		limits: {
			min: 2,
			max: 2,
		},
		state: INITIAL_RICH_TEXT_TWO_COLUMNS_COMPONENTS_STATE(),
		fields: {
			content: {
				...TEXT_FIELD(
					AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/rich-text-two-columns___tekst-is-verplicht'
					),
					{
						editorProps: {
							controls: [...RICH_TEXT_EDITOR_OPTIONS_FULL, 'media'],
							fileType: 'CONTENT_BLOCK_IMAGE',
						},
					}
				),
			},
			buttons: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/rich-text-two-columns___knop'
				),
				fields: {
					type: {
						label: AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-block/helpers/generators/buttons___type'
						),
						editorType: ContentBlockEditor.Select,
						editorProps: {
							options: AdminConfigManager.getConfig().components.buttonTypes(),
						},
					},
					label: TEXT_FIELD(
						AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-block/helpers/generators/buttons___knoptekst-is-verplicht'
						),
						{
							label: AdminConfigManager.getConfig().services.i18n.tText(
								'admin/content-block/helpers/generators/buttons___tekst'
							),
							editorType: ContentBlockEditor.TextInput,
						}
					),
					altTitle: TEXT_FIELD(undefined, {
						label: AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-block/helpers/generators/rich-text-two-columns___alt-title-text'
						),
						editorType: ContentBlockEditor.TextInput,
						validator: undefined,
					}),
					icon: {
						label: AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-block/helpers/generators/buttons___icoon'
						),
						editorType: ContentBlockEditor.IconPicker,
						editorProps: {
							options: GET_ADMIN_ICON_OPTIONS(),
						},
					},
					buttonAction: {
						label: AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-block/helpers/generators/buttons___knop-actie'
						),
						editorType: ContentBlockEditor.ContentPicker,
						...(!isAvo() && {
							editorProps: {
								allowedTypes: [
									ContentPickerType.CONTENT_PAGE,
									ContentPickerType.INTERNAL_LINK,
									ContentPickerType.EXTERNAL_LINK,
									ContentPickerType.ANCHOR_LINK,
								],
							},
						}),
					},
				},
				type: 'fieldGroup',
				min: 0,
				max: 10,
				repeat: {
					defaultState: DEFAULT_BUTTON_PROPS,
					addButtonLabel: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/rich-text-two-columns___voeg-knop-toe'
					),
					deleteButtonLabel: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/rich-text-two-columns___verwijder-knop'
					),
				},
			} as ContentBlockFieldGroup,
		},
	},
	block: {
		state: INITIAL_RICH_TEXT_TWO_COLUMNS_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
