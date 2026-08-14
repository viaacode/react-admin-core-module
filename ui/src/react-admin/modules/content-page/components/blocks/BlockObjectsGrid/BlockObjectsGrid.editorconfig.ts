import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '~content-blocks/defaults';
import { GET_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';
import {
	type ContentBlockConfig,
	ContentBlockEditor,
	type ContentBlockField,
	ContentBlockType,
	type DefaultContentBlockState,
	type HeadingTypeOption,
} from '~modules/content-page/types/content-block.types';
import type { PickerItem } from '~modules/shared/types/content-picker';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';

// The grid can hold at most 3 "fixed positions" that are always shown (see FA).
const MAX_FIXED_POSITIONS = 3;

export interface ObjectsGridFixedPositionState {
	// A single ie-object (referenced by its pid / fragmentId) that is pinned to a fixed position.
	mediaItem: PickerItem;
}

export interface ObjectsGridBlockComponentState {
	title: string;
	titleType: HeadingTypeOption;
	// A hetarchief.be search url, e.g. https://hetarchief.be/zoeken?aanbieders=OR-...&page=1
	searchQuery: string;
	// Optional (0 to 3) objects that are always shown, in the order they are entered.
	elements: ObjectsGridFixedPositionState[];
}

const INITIAL_OBJECTS_GRID_FIXED_POSITION_STATE = (): ObjectsGridFixedPositionState => ({
	mediaItem: {
		label: '',
		type: AvoCoreContentPickerType.IE_OBJECT,
		value: '',
	},
});

export const INITIAL_OBJECTS_GRID_COMPONENTS_STATE = (): ObjectsGridBlockComponentState => ({
	title: '',
	titleType: 'h2',
	searchQuery: '',
	elements: [],
});

export const INITIAL_OBJECTS_GRID_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-large',
			bottom: 'bottom-large',
		},
	}),
});

export const OBJECTS_GRID_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___objecten-grid',
		undefined,
		[HET_ARCHIEF]
	),
	type: ContentBlockType.ObjectsGrid,
	components: {
		state: INITIAL_OBJECTS_GRID_COMPONENTS_STATE(),
		fields: {
			// Optional title, shown at the top of the block.
			title: TEXT_FIELD({
				label: tText(
					'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___titel',
					undefined,
					[HET_ARCHIEF]
				),
				validator: undefined,
			}),
			titleType: {
				label: tText(
					'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___titel-grootte',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_HEADING_TYPE_OPTIONS(),
				},
			},
			// Required search url on hetarchief.be that fills the grid.
			searchQuery: TEXT_FIELD({
				label: tText(
					'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___zoekfilter-url',
					undefined,
					[HET_ARCHIEF]
				),
				note: tHtml(
					'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___geef-een-zoek-url-van-hetarchief-be-in-bijvoorbeeld-https-hetarchief-be-zoeken-aanbieders-or-page-1',
					undefined,
					[HET_ARCHIEF]
				),
				validator: (value: string) => {
					const errors: string[] = [];

					if (!value) {
						errors.push(
							tText(
								'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___een-zoekfilter-is-verplicht',
								undefined,
								[HET_ARCHIEF]
							)
						);
						return errors;
					}

					try {
						new URL(value);
					} catch {
						errors.push(
							tText(
								'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___gelieve-een-geldige-url-in-te-vullen',
								undefined,
								[HET_ARCHIEF]
							)
						);
					}

					return errors;
				},
			}),
			// Up to 3 optional fixed positions, each pinned to a specific ie-object.
			elements: {
				label: tText(
					'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___vaste-positie',
					undefined,
					[HET_ARCHIEF]
				),
				type: 'fieldGroup',
				min: 0,
				max: MAX_FIXED_POSITIONS,
				fields: {
					mediaItem: {
						label: tText(
							'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___object-pid-of-fragment-id',
							undefined,
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.ContentPicker,
						editorProps: {
							allowedTypes: [AvoCoreContentPickerType.IE_OBJECT],
							hideTypeDropdown: true,
						},
					} as ContentBlockField,
				},
				repeat: {
					defaultState: INITIAL_OBJECTS_GRID_FIXED_POSITION_STATE(),
					addButtonLabel: tText(
						'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___voeg-een-vaste-positie-toe',
						undefined,
						[HET_ARCHIEF]
					),
					deleteButtonLabel: tText(
						'modules/content-page/components/blocks/block-objects-grid/block-objects-grid___verwijder-vaste-positie',
						undefined,
						[HET_ARCHIEF]
					),
				},
			},
		},
	},
	block: {
		state: INITIAL_OBJECTS_GRID_BLOCK_STATE(),
		fields: {
			// Includes the block-wide background color (see FA), padding, margin, user groups and anchor.
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
