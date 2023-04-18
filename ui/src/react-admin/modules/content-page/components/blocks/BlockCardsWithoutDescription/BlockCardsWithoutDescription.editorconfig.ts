import { GET_CARD_WITHOUT_DESCRIPTION_STYLE_OPTIONS } from '~modules/content-page/const/get-card-without-description-style-options';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	CardWithoutDescriptionBlockComponentState,
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

import { AdminConfigManager } from '~core/config';
import { FileUploadProps } from '~modules/shared/components/FileUpload/FileUpload';

export const INITIAL_CARDS_WITHOUT_DESCRIPTION_COMPONENTS_STATE =
	(): CardWithoutDescriptionBlockComponentState[] => [
		{
			title: '',
			style: 'round',
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
			style: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/card-withouth-description___style'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_CARD_WITHOUT_DESCRIPTION_STYLE_OPTIONS(),
				},
			},
			image: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/card-withouth-description___image'
				),
				editorType: ContentBlockEditor.FileUpload,
				validator: undefined,
				editorProps: {
					assetType: 'CONTENT_BLOCK_IMAGE',
					allowMulti: false,
				} as FileUploadProps,
			},
		},
	},
	block: {
		state: INITIAL_CARDS_WITHOUT_DESCRIPTION_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
