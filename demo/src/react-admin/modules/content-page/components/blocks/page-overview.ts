import { CheckboxProps, MultiRangeProps } from '@viaa/avo2-components';

import {
	GET_PAGE_OVERVIEW_ITEM_STYLE_OPTIONS,
	GET_PAGE_OVERVIEW_ORDER_OPTIONS,
	GET_PAGE_OVERVIEW_TAB_STYLE_OPTIONS,
} from '../../const/content-block.consts';
import {
	Color,
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	PageOverviewBlockComponentStateFields,
} from '../../types/content-block.types';

import {
	BACKGROUND_COLOR_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	CONTENT_TYPE_AND_LABELS_INPUT,
} from './defaults';

import { Config } from '~core/config';

export const INITIAL_PAGE_OVERVIEW_COMPONENTS_STATE =
	(): PageOverviewBlockComponentStateFields => ({
		tabs: [],
		tabStyle: 'MENU_BAR',
		allowMultiple: false,
		centerHeader: false,
		headerBackgroundColor: Color.Transparent,
		contentType: 'PROJECT',
		itemStyle: 'NEWS_LIST',
		showTitle: true,
		showDescription: true,
		showDate: false,
		buttonLabel: Config.getConfig().services.i18n.t(
			'admin/content-block/helpers/generators/page-overview___lees-meer'
		),
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
		name: Config.getConfig().services.i18n.t(
			'admin/content-block/helpers/generators/page-overview___pagina-overzicht'
		),
		type: ContentBlockType.PageOverview,
		components: {
			state: INITIAL_PAGE_OVERVIEW_COMPONENTS_STATE(),
			fields: {
				contentTypeAndTabs: CONTENT_TYPE_AND_LABELS_INPUT({
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/page-overview___type-van-de-paginas-die-je-wil-weergeven-optioneel-kan-je-deze-ook-indelen-per-categorie'
					),
				}),
				tabStyle: {
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/page-overview___menu-type'
					),
					editorType: ContentBlockEditor.Select,
					editorProps: {
						options: GET_PAGE_OVERVIEW_TAB_STYLE_OPTIONS(),
					},
				},
				allowMultiple: {
					editorType: ContentBlockEditor.Checkbox,
					editorProps: {
						label: Config.getConfig().services.i18n.t(
							'admin/content-block/helpers/generators/page-overview___mag-meerdere-menu-items-selecteren'
						),
					} as CheckboxProps,
				},
				centerHeader: {
					editorType: ContentBlockEditor.Checkbox,
					editorProps: {
						label: Config.getConfig().services.i18n.t(
							'admin/content-block/helpers/generators/page-overview___menu-items-centereren'
						),
					} as CheckboxProps,
				},
				itemStyle: {
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/page-overview___item-type'
					),
					editorType: ContentBlockEditor.Select,
					editorProps: {
						options: GET_PAGE_OVERVIEW_ITEM_STYLE_OPTIONS(),
					},
				},
				showTitle: {
					editorType: ContentBlockEditor.Checkbox,
					editorProps: {
						label: Config.getConfig().services.i18n.t(
							'admin/content-block/helpers/generators/page-overview___toon-de-titel'
						),
					} as CheckboxProps,
				},
				showDescription: {
					editorType: ContentBlockEditor.Checkbox,
					editorProps: {
						label: Config.getConfig().services.i18n.t(
							'admin/content-block/helpers/generators/page-overview___toon-de-beschrijving'
						),
					} as CheckboxProps,
				},
				showDate: {
					editorType: ContentBlockEditor.Checkbox,
					editorProps: {
						label: Config.getConfig().services.i18n.t(
							'admin/content-block/helpers/generators/page-overview___toon-de-datum-en-categorie'
						),
					} as CheckboxProps,
				},
				buttonLabel: {
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/page-overview___label-voor-de-button-lijst-item'
					),
					editorType: ContentBlockEditor.TextInput,
				},
				buttonAltTitle: {
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/page-overview___alt-title-text'
					),
					editorType: ContentBlockEditor.TextInput,
				},
				itemsPerPage: {
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/page-overview___items-per-pagina'
					),
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
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/page-overview___sorteer-volgorde'
					),
					editorType: ContentBlockEditor.Select,
					editorProps: {
						options: GET_PAGE_OVERVIEW_ORDER_OPTIONS(),
					},
				},
				headerBackgroundColor: BACKGROUND_COLOR_FIELD(
					Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/defaults___titelbalk-achtergrondkleur'
					),
					{
						label: Config.getConfig().services.i18n.t(
							'admin/content-block/helpers/generators/defaults___transparant'
						),
						value: Color.Transparent,
					}
				),
				...BLOCK_FIELD_DEFAULTS(),
			},
		},
	};
};
