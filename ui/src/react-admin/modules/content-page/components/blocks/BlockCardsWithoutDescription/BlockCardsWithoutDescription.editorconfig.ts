import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	CardWithoutDescriptionBlockComponentState,
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

import { AdminConfigManager } from '~core/config';

export const INITIAL_CARDS_WITHOUT_DESCRIPTION_COMPONENTS_STATE =
	(): CardWithoutDescriptionBlockComponentState[] => [
		{
			title: '',
			// ToDo(Silke): add image & style
		},
	];

export const INITIAL_CARDS_WITHOUT_DESCRIPTION_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS();

export const CARDS_WITHOUT_DESCRIPTION_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/cards-without-description___cards'
	),
	type: ContentBlockType.CardsWithoutDescription,
	components: {
		state: INITIAL_CARDS_WITHOUT_DESCRIPTION_COMPONENTS_STATE(),
		name: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/helpers/generators/card-withouth-description___card'
		),
		fields: {
			title: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/card-withouth-description___label-is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/card-withouth-description___label'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
		},
	},
	block: {
		state: INITIAL_CARDS_WITHOUT_DESCRIPTION_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
