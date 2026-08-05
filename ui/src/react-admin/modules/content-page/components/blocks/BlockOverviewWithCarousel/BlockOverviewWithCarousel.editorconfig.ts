import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import {
	BACKGROUND_COLOR_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FOREGROUND_COLOR_FIELD,
	TEXT_FIELD,
} from '~content-blocks/defaults';
import {
	GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF,
	GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF,
} from '~modules/content-page/const/get-color-options.ts';
import { GET_FULL_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';
import {
	Color,
	type ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	type DefaultContentBlockState,
} from '~modules/content-page/types/content-block.types';
import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload.tsx';
import { PHOTO_TYPES } from '~shared/helpers/files.ts';
import { tText } from '~shared/helpers/translation-functions';
import { validateRequiredValue } from '~shared/helpers/validation.ts';
import { HET_ARCHIEF } from '~shared/types';

const INITIAL_CONTENT_OVERVIEW_WITH_CAROUSEL_ELEMENT_STATE = () => ({
	mediaItem: {
		label: '',
		type: AvoCoreContentPickerType.CONTENT_PAGE,
		value: '',
	},
	image: '',
	title: '',
	backgroundColor: Color.White,
	itemDisplay: '',
});

export const INITIAL_CONTENT_OVERVIEW_WITH_CAROUSEL_COMPONENTS_STATE = () => ({
	title: '',
	titleType: '',
	buttonLabel: '',
	buttonAltTitle: '',
	elements: [INITIAL_CONTENT_OVERVIEW_WITH_CAROUSEL_ELEMENT_STATE()],
});

export const INITIAL_CONTENT_OVERVIEW_WITH_CAROUSEL_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS(),
});

export const CONTENT_OVERVIEW_WITH_CAROUSEL_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___overzicht-met-carrousel'
	),
	type: ContentBlockType.OverviewWithCarousel,
	components: {
		state: INITIAL_CONTENT_OVERVIEW_WITH_CAROUSEL_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(
				{
					label: tText(
						'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___title',
						undefined,
						[HET_ARCHIEF]
					),
				},
				tText(
					'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___titel-is-verplicht',
					undefined,
					[HET_ARCHIEF]
				)
			),
			titleType: {
				label: tText(
					'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___titletype',
					undefined,
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
							'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___titletype-is-verplicht',
							undefined,
							[HET_ARCHIEF]
						)
					),
			},
			buttonLabel: TEXT_FIELD({
				label: tText(
					'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___button-label',
					undefined,
					[HET_ARCHIEF]
				),
			}),
			buttonAltTitle: TEXT_FIELD({
				label: tText(
					'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___button-alt-title',
					undefined,
					[HET_ARCHIEF]
				),
			}),
			buttonAction: {
				label: tText(
					'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___button-action',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: [
						AvoCoreContentPickerType.CONTENT_PAGE,
						AvoCoreContentPickerType.INTERNAL_LINK,
						AvoCoreContentPickerType.EXTERNAL_LINK,
					],
				},
			},
			elements: {
				label: tText(
					'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___content-item',
					undefined,
					[HET_ARCHIEF]
				),
				fields: {
					mediaItem: {
						label: tText(
							'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___item',
							undefined,
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.ContentPicker,
						editorProps: {
							allowedTypes: [
								AvoCoreContentPickerType.EXTERNAL_LINK,
								AvoCoreContentPickerType.CONTENT_PAGE,
								AvoCoreContentPickerType.IE_OBJECT,
							],
						},
					},
					image: {
						label: tText(
							'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___item-image',
							undefined,
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.FileUpload,
						validator: (value: string) =>
							validateRequiredValue(
								value,
								tText(
									'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___afbeelding-is-verplicht',
									undefined,
									[HET_ARCHIEF]
								)
							),
						editorProps: {
							assetType: 'CONTENT_BLOCK_IMAGE',
							allowMulti: false,
							allowedTypes: PHOTO_TYPES,
						} as FileUploadProps,
					},
					imageAlt: TEXT_FIELD({
						label: tText(
							'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___alt-tekst-voor-de-afbeelding',
							undefined,
							[HET_ARCHIEF]
						),
						validator: undefined,
					}),
					title: TEXT_FIELD(
						{
							label: tText(
								'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___item-title',
								undefined,
								[HET_ARCHIEF]
							),
						},
						tText(
							'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___titel-is-verplicht',
							undefined,
							[HET_ARCHIEF]
						)
					),
					backgroundColor: BACKGROUND_COLOR_FIELD(
						tText(
							'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___achtergrondkleur-van-het-item',
							undefined,
							[HET_ARCHIEF]
						),
						GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[1]
					),
					textColor: FOREGROUND_COLOR_FIELD(
						tText(
							'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___tekst-kleur',
							undefined,
							[HET_ARCHIEF]
						),
						GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF()[3]
					),
					itemDisplay: {
						label: tText(
							'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___weergave',
							undefined,
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.Select,
						editorProps: {
							options: [
								{
									label: tText(
										'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___portret',
										undefined,
										[HET_ARCHIEF]
									),
									value: '9:16',
								},
								{
									label: tText(
										'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___afgerond-portret',
										undefined,
										[HET_ARCHIEF]
									),
									value: '9:16round',
								},
								{
									label: tText(
										'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___landscape',
										undefined,
										[HET_ARCHIEF]
									),
									value: '16:9',
								},
							],
						},
						validator: (value: string) =>
							validateRequiredValue(
								value,
								tText(
									'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___weergave-is-verplicht',
									undefined,
									[HET_ARCHIEF]
								)
							),
					},
				},
				type: 'fieldGroup',
				repeat: {
					defaultState: INITIAL_CONTENT_OVERVIEW_WITH_CAROUSEL_ELEMENT_STATE(),
					addButtonLabel: tText(
						'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___voeg-object-toe',
						undefined,
						[HET_ARCHIEF]
					),
					deleteButtonLabel: tText(
						'modules/content-page/components/blocks/block-overview-with-carousel/block-overview-with-carousel___verwijder-object',
						undefined,
						[HET_ARCHIEF]
					),
				},
			},
		},
	},
	block: {
		state: INITIAL_CONTENT_OVERVIEW_WITH_CAROUSEL_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
