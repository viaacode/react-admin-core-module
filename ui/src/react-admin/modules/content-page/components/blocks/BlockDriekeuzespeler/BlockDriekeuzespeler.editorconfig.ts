import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import {
	BACKGROUND_COLOR_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FOREGROUND_COLOR_FIELD,
	IE_OBJECT_FIELD,
	TEXT_FIELD,
} from '~content-blocks/defaults';
import {
	GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF,
	GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF,
} from '~modules/content-page/const/get-color-options.ts';
import {
	Color,
	type ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	type DefaultContentBlockState,
	type DriekeuzespelerInterestState,
	type DriekeuzespelerTileColors,
} from '~modules/content-page/types/content-block.types';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';

/**
 * The block always renders three tiles, so the colour list is fixed at three entries and the
 * interest list needs at least three to fill them.
 */
export const DRIEKEUZESPELER_TILE_COUNT = 3;
export const DRIEKEUZESPELER_MIN_INTERESTS = 3;
export const DRIEKEUZESPELER_MAX_INTERESTS = 200;

const INITIAL_TILE_COLORS_STATE = (): DriekeuzespelerTileColors => ({
	backgroundColor: Color.Transparent,
	textColor: Color.Black,
});

const INITIAL_DRIEKEUZESPELER_INTEREST_STATE = (): DriekeuzespelerInterestState => ({
	name: '',
	mediaItem: undefined,
	theme: undefined,
});

export const INITIAL_DRIEKEUZESPELER_COMPONENTS_STATE = () => ({
	title: '',
	tileColors: Array.from({ length: DRIEKEUZESPELER_TILE_COUNT }, () => INITIAL_TILE_COLORS_STATE()),
	shuffleButtonLabel: '',
	// Start at the minimum, so a freshly added block is one valid tile-set away from being usable.
	interests: Array.from({ length: DRIEKEUZESPELER_MIN_INTERESTS }, () =>
		INITIAL_DRIEKEUZESPELER_INTEREST_STATE()
	),
});

export const INITIAL_DRIEKEUZESPELER_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS(),
	fullWidth: true,
});

export const DRIEKEUZESPELER_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___driekeuzespeler',
		undefined,
		[HET_ARCHIEF]
	),
	type: ContentBlockType.ThreeChoicesPlayer,
	components: {
		state: INITIAL_DRIEKEUZESPELER_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(
				{
					label: tText(
						'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___titel',
						undefined,
						[HET_ARCHIEF]
					),
				},
				tText(
					'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___titel-is-verplicht',
					undefined,
					[HET_ARCHIEF]
				)
			),
			tileColors: {
				label: tText(
					'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___kleuren-van-de-interesse-op-tegel',
					undefined,
					[HET_ARCHIEF]
				),
				type: 'fieldGroup',
				min: DRIEKEUZESPELER_TILE_COUNT,
				max: DRIEKEUZESPELER_TILE_COUNT,
				repeat: {
					defaultState: INITIAL_TILE_COLORS_STATE(),
				},
				fields: {
					backgroundColor: BACKGROUND_COLOR_FIELD(
						tText(
							'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___achtergrondkleur',
							undefined,
							[HET_ARCHIEF]
						),
						GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[0]
					),
					textColor: FOREGROUND_COLOR_FIELD(
						tText(
							'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___tekstkleur',
							undefined,
							[HET_ARCHIEF]
						),
						GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF()[0]
					),
				},
			},
			shuffleButtonLabel: TEXT_FIELD(
				{
					label: tText(
						'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___label-van-de-shuffle-knop',
						undefined,
						[HET_ARCHIEF]
					),
				},
				tText(
					'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___label-van-de-shuffle-knop-is-verplicht',
					undefined,
					[HET_ARCHIEF]
				)
			),
			interests: {
				label: tText(
					'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___interesse',
					undefined,
					[HET_ARCHIEF]
				),
				type: 'fieldGroup',
				min: DRIEKEUZESPELER_MIN_INTERESTS,
				max: DRIEKEUZESPELER_MAX_INTERESTS,
				fields: {
					name: TEXT_FIELD(
						{
							label: tText(
								'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___naam-van-de-interesse',
								undefined,
								[HET_ARCHIEF]
							),
						},
						tText(
							'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___naam-van-de-interesse-is-verplicht',
							undefined,
							[HET_ARCHIEF]
						)
					),
					mediaItem: IE_OBJECT_FIELD({ isRequired: true }),
					theme: {
						label: tText(
							'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___gerelateerd-thema',
							undefined,
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.ContentPicker,
						editorProps: {
							allowedTypes: [AvoCoreContentPickerType.IE_OBJECT_THEME],
							hideTypeDropdown: true,
							hideTargetSwitch: true,
						},
					},
				},
				repeat: {
					defaultState: INITIAL_DRIEKEUZESPELER_INTEREST_STATE(),
					addButtonLabel: tText(
						'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___voeg-een-interesse-toe',
						undefined,
						[HET_ARCHIEF]
					),
					deleteButtonLabel: tText(
						'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___verwijder-deze-interesse',
						undefined,
						[HET_ARCHIEF]
					),
				},
			},
		},
	},
	block: {
		state: INITIAL_DRIEKEUZESPELER_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
