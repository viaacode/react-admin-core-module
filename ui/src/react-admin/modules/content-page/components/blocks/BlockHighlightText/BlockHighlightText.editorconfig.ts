import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '~content-blocks/defaults';
import { GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF } from '~modules/content-page/const/get-color-options.ts';
import {
	Color,
	type ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	type DefaultContentBlockState,
} from '~modules/content-page/types/content-block.types';
import { RICH_TEXT_EDITOR_OPTIONS_FULL } from '~shared/consts/rich-text-editor.consts.ts';
import { tText } from '~shared/helpers/translation-functions';
import { validateRequiredValue } from '~shared/helpers/validation.ts';
import { HET_ARCHIEF } from '~shared/types';

const INITIAL_CONTENT_HIGHLIGHT_TEXT_COMPONENTS_STATE = () => ({
	content: '',
	backgroundColor: Color.Transparent,
	highlightColor: Color.SeaGreen,
});

export const INITIAL_CONTENT_HIGHLIGHT_TEXT_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS(),
	fullWidth: true,
});

export const CONTENT_HIGHLIGHT_TEXT_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'modules/content-page/components/blocks/block-highlight-text/block-highlight-text___highlight-text'
	),
	type: ContentBlockType.HighlightText,
	components: {
		state: INITIAL_CONTENT_HIGHLIGHT_TEXT_COMPONENTS_STATE(),
		fields: {
			content: TEXT_FIELD({
				editorType: ContentBlockEditor.RICH_TEXT_EDITOR,
				editorProps: {
					controls: RICH_TEXT_EDITOR_OPTIONS_FULL,
				},
				validator: (value: string) =>
					validateRequiredValue(
						value,
						tText(
							'modules/content-page/components/blocks/block-highlight-text/block-highlight-text___tekst-is-verplicht',
							undefined,
							[HET_ARCHIEF]
						)
					),
			}),
			highlightColor: {
				label: tText(
					'modules/content-page/components/blocks/block-highlight-text/block-highlight-text___highlightkleur',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.ColorSelect,
				editorProps: {
					options: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF(),
					defaultValue: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[3],
				},
			},
		},
	},
	block: {
		state: INITIAL_CONTENT_HIGHLIGHT_TEXT_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
