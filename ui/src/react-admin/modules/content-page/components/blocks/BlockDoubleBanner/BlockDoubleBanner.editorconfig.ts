import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import {
	GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF,
	GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF,
} from '~modules/content-page/const/get-color-options';
import {
	Color,
	type ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	type DefaultContentBlockState,
} from '~modules/content-page/types/content-block.types';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import { tText } from '~shared/helpers/translation-functions';
import { validateRequiredValue } from '~shared/helpers/validation';
import { HET_ARCHIEF } from '~shared/types';
import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from '../defaults';

const INITIAL_DOUBLE_BANNER_HALF_STATE = () => ({
	label: '',
	icon1: '',
	icon2: '',
	icon3: '',
	link: undefined,
	image: '',
	textColor: Color.White,
	backgroundColor: Color.Black,
});

/**
 * The block always shows exactly two halves, so `halves` starts with two entries and the group is
 * pinned to min = max = 2: `FieldGenerator` then hides both the add and the delete button, which is
 * how the FA requirement "beide helften moeten volledig ingevuld worden" is enforced in the editor.
 * https://meemoo.atlassian.net/browse/ARC-3833
 */
export const INITIAL_DOUBLE_BANNER_COMPONENTS_STATE = () => ({
	halves: [INITIAL_DOUBLE_BANNER_HALF_STATE(), INITIAL_DOUBLE_BANNER_HALF_STATE()],
});

export const INITIAL_DOUBLE_BANNER_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS();

const ICON_FIELD = (label: string) => ({
	label,
	editorType: ContentBlockEditor.IconPicker,
	editorProps: {
		options: GET_ADMIN_ICON_OPTIONS(),
	},
});

export const DOUBLE_BANNER_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'modules/content-page/components/blocks/block-double-banner/block-double-banner___dubbele-banner',
		{},
		[HET_ARCHIEF]
	),
	type: ContentBlockType.DoubleBanner,
	components: {
		state: INITIAL_DOUBLE_BANNER_COMPONENTS_STATE(),
		fields: {
			halves: {
				label: tText(
					'modules/content-page/components/blocks/block-double-banner/block-double-banner___helft',
					{},
					[HET_ARCHIEF]
				),
				type: 'fieldGroup',
				min: 2,
				max: 2,
				repeat: {
					defaultState: INITIAL_DOUBLE_BANNER_HALF_STATE(),
				},
				fields: {
					label: TEXT_FIELD(
						{
							label: tText(
								'modules/content-page/components/blocks/block-double-banner/block-double-banner___label',
								{},
								[HET_ARCHIEF]
							),
						},
						tText(
							'modules/content-page/components/blocks/block-double-banner/block-double-banner___label-is-verplicht',
							{},
							[HET_ARCHIEF]
						)
					),
					icon1: ICON_FIELD(
						tText(
							'modules/content-page/components/blocks/block-double-banner/block-double-banner___icoon-1',
							{},
							[HET_ARCHIEF]
						)
					),
					icon2: ICON_FIELD(
						tText(
							'modules/content-page/components/blocks/block-double-banner/block-double-banner___icoon-2',
							{},
							[HET_ARCHIEF]
						)
					),
					icon3: ICON_FIELD(
						tText(
							'modules/content-page/components/blocks/block-double-banner/block-double-banner___icoon-3',
							{},
							[HET_ARCHIEF]
						)
					),
					link: {
						label: tText(
							'modules/content-page/components/blocks/block-double-banner/block-double-banner___bestemming',
							{},
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.ContentPicker,
						editorProps: {
							allowedTypes: [
								AvoCoreContentPickerType.CONTENT_PAGE,
								AvoCoreContentPickerType.INTERNAL_LINK,
								AvoCoreContentPickerType.EXTERNAL_LINK,
								AvoCoreContentPickerType.ANCHOR_LINK,
							],
							// The FA requires the destination to always open in the same tab
							hideTargetSwitch: true,
						},
						validator: (value: string) =>
							validateRequiredValue(
								value,
								tText(
									'modules/content-page/components/blocks/block-double-banner/block-double-banner___bestemming-is-verplicht',
									{},
									[HET_ARCHIEF]
								)
							),
					},
					image: FILE_FIELD(
						tText(
							'modules/content-page/components/blocks/block-double-banner/block-double-banner___afbeelding-is-verplicht',
							{},
							[HET_ARCHIEF]
						),
						{
							label: tText(
								'modules/content-page/components/blocks/block-double-banner/block-double-banner___afbeelding',
								{},
								[HET_ARCHIEF]
							),
							editorProps: {
								assetType: 'CONTENT_BLOCK_IMAGE',
								allowMulti: false,
							},
						}
					),
					textColor: {
						label: tText(
							'modules/content-page/components/blocks/block-double-banner/block-double-banner___tekstkleur',
							{},
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.ColorSelect,
						editorProps: {
							options: GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF(),
							defaultValue: Color.White,
						},
						validator: (value: string) =>
							validateRequiredValue(
								value,
								tText(
									'modules/content-page/components/blocks/block-double-banner/block-double-banner___tekstkleur-is-verplicht',
									{},
									[HET_ARCHIEF]
								)
							),
					},
					backgroundColor: {
						label: tText(
							'modules/content-page/components/blocks/block-double-banner/block-double-banner___achtergrondkleur-tekstvak',
							{},
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.ColorSelect,
						editorProps: {
							options: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF(),
							defaultValue: Color.Black,
						},
						validator: (value: string) =>
							validateRequiredValue(
								value,
								tText(
									'modules/content-page/components/blocks/block-double-banner/block-double-banner___achtergrondkleur-tekstvak-is-verplicht',
									{},
									[HET_ARCHIEF]
								)
							),
					},
				},
			},
		},
	},
	block: {
		state: INITIAL_DOUBLE_BANNER_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
