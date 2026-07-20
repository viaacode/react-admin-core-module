import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '~content-blocks/defaults';
import { GET_FULL_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';
import {
	type ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	type DefaultContentBlockState,
} from '~modules/content-page/types/content-block.types';
import { tText } from '~shared/helpers/translation-functions';
import { validateRequiredValue } from '~shared/helpers/validation';
import { HET_ARCHIEF } from '~shared/types';

const INITIAL_OVERVIEW_THEMES_THEME_STATE = () => ({
	label: '',
	type: AvoCoreContentPickerType.IE_OBJECT_THEME,
	value: '',
});

const INITIAL_OVERVIEW_THEMES_GROUP_STATE = () => ({
	title: '',
	titleType: 'h2',
	themes: [INITIAL_OVERVIEW_THEMES_THEME_STATE()],
});

// `components.state` for a repeatable block must be an array: the editor pushes/splices entries
// into it directly (see content-edit.reducer.ts), and `ContentBlockRenderer` passes it straight
// through as the `elements` prop.
export const INITIAL_OVERVIEW_THEMES_COMPONENTS_STATE = () => [INITIAL_OVERVIEW_THEMES_GROUP_STATE()];

export const INITIAL_OVERVIEW_THEMES_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS();

export const OVERVIEW_THEMES_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('modules/content-page/const/get-content-block-type-options___overzicht-themas', {}, [
		HET_ARCHIEF,
	]),
	type: ContentBlockType.OverviewThemes,
	components: {
		name: tText(
			'modules/content-page/components/blocks/block-overview-themes/block-overview-themes___themagroep',
			{},
			[HET_ARCHIEF]
		),
		limits: {
			min: 1,
		},
		state: INITIAL_OVERVIEW_THEMES_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(
				{
					label: tText(
						'modules/content-page/components/blocks/block-overview-themes/block-overview-themes___titel',
						{},
						[HET_ARCHIEF]
					),
				},
				tText(
					'modules/content-page/components/blocks/block-overview-themes/block-overview-themes___titel-is-verplicht',
					{},
					[HET_ARCHIEF]
				)
			),
			titleType: {
				label: tText(
					'modules/content-page/components/blocks/block-overview-themes/block-overview-themes___titel-type',
					{},
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_FULL_HEADING_TYPE_OPTIONS(),
				},
				validator: (value: string) =>
					validateRequiredValue(
						value,
						tText(
							'modules/content-page/components/blocks/block-overview-themes/block-overview-themes___titel-type-is-verplicht',
							{},
							[HET_ARCHIEF]
						)
					),
			},
			themes: {
				label: tText(
					'modules/content-page/components/blocks/block-overview-themes/block-overview-themes___thema',
					{},
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: [AvoCoreContentPickerType.IE_OBJECT_THEME],
					hideTypeDropdown: true,
					hideTargetSwitch: true,
				},
				repeat: {
					defaultState: INITIAL_OVERVIEW_THEMES_THEME_STATE(),
					addButtonLabel: tText(
						'modules/content-page/components/blocks/block-overview-themes/block-overview-themes___voeg-thema-toe',
						{},
						[HET_ARCHIEF]
					),
					deleteButtonLabel: tText(
						'modules/content-page/components/blocks/block-overview-themes/block-overview-themes___verwijder-thema',
						{},
						[HET_ARCHIEF]
					),
				},
			},
		},
	},
	block: {
		state: INITIAL_OVERVIEW_THEMES_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
