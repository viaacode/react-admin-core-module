import { tText } from '~shared/helpers/translation-functions';
import type {
	ContentBlockConfig,
	ContentBlockFieldGroup,
	DefaultContentBlockState,
	HetArchiefHeaderSearchBlockComponentState,
} from '../../../types/content-block.types';
import {
	ContentBlockEditor,
	ContentBlockType,
	DEFAULT_BUTTON_PROPS,
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

export const INITIAL_HET_ARCHIEF_HEADER_SEARCH_COMPONENTS_STATE =
	(): HetArchiefHeaderSearchBlockComponentState => ({
		title: '',
		subtitles: [],
		textBelowSearch: '',
	});

export const INITIAL_HET_ARCHIEF_HEADER_SEARCH_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS();

export const HET_ARCHIEF_HEADER_SEARCH_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___header-met-zoek-veld'
	),
	type: ContentBlockType.HetArchiefHeaderSearch,
	components: {
		state: INITIAL_HET_ARCHIEF_HEADER_SEARCH_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(
				tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___is-verplicht'
				),
				{
					label: tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___titel'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			subtitles: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___animatie-teksten'
				),
				fields: {
					label: {
						label: tText(
							'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___animatie-tekst'
						),
						editorType: ContentBlockEditor.TextInput,
					},
				},
				type: 'fieldGroup',
				repeat: {
					defaultState: DEFAULT_BUTTON_PROPS,
					addButtonLabel: tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___voeg-animatie-tekst-toe'
					),
					deleteButtonLabel: tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___verwijder-animatie-tekst'
					),
				},
			} as ContentBlockFieldGroup,
			textBelowSearch: TEXT_FIELD(undefined, {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___tekst-onder-zoekveld'
				),
				editorType: ContentBlockEditor.TextInput,
			}),
		},
	},
	block: {
		state: INITIAL_HET_ARCHIEF_HEADER_SEARCH_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
