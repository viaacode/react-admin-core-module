import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import type {
	ContentBlockConfig,
	ContentBlockFieldGroup,
	DefaultContentBlockState,
	HetArchiefHeaderSearchBlockComponentState,
} from '../../../types/content-block.types';
import { ContentBlockType, DEFAULT_BUTTON_PROPS } from '../../../types/content-block.types';
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
		'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___header-met-zoek-veld',
		{},
		[HET_ARCHIEF]
	),
	type: ContentBlockType.HetArchiefHeaderSearch,
	components: {
		state: INITIAL_HET_ARCHIEF_HEADER_SEARCH_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(
				{
					label: tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___titel',
						{},
						[HET_ARCHIEF]
					),
				},
				tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___is-verplicht',
					{},
					[HET_ARCHIEF]
				)
			),
			subtitles: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___animatie-teksten',
					{},
					[HET_ARCHIEF]
				),
				fields: {
					label: TEXT_FIELD({
						label: tText(
							'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___animatie-tekst',
							{},
							[HET_ARCHIEF]
						),
						validator: undefined,
					}),
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
			textBelowSearch: TEXT_FIELD({
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___tekst-onder-zoekveld',
					{},
					[HET_ARCHIEF]
				),
			}),
			searchAriaLabel: TEXT_FIELD(
				{
					label: tText(
						'modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___aria-label-voor-zoekveld',
						{},
						[HET_ARCHIEF]
					),
				},
				tText(
					'modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___aria-label-verplicht',
					{},
					[HET_ARCHIEF]
				)
			),
		},
	},
	block: {
		state: INITIAL_HET_ARCHIEF_HEADER_SEARCH_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
