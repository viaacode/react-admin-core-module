import { blackOption, whiteOption } from '~modules/content-page/const/get-color-options';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
	HetArchiefQuoteBlockComponentState,
} from '../../../types/content-block.types';
import { Color, ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types';

import {
	BACKGROUND_COLOR_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
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
					label: tText('admin/content-block/helpers/generators/hetarchief-quote___quote', {}, [
						HET_ARCHIEF,
					]),
					editorType: ContentBlockEditor.TextArea,
				},
				tText('admin/content-block/helpers/generators/hetarchief-quote___quote-is-verplicht', {}, [
					HET_ARCHIEF,
				])
			),
			authorName: TEXT_FIELD({
				label: tText('admin/content-block/helpers/generators/hetarchief-quote___auteur', {}, [
					HET_ARCHIEF,
				]),
				validator: undefined,
			}),
			// The FA gives the text colour the same palette as the frame colour, so both use
			// the background colour field.
			textColor: BACKGROUND_COLOR_FIELD(
				tText('admin/content-block/helpers/generators/hetarchief-quote___tekstkleur', {}, [
					HET_ARCHIEF,
				]),
				whiteOption()
			),
			frameColor: BACKGROUND_COLOR_FIELD(
				tText('admin/content-block/helpers/generators/hetarchief-quote___kleur-kader', {}, [
					HET_ARCHIEF,
				]),
				blackOption()
			),
		},
	},
	block: {
		state: INITIAL_HET_ARCHIEF_QUOTE_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
