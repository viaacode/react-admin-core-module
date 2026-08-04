import { tText } from '~shared/helpers/translation-functions';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
	HetarchiefQuoteBlockComponentState,
} from '../../../types/content-block.types';
import { Color, ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types';

import {
	BACKGROUND_COLOR_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	TEXT_FIELD,
} from '../defaults';

export const INITIAL_HETARCHIEF_QUOTE_COMPONENTS_STATE =
	(): HetarchiefQuoteBlockComponentState => ({
		quote: '',
		authorName: '',
		textColor: Color.White,
		frameColor: Color.Black,
	});

export const INITIAL_HETARCHIEF_QUOTE_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-small',
			bottom: 'bottom-small',
		},
	});

export const HETARCHIEF_QUOTE_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/hetarchief-quote___quote-kader'),
	type: ContentBlockType.HetarchiefQuote,
	components: {
		state: INITIAL_HETARCHIEF_QUOTE_COMPONENTS_STATE(),
		fields: {
			quote: TEXT_FIELD(
				{
					label: tText('admin/content-block/helpers/generators/quote___quote'),
					editorType: ContentBlockEditor.TextArea,
				},
				tText('admin/content-block/helpers/generators/quote___quote-is-verplicht')
			),
			authorName: TEXT_FIELD({
				label: tText('admin/content-block/helpers/generators/quote___auteur'),
				validator: undefined,
			}),
			textColor: BACKGROUND_COLOR_FIELD(
				tText('admin/content-block/helpers/generators/hetarchief-quote___tekstkleur'),
				{
					label: tText('admin/content-block/content-block___wit'),
					value: Color.White,
				}
			),
			frameColor: BACKGROUND_COLOR_FIELD(
				tText('admin/content-block/helpers/generators/hetarchief-quote___kleur-kader'),
				{
					label: tText('modules/content-page/const/content-block___zwart'),
					value: Color.Black,
				}
			),
		},
	},
	block: {
		state: INITIAL_HETARCHIEF_QUOTE_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
