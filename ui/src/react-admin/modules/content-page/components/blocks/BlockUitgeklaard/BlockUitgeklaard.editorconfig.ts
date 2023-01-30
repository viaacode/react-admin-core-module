import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockField,
	ContentBlockType,
	DefaultContentBlockState,
	KlaarBlockComponentState,
} from '~modules/content-page/types/content-block.types';
import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

import { AdminConfigManager } from '~core/config';
import { isEmpty, isNil } from 'lodash-es';
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
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/uitgeklaard___uitgeklaard'
	),
	type: ContentBlockType.Uitgeklaard,
	components: {
		name: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/helpers/generators/uitgeklaard___uitgeklaard-titel'
		),
		limits: {
			max: 3,
		},
		state: INITIAL_UITGEKLAARD_COMPONENTS_STATE(),
		fields: {
			titles: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/uitgeklaard___titel-is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/uitgeklaard___titel'
					),
					editorType: ContentBlockEditor.TextInput,
					repeat: {
						defaultState: '',
						addButtonLabel: AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-block/helpers/generators/uitgeklaard___voeg-titel-toe'
						),
						deleteButtonLabel: AdminConfigManager.getConfig().services.i18n.tText(
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

					if (isNil(value) || isEmpty(value)) {
						errorArray.push(
							AdminConfigManager.getConfig().services.i18n.tText(
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
