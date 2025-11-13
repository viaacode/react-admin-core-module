import {
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	TEXT_FIELD,
} from '~content-blocks/defaults';
import { AdminConfigManager } from '~core/config/config.class';
import { GET_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
} from '~modules/content-page/types/content-block.types';
import {
	ContentBlockEditor,
	ContentBlockType,
} from '~modules/content-page/types/content-block.types';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types/index';

export const INITIAL_OVERVIEW_NEWSPAPER_TITLES_COMPONENTS_STATE = () => ({
	title: '',
	titleType: 'h3',
	buttonLabel: '',
});

export const INITIAL_OVERVIEW_NEWSPAPER_TITLES_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-extra-large',
			bottom: 'bottom-extra-large',
		},
	}),
});

export const OVERVIEW_NEWSPAPER_TITLES_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'modules/content-page/components/blocks/block-overview-newspaper-titles/overview-newspaper-titles___krantentitels',
		undefined,
		[HET_ARCHIEF]
	),
	type: ContentBlockType.OverviewNewspaperTitles,
	components: {
		state: INITIAL_OVERVIEW_NEWSPAPER_TITLES_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(
				tText(
					'modules/content-page/components/blocks/overview-newspaper-titles___is-verplicht',
					undefined,
					[HET_ARCHIEF]
				),
				{
					label: tText(
						'modules/content-page/components/blocks/overview-newspaper-titles___titel',
						undefined,
						[HET_ARCHIEF]
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			titleType: {
				label: tText(
					'modules/content-page/components/blocks/overview-newspaper-titles___titel-grootte',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_HEADING_TYPE_OPTIONS(),
				},
			},
			buttonType: {
				label: tText(
					'modules/content-page/components/blocks/block-overview-newspaper-titles/overview-newspaper-titles___knop-type-kleur',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
			},
			buttonLabel: TEXT_FIELD(
				tText(
					'modules/content-page/components/blocks/block-overview-newspaper-titles/overview-newspaper-titles___knoptekst-is-verplicht',
					undefined,
					[HET_ARCHIEF]
				),
				{
					label: tText(
						'modules/content-page/components/blocks/block-overview-newspaper-titles/overview-newspaper-titles___knop-tekst',
						undefined,
						[HET_ARCHIEF]
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			buttonAltTitle: TEXT_FIELD(undefined, {
				label: tText(
					'modules/content-page/components/blocks/block-overview-newspaper-titles/overview-newspaper-titles___alternative',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.TextInput,
			}),
			buttonIcon: {
				label: tText(
					'modules/content-page/components/blocks/block-overview-newspaper-titles/overview-newspaper-titles___knop-icoon',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			buttonAction: {
				label: tText(
					'modules/content-page/components/blocks/block-overview-newspaper-titles/overview-newspaper-titles___knop-link',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: ['CONTENT_PAGE', 'INTERNAL_LINK', 'EXTERNAL_LINK', 'ANCHOR_LINK', 'FILE'],
				},
			},
		},
	},
	block: {
		state: INITIAL_OVERVIEW_NEWSPAPER_TITLES_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
