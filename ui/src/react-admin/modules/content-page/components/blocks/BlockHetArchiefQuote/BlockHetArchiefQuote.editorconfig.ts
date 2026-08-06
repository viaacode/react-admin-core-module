import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
	HetArchiefQuoteBlockComponentState,
} from '../../../types/content-block.types';
import { Color, ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types';

import {
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	SOLID_COLOR_FIELD,
	TEXT_FIELD,
} from '../defaults';

export const INITIAL_HET_ARCHIEF_QUOTE_COMPONENTS_STATE =
	(): HetArchiefQuoteBlockComponentState => ({
		quote: '',
		authorName: '',
		textColor: Color.White,
		frameColor: Color.Black,
	});

export const INITIAL_HET_ARCHIEF_QUOTE_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-small',
			bottom: 'bottom-small',
		},
	});

export const HET_ARCHIEF_QUOTE_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/hetarchief-quote___quote-kader', {}, [
		HET_ARCHIEF,
	]),
	type: ContentBlockType.HetArchiefQuote,
	components: {
		state: INITIAL_HET_ARCHIEF_QUOTE_COMPONENTS_STATE(),
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
			textColor: SOLID_COLOR_FIELD(
				tText('admin/content-block/helpers/generators/hetarchief-quote___tekstkleur', {}, [
					HET_ARCHIEF,
				]),
				{
					label: tText('admin/content-block/content-block___wit'),
					value: Color.White,
				}
			),
			frameColor: SOLID_COLOR_FIELD(
				tText('admin/content-block/helpers/generators/hetarchief-quote___kleur-kader', {}, [
					HET_ARCHIEF,
				]),
				{
					label: tText('modules/content-page/const/content-block___zwart'),
					value: Color.Black,
				}
			),
		},
	},
	block: {
		state: INITIAL_HET_ARCHIEF_QUOTE_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
