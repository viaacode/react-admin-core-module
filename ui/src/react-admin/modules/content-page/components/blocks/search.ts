import { tText } from '~shared/helpers/translation-functions.js';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
} from '../../types/content-block.types.js';
import { Color, ContentBlockType } from '../../types/content-block.types.js';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS } from './defaults.js';

export const INITIAL_SEARCH_COMPONENTS_STATE = () => ({});

export const INITIAL_SEARCH_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-extra-large',
			bottom: 'bottom-extra-large',
		},
	}),
	backgroundColor: Color.Gray50,
});

export const SEARCH_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/search___search'),
	type: ContentBlockType.Search,
	components: {
		state: INITIAL_SEARCH_COMPONENTS_STATE(),
		fields: {},
	},
	block: {
		state: INITIAL_SEARCH_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
