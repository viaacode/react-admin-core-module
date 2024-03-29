import {
	Color,
	ContentBlockConfig,
	ContentBlockType,
	DefaultContentBlockState,
} from '../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS } from './defaults';

import { AdminConfigManager } from '~core/config';

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
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/search___search'
	),
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
