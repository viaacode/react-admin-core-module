import {
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	COPYRIGHT_FIELDS,
	COPYRIGHT_STATE,
	TEXT_FIELD,
} from '~content-blocks/defaults';
import { GET_FULL_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';
import {
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

const INITIAL_IMAGE_CAROUSEL_ELEMENT_STATE = () => ({
	image: '',
	imageAlt: '',
	...COPYRIGHT_STATE(),
});

export const INITIAL_IMAGE_CAROUSEL_COMPONENTS_STATE = () => ({
	title: '',
	titleType: 'h2',
	elements: [INITIAL_IMAGE_CAROUSEL_ELEMENT_STATE()],
});

export const INITIAL_IMAGE_CAROUSEL_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS(),
});

export const IMAGE_CAROUSEL_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'modules/content-page/components/blocks/block-image-carousel/block-image-carousel___Carousel-met-afbeeldingen'
	),
	type: ContentBlockType.ImageCarousel,
	components: {
		state: INITIAL_IMAGE_CAROUSEL_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(
				{
					label: tText(
						'modules/content-page/components/blocks/block-image-carousel/block-image-carousel___title',
						undefined,
						[HET_ARCHIEF]
					),
				},
				tText(
					'modules/content-page/components/blocks/block-image-carousel/block-image-carousel___titel-is-verplicht',
					undefined,
					[HET_ARCHIEF]
				)
			),
			titleType: {
				label: tText(
					'modules/content-page/components/blocks/block-image-carousel/block-image-carousel___titletype',
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
							'modules/content-page/components/blocks/block-image-carousel/block-image-carousel___titletype-is-verplicht',
							undefined,
							[HET_ARCHIEF]
						)
					),
			},
			elements: {
				label: tText(
					'modules/content-page/components/blocks/block-image-carousel/block-image-carousel___content-item',
					undefined,
					[HET_ARCHIEF]
				),
				fields: {
					image: {
						label: tText(
							'modules/content-page/components/blocks/block-image-carousel/block-image-carousel___item-image',
							undefined,
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.FileUpload,
						validator: (value: string) =>
							validateRequiredValue(
								value,
								tText(
									'modules/content-page/components/blocks/block-image-carousel/block-image-carousel___afbeelding-is-verplicht',
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
							'modules/content-page/components/blocks/block-image-carousel/block-image-carousel___alt-tekst-voor-de-afbeelding',
							undefined,
							[HET_ARCHIEF]
						),
						validator: undefined,
					}),
					...COPYRIGHT_FIELDS(),
				},
				type: 'fieldGroup',
				repeat: {
					defaultState: INITIAL_IMAGE_CAROUSEL_ELEMENT_STATE(),
					addButtonLabel: tText(
						'modules/content-page/components/blocks/block-image-carousel/block-image-carousel___voeg-afbeelding-toe',
						undefined,
						[HET_ARCHIEF]
					),
					deleteButtonLabel: tText(
						'modules/content-page/components/blocks/block-image-carousel/block-image-carousel___verwijder-afbeelding',
						undefined,
						[HET_ARCHIEF]
					),
				},
			},
		},
	},
	block: {
		state: INITIAL_IMAGE_CAROUSEL_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
