import type { ContentPickerType } from '@viaa/avo2-types';
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
	DEFAULT_BUTTON_PROPS,
} from '~modules/content-page/types/content-block.types';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types/index';

export const INITIAL_CONTENT_ENCLOSE_COMPONENTS_STATE = () => ({
	title: '',
	image: '',
	titleType: 'h4',
	description: '',
	elements: [
		{
			mediaItem: {
				label: '',
				type: 'IE_OBJECT',
				value: '',
			},
		},
	],
});

export const INITIAL_CONTENT_ENCLOSE_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-extra-large',
			bottom: 'bottom-extra-large',
		},
	}),
});

export const CONTENT_ENCLOSE_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___content-insluiten'
	),
	type: ContentBlockType.ContentEncloseGrid,
	components: {
		state: INITIAL_CONTENT_ENCLOSE_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD('title', {
				label: tText(
					'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___title',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.TextInput,
			}),
			titleType: {
				label: tText(
					'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___titletype',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_HEADING_TYPE_OPTIONS(),
				},
			},
			description: {
				label: tText(
					'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___beschrijving',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.TextInput,
			},
			buttonType: {
				label: tText(
					'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___button-type',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
			},
			buttonLabel: TEXT_FIELD(undefined, {
				label: tText(
					'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___button-label',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.TextInput,
			}),
			buttonAltTitle: TEXT_FIELD(undefined, {
				label: tText(
					'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___button-alt-title',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.TextInput,
			}),
			buttonIcon: {
				label: tText(
					'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___button-icon',
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
					'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___button-action',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: [
						'IE_OBJECT',
						'CONTENT_PAGE',
						'INTERNAL_LINK',
						'EXTERNAL_LINK',
						'ANCHOR_LINK',
						'FILE',
					] as ContentPickerType[],
				},
			},
			elements: {
				label: tText(
					'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___content-item',
					undefined,
					[HET_ARCHIEF]
				),
				fields: {
					mediaItem: {
						label: tText(
							'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___content-enclose',
							undefined,
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.ContentPicker,
						editorProps: {
							allowedTypes: ['CONTENT_PAGE', 'IE_OBJECT'] as ContentPickerType[],
						},
					},
				},
				type: 'fieldGroup',
				repeat: {
					defaultState: DEFAULT_BUTTON_PROPS,
					addButtonLabel: tText(
						'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___voeg-object-toe',
						undefined,
						[HET_ARCHIEF]
					),
					deleteButtonLabel: tText(
						'modules/content-page/components/blocks/block-content-enclose/block-content-enclose___verwijder-object',
						undefined,
						[HET_ARCHIEF]
					),
				},
			},
		},
	},
	block: {
		state: INITIAL_CONTENT_ENCLOSE_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
