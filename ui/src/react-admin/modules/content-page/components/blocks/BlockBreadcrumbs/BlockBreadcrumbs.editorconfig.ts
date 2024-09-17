import type { ContentPickerType } from '@viaa/avo2-types';
import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS } from '~content-blocks/defaults';
import { GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF } from '~modules/content-page/const/get-color-options';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
} from '~modules/content-page/types/content-block.types';
import {
	ContentBlockEditor,
	ContentBlockType,
	DEFAULT_BUTTON_PROPS,
} from '~modules/content-page/types/content-block.types';
import { tText } from '~shared/helpers/translation-functions';

export const INITIAL_BREADCRUMBS_COMPONENTS_STATE = () => ({
	foregroundColor: GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF()[0].value,
	elements: [
		{
			label: '',
			link: {
				value: '',
			},
		},
	],
});

export const INITIAL_BREADCRUMBS_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-small',
			bottom: 'bottom-small',
		},
	}),
});

export const CONTENT_BREADCRUMBS_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'modules/content-page/components/blocks/block-breadcrumbs/block-breadcrumbs___breadcrumbs'
	),
	type: ContentBlockType.Breadcrumbs,
	components: {
		state: INITIAL_BREADCRUMBS_COMPONENTS_STATE(),
		fields: {
			foregroundColor: {
				label: tText(
					'modules/content-page/components/blocks/block-breadcrumbs/block-breadcrumbs___tekstkleur'
				),
				editorType: ContentBlockEditor.ColorSelect,
				editorProps: {
					options: GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF(),
					defaultValue: GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF()[0],
				},
			},
			elements: {
				label: 'breadcrumb',
				fields: {
					label: {
						label: tText(
							'modules/content-page/components/blocks/block-breadcrumbs/block-breadcrumbs___label'
						),
						editorType: ContentBlockEditor.TextInput,
					},
					link: {
						label: tText(
							'modules/content-page/components/blocks/block-breadcrumbs/block-breadcrumbs___link'
						),
						editorType: ContentBlockEditor.ContentPicker,
						editorProps: {
							allowedTypes: [
								'CONTENT_PAGE',
								'INTERNAL_LINK',
								'EXTERNAL_LINK',
							] as ContentPickerType[],
						},
					},
				},
				type: 'fieldGroup',
				repeat: {
					defaultState: DEFAULT_BUTTON_PROPS,
					addButtonLabel: tText(
						'modules/content-page/components/blocks/block-breadcrumbs/block-breadcrumbs___voeg-object-toe'
					),
					deleteButtonLabel: tText(
						'modules/content-page/components/blocks/block-breadcrumbs/block-breadcrumbs___verwijder-object'
					),
				},
			},
		},
	},
	block: {
		state: INITIAL_BREADCRUMBS_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
