import { AVO } from '~modules/shared';
import { tText } from '~shared/helpers/translation-functions';

import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockField,
	ContentBlockType,
	DefaultContentBlockState,
	KlaarBlockComponentState,
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

export const INITIAL_KLAAR_COMPONENTS_STATE = (): KlaarBlockComponentState => ({
	titles: [''],
	date: '',
});

export const INITIAL_KLAAR_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'none',
			bottom: 'none',
		},
	});

export const KLAAR_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/klaar___klaar', {}, [AVO]),
	type: ContentBlockType.Klaar,
	components: {
		name: tText('admin/content-block/helpers/generators/klaar___klaar-titel', {}, [AVO]),
		limits: {
			max: 3,
		},
		state: INITIAL_KLAAR_COMPONENTS_STATE(),
		fields: {
			titles: TEXT_FIELD(
				tText('admin/content-block/helpers/generators/klaar___titel-is-verplicht', {}, [
					AVO,
				]),
				{
					label: tText('admin/content-block/helpers/generators/klaar___titel', {}, [AVO]),
					editorType: ContentBlockEditor.TextInput,
					repeat: {
						defaultState: '',
						addButtonLabel: tText(
							'admin/content-block/helpers/generators/klaar___voeg-titel-toe',
							{},
							[AVO]
						),
						deleteButtonLabel: tText(
							'admin/content-block/helpers/generators/klaar___verwijder-titel',
							{},
							[AVO]
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
								'admin/content-block/helpers/generators/klaar___datum-is-verplicht',
								{},
								[AVO]
							)
						);
					}

					return errorArray;
				},
			},
		},
	},
	block: {
		state: INITIAL_KLAAR_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
