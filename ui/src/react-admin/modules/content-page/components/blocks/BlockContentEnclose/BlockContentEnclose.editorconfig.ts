import { ContentPickerType } from '@viaa/avo2-types';
import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '~content-blocks/defaults';
import { AdminConfigManager } from '~core/config';
import { GET_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DEFAULT_BUTTON_PROPS,
	DefaultContentBlockState,
} from '~modules/content-page/types/content-block.types';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import { tText } from '~shared/helpers/translation-functions';

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
				label: 'title',
				editorType: ContentBlockEditor.TextInput,
			}),
			titleType: {
				label: 'titletype',
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_HEADING_TYPE_OPTIONS(),
				},
			},
			description: {
				label: 'beschrijving',
				editorType: ContentBlockEditor.TextInput,
			},
			buttonType: {
				label: 'buttonType',
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
			},
			buttonLabel: TEXT_FIELD(undefined, {
				label: 'buttonLabel',
				editorType: ContentBlockEditor.TextInput,
			}),
			buttonAltTitle: TEXT_FIELD(undefined, {
				label: 'buttonAltTitle',
				editorType: ContentBlockEditor.TextInput,
			}),
			buttonIcon: {
				label: 'buttonIcon',
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			buttonAction: {
				label: 'buttonAction',
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: [
						'CONTENT_PAGE',
						'IE_OBJECT',
						'ANCHOR_LINK',
						'EXTERNAL_LINK',
						'FILE',
					] as ContentPickerType[],
				},
			},
			elements: {
				label: 'label',
				fields: {
					mediaItem: {
						label: 'content enclose',
						editorType: ContentBlockEditor.ContentPicker,
						editorProps: {
							allowedTypes: ['CONTENT_PAGE', 'IE_OBJECT'] as ContentPickerType[],
						},
					},
				},
				type: 'fieldGroup',
				repeat: {
					defaultState: DEFAULT_BUTTON_PROPS,
					addButtonLabel: 'voeg object toe',
					deleteButtonLabel: 'verwijder object',
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
