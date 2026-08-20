import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import type { HeroCarouselBlockComponentState } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '~content-blocks/defaults';
import { IE_OBJECT_WITH_SNIPPET_TIME_FIELDS } from '~modules/content-page/helpers/snippet-time-fields.ts';
import {
	type ContentBlockConfig,
	ContentBlockEditor,
	type ContentBlockField,
	type ContentBlockFieldGroup,
	ContentBlockType,
	DEFAULT_BUTTON_PROPS,
	type DefaultContentBlockState,
} from '~modules/content-page/types/content-block.types';
import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload.tsx';
import { PHOTO_TYPES } from '~shared/helpers/files.ts';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';

const INITIAL_HERO_CAROUSEL_ELEMENT_STATE = (): HeroCarouselBlockComponentState => ({
	mediaItem: {
		type: AvoCoreContentPickerType.IE_OBJECT,
		value: '',
	},
	startTime: '',
	endTime: '',
	videoThumbnail: undefined,
});

export const INITIAL_HERO_CAROUSEL_COMPONENTS_STATE = () => ({
	backgroundImage: '',
	title: '',
	subtitles: [],
	elements: [INITIAL_HERO_CAROUSEL_ELEMENT_STATE()],
});

export const INITIAL_HERO_CAROUSEL_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS(),
});

const videoIsVisible: ContentBlockField['isVisible'] = (_config, formGroupState) => {
	return ['film', 'video', 'videofragment'].includes(
		(formGroupState as HeroCarouselBlockComponentState).mediaItem?.dctermsFormat ?? ''
	);
};

export const HERO_CAROUSEL_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___hero-carousel'
	),
	type: ContentBlockType.HeroCarousel,
	components: {
		state: INITIAL_HERO_CAROUSEL_COMPONENTS_STATE(),
		fields: {
			backgroundImage: {
				label: tText(
					'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___achtergrondafbeelding-krijgt-voorrang-op-achtergrondkleur',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.FileUpload,
				editorProps: {
					assetType: 'CONTENT_BLOCK_IMAGE',
					allowMulti: false,
					allowedTypes: PHOTO_TYPES,
				} as FileUploadProps,
			},
			title: TEXT_FIELD(
				{
					label: tText(
						'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___titel',
						{},
						[HET_ARCHIEF]
					),
				},
				tText(
					'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___is-verplicht',
					{},
					[HET_ARCHIEF]
				)
			),
			subtitles: {
				label: tText(
					'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___animatie-teksten',
					{},
					[HET_ARCHIEF]
				),
				fields: {
					label: TEXT_FIELD({
						label: tText(
							'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___animatie-tekst',
							{},
							[HET_ARCHIEF]
						),
						validator: undefined,
					}),
				},
				type: 'fieldGroup',
				repeat: {
					defaultState: DEFAULT_BUTTON_PROPS,
					addButtonLabel: tText(
						'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___voeg-animatie-tekst-toe',
						{},
						[HET_ARCHIEF]
					),
					deleteButtonLabel: tText(
						'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___verwijder-animatie-tekst',
						{},
						[HET_ARCHIEF]
					),
				},
			} as ContentBlockFieldGroup,
			searchAriaLabel: TEXT_FIELD(
				{
					label: tText(
						'modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___aria-label-voor-zoekveld',
						{},
						[HET_ARCHIEF]
					),
				},
				tText(
					'modules/content-page/components/blocks/block-het-archief-header-search/block-het-archief-header-search___aria-label-verplicht',
					{},
					[HET_ARCHIEF]
				)
			),
			elements: {
				label: tText(
					'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___content-item',
					undefined,
					[HET_ARCHIEF]
				),
				fields: {
					...IE_OBJECT_WITH_SNIPPET_TIME_FIELDS(),
					videoThumbnail: {
						label: tText(
							'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___thumbnail',
							undefined,
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.FileUpload,
						editorProps: {
							assetType: 'CONTENT_BLOCK_IMAGE',
							allowMulti: false,
							allowedTypes: PHOTO_TYPES,
						} as FileUploadProps,
						isVisible: videoIsVisible,
					},
				},
				type: 'fieldGroup',
				max: 100,
				repeat: {
					defaultState: INITIAL_HERO_CAROUSEL_ELEMENT_STATE(),
					addButtonLabel: tText(
						'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___voeg-een-object-toe',
						undefined,
						[HET_ARCHIEF]
					),
					deleteButtonLabel: tText(
						'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___verwijder-object',
						undefined,
						[HET_ARCHIEF]
					),
				},
			},
		},
	},
	block: {
		state: INITIAL_HERO_CAROUSEL_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
