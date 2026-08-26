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
import { validateRequiredValue } from '~shared/helpers/validation.ts';
import { HET_ARCHIEF } from '~shared/types';

/**
 * The block always renders three tiles, so the color list is fixed at three entries and the
 * interest list needs at least three to fill them.
 * https://meemoo.atlassian.net/wiki/spaces/HA2/pages/6218383419
 */
export const DRIEKEUZESPELER_TILE_COUNT = 3;
export const DRIEKEUZESPELER_MIN_INTERESTS = 3;
export const DRIEKEUZESPELER_MAX_INTERESTS = 200;

// "geen" and "zwart" are the defaults the FA asks for.
const INITIAL_TILE_COLORS_STATE = (): DriekeuzespelerTileColors => ({
	backgroundColor: Color.Transparent,
	textColor: Color.Black,
});

const INITIAL_DRIEKEUZESPELER_INTEREST_STATE = (): DriekeuzespelerInterestState => ({
	name: '',
	// The object picker fills this in; an empty entry has nothing selected yet.
	mediaItem: undefined,
	themeId: '',
});

// The key order is the order the editor renders the fields in, and it follows the FA.
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
	// The design is a full-bleed band: the background spans the viewport and the tiles span 1222 of
	// the 1440 frame. Inside the default 940px content column everything renders at ~77% of the
	// design size. https://meemoo.atlassian.net/browse/ARC-3813
	fullWidth: true,
});

export const DRIEKEUZESPELER_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___driekeuzespeler',
		undefined,
		[HET_ARCHIEF]
	),
	type: ContentBlockType.Driekeuzespeler,
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
			// One fixed-length group of three, one entry per tile. `repeat` is what makes FieldGenerator
			// walk the array and render one sub-form per entry; equal min and max then hide both the add
			// and the delete button, so the count is fixed at three and the admin cannot change it.
			//
			// A tile's colours cannot sit next to its label: the colours belong to the tile position,
			// while the label travels with whichever interest a shuffle puts there. That is why there are
			// three colour entries and three to two hundred interests.
			tileColors: {
				// FieldGenerator renders this label with the entry number after it, so it has to name the
				// tile and not the interest: "op tegel 1" cannot be read as "interesse 1". The colour
				// belongs to the position, and a shuffle decides which interest lands there.
				//
				// Both colours of a tile sit in one group, so the admin fills in a tile completely before
				// moving to the next. The FA lists them as two bullets, but that list is headed
				// "mogelijkheden" and describes the two properties -- it does not prescribe the grouping
				// in contentbeheer. What the FA does state is kept: three colours for tegel 1, 2 and 3,
				// both required, defaults "geen" and "zwart".
				label: tText(
					'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___kleuren-van-de-interesse-op-tegel',
					undefined,
					[HET_ARCHIEF]
				),
				type: 'fieldGroup',
				min: DRIEKEUZESPELER_TILE_COUNT,
				max: DRIEKEUZESPELER_TILE_COUNT,
				repeat: {
					// Never used: the add button is hidden because min equals max. It is here because
					// FieldGenerator only iterates a group that carries a `repeat` descriptor.
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
					// The FA asks for "Pid of fragmentId". That is the value, and the shared object picker
					// stores exactly it while letting the admin search by title instead of typing a pid.
					// Every other block that points at an ie-object uses the same field under the same
					// `mediaItem` key, which is what the proxy reads.
					mediaItem: IE_OBJECT_FIELD(),
					themeId: {
						label: tText(
							'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___gerelateerd-thema',
							undefined,
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.ThemeSelect,
						validator: (value: string) =>
							validateRequiredValue(
								value,
								tText(
									'modules/content-page/components/blocks/block-driekeuzespeler/block-driekeuzespeler___een-thema-is-verplicht',
									undefined,
									[HET_ARCHIEF]
								)
							),
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
