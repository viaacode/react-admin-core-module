import { tText } from '~shared/helpers/translation-functions';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
} from '../../../types/content-block.types';
import { ContentBlockType } from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS } from '../defaults';

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
	name: tText('admin/content-block/helpers/generators/content-page-meta___pagina-meta-data'),
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
