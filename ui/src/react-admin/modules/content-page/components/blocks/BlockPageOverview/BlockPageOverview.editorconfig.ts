import type { CheckboxProps, MultiRangeProps } from '@viaa/avo2-components';
import { AvoContentPageType } from '@viaa/avo2-types';
import type { BlockPageOverviewProps } from '~modules/content-page/components/blocks/BlockPageOverview/BlockPageOverview';
import { ContentItemStyle } from '~modules/content-page/components/blocks/BlockPageOverview/BlockPageOverview.types';
import { GET_ALIGN_OPTIONS } from '~modules/content-page/const/get-align-options';
import { GET_PAGE_OVERVIEW_ITEM_STYLE_OPTIONS } from '~modules/content-page/const/get-page-overview-item-style-options';
import { GET_PAGE_OVERVIEW_ORDER_OPTIONS } from '~modules/content-page/const/get-page-overview-order-options';
import { GET_PAGE_OVERVIEW_TAB_STYLE_OPTIONS } from '~modules/content-page/const/get-page-overview-tab-style-options';
import { tText } from '~shared/helpers/translation-functions';
import {
	Color,
	type ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	type DefaultContentBlockState,
	type PageOverviewBlockComponentStateFields,
} from '../../../types/content-block.types';
import {
	BACKGROUND_COLOR_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	CONTENT_TYPE_AND_LABELS_INPUT,
} from '../defaults';

export const INITIAL_PAGE_OVERVIEW_COMPONENTS_STATE =
	(): PageOverviewBlockComponentStateFields => ({
		tabs: [],
		tabStyle: 'MENU_BAR',
		allowMultiple: false,
		centerHeader: false,
		headerBackgroundColor: Color.Transparent,
		contentType: AvoContentPageType.FAQ_ITEM,
		itemStyle: ContentItemStyle.NEWS_LIST,
		itemAlignment: 'center',
		imageItemAlignment: 'center',
		showSectionTitle: true,
		showTitle: true,
		showDescription: true,
		showDate: false,
		buttonLabel: tText('admin/content-block/helpers/generators/page-overview___lees-meer'),
		itemsPerPage: 20,
	});

export const INITIAL_PAGE_OVERVIEW_BLOCK_STATE = (): DefaultContentBlockState => {
	return {
		...BLOCK_STATE_DEFAULTS({
			padding: {
				top: 'top-small',
				bottom: 'bottom-extra-large',
			},
		}),
	};
};

export const PAGE_OVERVIEW_BLOCK_CONFIG = (position = 0): ContentBlockConfig => {
	return {
		position,
		name: tText('admin/content-block/helpers/generators/page-overview___pagina-overzicht'),
		type: ContentBlockType.PageOverview,
		components: {
			state: INITIAL_PAGE_OVERVIEW_COMPONENTS_STATE(),
			fields: {
				contentTypeAndTabs: CONTENT_TYPE_AND_LABELS_INPUT({
					label: tText(
						'admin/content-block/helpers/generators/page-overview___type-van-de-paginas-die-je-wil-weergeven-optioneel-kan-je-deze-ook-indelen-per-categorie'
					),
				}),
				tabStyle: {
					label: tText('admin/content-block/helpers/generators/page-overview___menu-type'),
					editorType: ContentBlockEditor.Select,
					editorProps: {
						options: GET_PAGE_OVERVIEW_TAB_STYLE_OPTIONS(),
					},
				},
				allowMultiple: {
					editorType: ContentBlockEditor.Checkbox,
					editorProps: {
						label: tText(
							'admin/content-block/helpers/generators/page-overview___mag-meerdere-menu-items-selecteren'
						),
					} as CheckboxProps,
				},
				centerHeader: {
					editorType: ContentBlockEditor.Checkbox,
					editorProps: {
						label: tText(
							'admin/content-block/helpers/generators/page-overview___menu-items-centereren'
						),
					} as CheckboxProps,
				},
				itemStyle: {
					label: tText('admin/content-block/helpers/generators/page-overview___item-type'),
					editorType: ContentBlockEditor.Select,
					editorProps: {
						options: GET_PAGE_OVERVIEW_ITEM_STYLE_OPTIONS(),
					},
				},
				itemAlignment: {
					label: tText(
						'modules/content-page/components/blocks/block-page-overview/block-page-overview___item-alignment'
					),
					editorType: ContentBlockEditor.Select,
					editorProps: {
						options: GET_ALIGN_OPTIONS(),
					},
					isVisible: (config: ContentBlockConfig) => {
						return (
							(config.components.state as BlockPageOverviewProps).itemStyle ===
							ContentItemStyle.GRID
						);
					},
				},
				imageItemAlignment: {
					label: tText(
						'modules/content-page/components/blocks/block-page-overview/block-page-overview___afbeelding-uitlijning'
					),
					editorType: ContentBlockEditor.Select,
					editorProps: {
						options: GET_ALIGN_OPTIONS(),
					},
					isVisible: (config: ContentBlockConfig) => {
						return (
							(config.components.state as BlockPageOverviewProps).itemStyle ===
							ContentItemStyle.GRID
						);
					},
				},
				showSectionTitle: {
					editorType: ContentBlockEditor.Checkbox,
					editorProps: {
						label: tText(
							'modules/content-page/components/blocks/block-page-overview/block-page-overview___toon-de-label-tussen-titels'
						),
					} as CheckboxProps,
					isVisible: (config: ContentBlockConfig) => {
						return (
							(config.components.state as BlockPageOverviewProps).itemStyle ===
							ContentItemStyle.GRID
						);
					},
				},
				showTitle: {
					editorType: ContentBlockEditor.Checkbox,
					editorProps: {
						label: tText(
							'modules/content-page/components/blocks/block-page-overview/block-page-overview___toon-de-pagina-titels'
						),
					} as CheckboxProps,
				},
				showDescription: {
					editorType: ContentBlockEditor.Checkbox,
					editorProps: {
						label: tText(
							'modules/content-page/components/blocks/block-page-overview/block-page-overview___toon-de-pagina-beschrijvingen'
						),
					} as CheckboxProps,
				},
				showDate: {
					editorType: ContentBlockEditor.Checkbox,
					editorProps: {
						label: tText(
							'modules/content-page/components/blocks/block-page-overview/block-page-overview___toon-de-pagina-datum-en-categorie'
						),
					} as CheckboxProps,
					isVisible: (config: ContentBlockConfig) => {
						const itemStyle = (config.components.state as BlockPageOverviewProps)?.itemStyle;
						return (
							itemStyle === ContentItemStyle.NEWS_LIST ||
							itemStyle === ContentItemStyle.PROJECT_LIST
						);
					},
				},
				buttonLabel: {
					label: tText(
						'admin/content-block/helpers/generators/page-overview___label-voor-de-button-lijst-item'
					),
					editorType: ContentBlockEditor.TextInput,
				},
				buttonAltTitle: {
					label: tText('admin/content-block/helpers/generators/page-overview___alt-title-text'),
					editorType: ContentBlockEditor.TextInput,
				},
				itemsPerPage: {
					label: tText('admin/content-block/helpers/generators/page-overview___items-per-pagina'),
					editorType: ContentBlockEditor.MultiRange,
					editorProps: {
						min: 0,
						max: 200,
						step: 1,
						showNumber: true,
					} as MultiRangeProps,
				},
			},
		},
		block: {
			state: INITIAL_PAGE_OVERVIEW_BLOCK_STATE(),
			fields: {
				sortOrder: {
					label: tText('admin/content-block/helpers/generators/page-overview___sorteer-volgorde'),
					editorType: ContentBlockEditor.Select,
					editorProps: {
						options: GET_PAGE_OVERVIEW_ORDER_OPTIONS(),
					},
				},
				headerBackgroundColor: BACKGROUND_COLOR_FIELD(
					tText('admin/content-block/helpers/generators/defaults___titelbalk-achtergrondkleur'),
					{
						label: tText('admin/content-block/helpers/generators/defaults___transparant'),
						value: Color.Transparent,
					}
				),
				...BLOCK_FIELD_DEFAULTS(),
			},
		},
	};
};
