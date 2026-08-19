import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import type { HeroCarouselBlockComponentState } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { BlockPageOverviewProps, ContentItemStyle } from '~content-blocks/BlockPageOverview';
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
	type ContentBlockField,
	type ContentBlockFieldGroup,
	ContentBlockType,
	DEFAULT_BUTTON_PROPS,
	type DefaultContentBlockState,
} from '~modules/content-page/types/content-block.types';
import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload.tsx';
import { PHOTO_TYPES } from '~shared/helpers/files.ts';
import { toSeconds } from '~shared/helpers/parsers/duration.ts';
import { tText } from '~shared/helpers/translation-functions';
import { validateRequiredValue } from '~shared/helpers/validation.ts';
import { HET_ARCHIEF } from '~shared/types';
import type { PickerItem } from '~shared/types/content-picker.ts';

const INITIAL_HERO_CAROUSEL_ELEMENT_STATE = (): HeroCarouselBlockComponentState => ({
	mediaItem: {
		type: AvoCoreContentPickerType.IE_OBJECT,
		value: '',
	},
	startPoint: '',
	endPoint: '',
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

const snipPointIsVisible: ContentBlockField['isVisible'] = (config, formGroupState) => {
	return (
		videoIsVisible(config, formGroupState) ||
		['audio', 'audiofragment'].includes(
			(formGroupState as HeroCarouselBlockComponentState).mediaItem?.dctermsFormat ?? ''
		)
	);
};

const SNIP_POINT_FIELD = (label: string, error: string) =>
	TEXT_FIELD({
		label,
		editorProps: {
			placeholder: tText(
				'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___hh-mm-ss',
				undefined,
				[HET_ARCHIEF]
			),
		},
		validator: (value: string) => {
			if (value) {
				if (value.length !== 8 || toSeconds(value, true) === null) {
					return [error];
				}
			}

			return [];
		},
		isVisible: snipPointIsVisible,
	});

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
					mediaItem: {
						label: tText(
							'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___object',
							undefined,
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.ContentPicker,
						editorProps: {
							allowedTypes: [AvoCoreContentPickerType.IE_OBJECT],
							hideTypeDropdown: true,
							hideTargetSwitch: true,
						},
						fieldsToResetOnChange: ['startPoint', 'endPoint'],
						validator: (value: PickerItem) => {
							if (!value?.value) {
								return [
									tText(
										'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___object-is-verplicht',
										undefined,
										[HET_ARCHIEF]
									),
								];
							}
							return [];
						},
					},
					startPoint: SNIP_POINT_FIELD(
						tText(
							'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___start-cue-point',
							undefined,
							[HET_ARCHIEF]
						),
						tText(
							'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___start-cue-point-heeft-het-verkeerde-formaat',
							undefined,
							[HET_ARCHIEF]
						)
					),
					endPoint: SNIP_POINT_FIELD(
						tText(
							'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___end-cue-point',
							undefined,
							[HET_ARCHIEF]
						),
						tText(
							'modules/content-page/components/blocks/block-hero-carousel/block-hero-carousel___end-cue-point-heeft-het-verkeerde-formaat',
							undefined,
							[HET_ARCHIEF]
						)
					),
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
