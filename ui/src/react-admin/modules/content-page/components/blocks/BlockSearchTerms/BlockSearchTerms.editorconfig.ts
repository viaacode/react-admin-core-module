import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	SearchTermsBlockComponentState,
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

import { AdminConfigManager } from '~core/config';

export const INITIAL_SEARCH_TERMS_COMPONENTS_STATE = (): SearchTermsBlockComponentState[] => [
	{
		label: '',
		link: '',
	},
];

export const INITIAL_SEARCH_TERMS_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS();

export const SEARCH_TERMS_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/search-terms___search-terms'
	),
	type: ContentBlockType.SearchTerms,
	components: {
		state: INITIAL_SEARCH_TERMS_COMPONENTS_STATE(),
		name: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/helpers/generators/search-terms___search-term'
		),
		fields: {
			label: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/search-term___label-is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/search-term___label'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			link: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/search-term___label-is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/search-term___link'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
		},
	},
	block: {
		state: INITIAL_SEARCH_TERMS_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
