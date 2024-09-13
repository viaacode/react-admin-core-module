import type {
	ContentBlockConfig,
	ContentBlockField,
	DefaultContentBlockState,
	KlaarBlockComponentState} from '~modules/content-page/types/content-block.types';
import {
	ContentBlockEditor,
	ContentBlockType
} from '~modules/content-page/types/content-block.types';
import { tText } from '~shared/helpers/translation-functions';
import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

export const INITIAL_UITGEKLAARD_COMPONENTS_STATE = (): KlaarBlockComponentState => ({
	titles: [''],
	date: '',
});

export const INITIAL_UITGEKLAARD_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'none',
			bottom: 'none',
		},
	});

export const UITGEKLAARD_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/uitgeklaard___uitgeklaard'),
	type: ContentBlockType.Uitgeklaard,
	components: {
		name: tText('admin/content-block/helpers/generators/uitgeklaard___uitgeklaard-titel'),
		limits: {
			max: 3,
		},
		state: INITIAL_UITGEKLAARD_COMPONENTS_STATE(),
		fields: {
			titles: TEXT_FIELD(
				tText('admin/content-block/helpers/generators/uitgeklaard___titel-is-verplicht'),
				{
					label: tText('admin/content-block/helpers/generators/uitgeklaard___titel'),
					editorType: ContentBlockEditor.TextInput,
					repeat: {
						defaultState: '',
						addButtonLabel: tText(
							'admin/content-block/helpers/generators/uitgeklaard___voeg-titel-toe'
						),
						deleteButtonLabel: tText(
							'admin/content-block/helpers/generators/uitgeklaard___verwijder-titel'
						),
					},
				}
			) as ContentBlockField,
			date: {
				label: 'Datum',
				editorType: ContentBlockEditor.DatePicker,
				validator: (value: string) => {
					const errorArray: string[] = [];

					if (!value) {
						errorArray.push(
							tText(
								'admin/content-block/helpers/generators/uitgeklaard___datum-is-verplicht'
							)
						);
					}

					return errorArray;
				},
			},
		},
	},
	block: {
		state: INITIAL_UITGEKLAARD_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
