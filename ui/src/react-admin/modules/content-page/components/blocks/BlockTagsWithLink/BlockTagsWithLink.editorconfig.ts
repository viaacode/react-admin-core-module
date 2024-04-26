import { tText } from '~shared/helpers/translation-functions';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	TagsWithLinkBlockComponentState,
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

export const INITIAL_TAGS_WITH_LINK_COMPONENTS_STATE = (): TagsWithLinkBlockComponentState[] => [
	{
		label: '',
	},
];

export const INITIAL_TAGS_WITH_LINK_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS();

export const TAGS_WITH_LINK_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/tags-with-link___tags'),
	type: ContentBlockType.TagsWithLink,
	components: {
		state: INITIAL_TAGS_WITH_LINK_COMPONENTS_STATE(),
		name: tText('admin/content-block/helpers/generators/tag-with-link___tag'),
		fields: {
			label: TEXT_FIELD(
				tText('admin/content-block/helpers/generators/tag-with-link___label-is-verplicht'),
				{
					label: tText('admin/content-block/helpers/generators/tag-with-link___label'),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			link: {
				label: tText('admin/content-block/helpers/generators/tag-with-link___link'),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: ['CONTENT_PAGE', 'INTERNAL_LINK', 'EXTERNAL_LINK', 'ANCHOR_LINK'],
				},
			},
		},
	},
	block: {
		state: INITIAL_TAGS_WITH_LINK_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
