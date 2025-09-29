import { BLOCK_STATE_DEFAULTS } from '~content-blocks/defaults';
import {
	type ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	type DefaultContentBlockState,
} from '~modules/content-page/types/content-block.types';
import { tText } from '~shared/helpers/translation-functions';

export const INITIAL_SCROLL_DOWN_NUDGE_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'none',
			bottom: 'none',
		},
	}),
});

export const CONTENT_SCROLL_DOWN_NUDGE_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('Scroll down nudge'),
	type: ContentBlockType.ScrollDownNudge,
	components: {
		state: {},
		fields: {},
	},
	block: {
		state: INITIAL_SCROLL_DOWN_NUDGE_BLOCK_STATE(),
		fields: {
			userGroupIds: {
				label: tText('admin/content-block/helpers/generators/defaults___zichtbaar-voor'),
				editorType: ContentBlockEditor.UserGroupSelect,
			},
		},
	},
});
