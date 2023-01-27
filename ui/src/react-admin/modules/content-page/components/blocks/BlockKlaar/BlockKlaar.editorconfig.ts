import { isEmpty, isNil } from 'lodash-es';

import { AdminConfigManager } from '~core/config';
import { AVO } from '~modules/shared';

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
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/klaar___klaar',
		{},
		[AVO]
	),
	type: ContentBlockType.Klaar,
	components: {
		name: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/helpers/generators/klaar___klaar-titel',
			{},
			[AVO]
		),
		limits: {
			max: 3,
		},
		state: INITIAL_KLAAR_COMPONENTS_STATE(),
		fields: {
			titles: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/klaar___titel-is-verplicht',
					{},
					[AVO]
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/klaar___titel',
						{},
						[AVO]
					),
					editorType: ContentBlockEditor.TextInput,
					repeat: {
						defaultState: '',
						addButtonLabel: AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-block/helpers/generators/klaar___voeg-titel-toe',
							{},
							[AVO]
						),
						deleteButtonLabel: AdminConfigManager.getConfig().services.i18n.tText(
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

					if (isNil(value) || isEmpty(value)) {
						errorArray.push(
							AdminConfigManager.getConfig().services.i18n.tText(
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
