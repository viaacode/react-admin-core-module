import {
	GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF,
	GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF,
} from '~modules/content-page/const/get-color-options';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
	HetArchiefQuoteBlockComponentState,
} from '../../../types/content-block.types';
import { ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types';

import {
	BACKGROUND_COLOR_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FOREGROUND_COLOR_FIELD,
	TEXT_FIELD,
} from '../defaults';

// White in the foreground colour list, black in the background colour list
const DEFAULT_TEXT_COLOR_OPTION = () => GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF()[1];
const DEFAULT_FRAME_COLOR_OPTION = () => GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[5];

export const INITIAL_HET_ARCHIEF_QUOTE_COMPONENTS_STATE =
	(): HetArchiefQuoteBlockComponentState => ({
		quote: '',
		authorName: '',
		textColor: DEFAULT_TEXT_COLOR_OPTION().value,
		frameColor: DEFAULT_FRAME_COLOR_OPTION().value,
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
			textColor: FOREGROUND_COLOR_FIELD(
				tText('admin/content-block/helpers/generators/hetarchief-quote___tekstkleur', {}, [
					HET_ARCHIEF,
				]),
				DEFAULT_TEXT_COLOR_OPTION()
			),
			frameColor: BACKGROUND_COLOR_FIELD(
				tText('admin/content-block/helpers/generators/hetarchief-quote___kleur-kader', {}, [
					HET_ARCHIEF,
				]),
				DEFAULT_FRAME_COLOR_OPTION()
			),
		},
	},
	block: {
		state: INITIAL_HET_ARCHIEF_QUOTE_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
