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
import { HET_ARCHIEF } from '~shared/types';

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
		'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___header-met-zoek-veld',
		{},
		[HET_ARCHIEF]
	),
	type: ContentBlockType.HetArchiefHeaderSearch,
	components: {
		state: INITIAL_HET_ARCHIEF_HEADER_SEARCH_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(
				tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___is-verplicht',
					{},
					[HET_ARCHIEF]
				),
				{
					label: tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___titel',
						{},
						[HET_ARCHIEF]
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			subtitles: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___animatie-teksten',
					{},
					[HET_ARCHIEF]
				),
				fields: {
					label: {
						label: tText(
							'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___animatie-tekst',
							{},
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.TextInput,
					},
				},
				type: 'fieldGroup',
				repeat: {
					defaultState: DEFAULT_BUTTON_PROPS,
					addButtonLabel: tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___voeg-animatie-tekst-toe',
						{},
						[HET_ARCHIEF]
					),
					deleteButtonLabel: tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___verwijder-animatie-tekst',
						{},
						[HET_ARCHIEF]
					),
				},
			} as ContentBlockFieldGroup,
			textBelowSearch: TEXT_FIELD(undefined, {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___tekst-onder-zoekveld',
					{},
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.TextInput,
			}),
			searchAriaLabel: TEXT_FIELD(
				tText(
					'modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___aria-label-verplicht',
					{},
					[HET_ARCHIEF]
				),
				{
					label: tText(
						'modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___aria-label-voor-zoekveld',
						{},
						[HET_ARCHIEF]
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
		},
	},
	block: {
		state: INITIAL_HET_ARCHIEF_HEADER_SEARCH_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
