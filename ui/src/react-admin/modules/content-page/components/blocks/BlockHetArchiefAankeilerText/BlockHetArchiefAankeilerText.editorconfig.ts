import type { RichTextEditorControl } from '@meemoo/react-components';
import type { CheckboxProps } from '@viaa/avo2-components';

import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
} from '../../../types/content-block.types';
import { Color, ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types';
import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';
import type { AankeilerTextBlockComponentState } from './BlockHetArchiefAankeilerText.types';

/**
 * The aankeiler text only allows links and text alignment, no other text styling.
 * The remaining controls are editing utilities, not formatting.
 */
const AANKEILER_TEXT_EDITOR_OPTIONS: RichTextEditorControl[] = [
	'fullscreen',
	'separator',
	'undo',
	'redo',
	'separator',
	'text-align',
	'separator',
	'link',
	'separator',
	'remove-styles',
];

export const INITIAL_AANKEILER_TEXT_COMPONENTS_STATE = (): AankeilerTextBlockComponentState => ({
	content: '',
});

export const INITIAL_AANKEILER_TEXT_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		backgroundColor: Color.Platinum,
		padding: {
			top: 'top-large',
			bottom: 'bottom-large',
		},
	});

export const AANKEILER_TEXT_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('modules/content-page/components/blocks/block-aankeiler-text___aankeiler-tekst', {}, [
		HET_ARCHIEF,
	]),
	type: ContentBlockType.AankeilerText,
	components: {
		state: INITIAL_AANKEILER_TEXT_COMPONENTS_STATE(),
		fields: {
			content: TEXT_FIELD(
				{
					editorType: ContentBlockEditor.RICH_TEXT_EDITOR,
					editorProps: {
						controls: AANKEILER_TEXT_EDITOR_OPTIONS,
					},
				},
				tText(
					'modules/content-page/components/blocks/block-aankeiler-text___tekst-is-verplicht',
					{},
					[HET_ARCHIEF]
				)
			),
		},
	},
	block: {
		state: INITIAL_AANKEILER_TEXT_BLOCK_STATE(),
		fields: {
			limitWidth: {
				editorType: ContentBlockEditor.Checkbox,
				editorProps: {
					label: tText(
						'modules/content-page/components/blocks/block-aankeiler-text___limiteer-breedte-tot-800-px',
						{},
						[HET_ARCHIEF]
					),
				} as CheckboxProps,
			},
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
