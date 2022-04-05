import { Config } from '../../../../core/config';
import {
	ContentBlockConfig,
	ContentBlockType,
	DefaultContentBlockState,
} from '../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS } from './defaults';

export const INITIAL_CONTENT_PAGE_META_COMPONENTS_STATE = () => ({});

export const INITIAL_CONTENT_PAGE_META_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top',
			bottom: 'bottom',
		},
	});

export const CONTENT_PAGE_META_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/content-page-meta___pagina-meta-data'
	),
	type: ContentBlockType.ContentPageMeta,
	components: {
		state: INITIAL_CONTENT_PAGE_META_COMPONENTS_STATE(),
		fields: {},
	},
	block: {
		state: INITIAL_CONTENT_PAGE_META_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
