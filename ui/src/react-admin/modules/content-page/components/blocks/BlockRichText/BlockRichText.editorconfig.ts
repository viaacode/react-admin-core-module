import { CheckboxProps } from '@viaa/avo2-components';

import { RICH_TEXT_EDITOR_OPTIONS_FULL } from '~shared/consts/rich-text-editor.consts';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	RichTextBlockComponentState,
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

import { AdminConfigManager } from '~core/config';

export const INITIAL_RICH_TEXT_COMPONENTS_STATE = (): RichTextBlockComponentState => ({
	content: '',
	contentRichEditorState: undefined,
});

export const INITIAL_RICH_TEXT_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-small',
			bottom: 'bottom-small',
		},
	});

export const RICH_TEXT_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/rich-text___tekst'
	),
	type: ContentBlockType.RichText,
	components: {
		limits: {
			max: 1,
		},
		state: INITIAL_RICH_TEXT_COMPONENTS_STATE(),
		fields: {
			content: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/rich-text___tekst-is-verplicht'
				),
				{
					editorProps: {
						controls: [...RICH_TEXT_EDITOR_OPTIONS_FULL, 'media'],
						fileType: 'CONTENT_BLOCK_IMAGE',
					},
				}
			),
		},
	},
	block: {
		state: INITIAL_RICH_TEXT_BLOCK_STATE(),
		fields: {
			limitWidth: {
				editorType: ContentBlockEditor.Checkbox,
				editorProps: {
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/rich-text___limiteer-breedte-tot-800-px'
					),
				} as CheckboxProps,
			},
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
