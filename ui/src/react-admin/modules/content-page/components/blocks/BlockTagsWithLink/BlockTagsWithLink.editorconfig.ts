import { ContentPickerType } from '~modules/shared/components/ContentPicker/ContentPicker.types';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	TagsWithLinkBlockComponentState,
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

import { AdminConfigManager } from '~core/config';

export const INITIAL_TAGS_WITH_LINK_COMPONENTS_STATE = (): TagsWithLinkBlockComponentState[] => [
	{
		label: '',
	},
];

export const INITIAL_TAGS_WITH_LINK_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS();

export const TAGS_WITH_LINK_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/tags-with-link___title'
	),
	type: ContentBlockType.TagsWithLink,
	components: {
		state: INITIAL_TAGS_WITH_LINK_COMPONENTS_STATE(),
		name: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/helpers/generators/tag-with-link___title'
		),
		fields: {
			label: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/tag-with-link___label-is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/tag-with-link___label'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			link: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/tag-with-link___link'
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: [
						ContentPickerType.ANCHOR_LINK,
						ContentPickerType.INTERNAL_LINK,
						ContentPickerType.EXTERNAL_LINK,
					],
				},
			},
		},
	},
	block: {
		state: INITIAL_TAGS_WITH_LINK_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
