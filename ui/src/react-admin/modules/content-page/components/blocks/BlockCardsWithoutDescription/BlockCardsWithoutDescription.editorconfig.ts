import { GET_CARD_WITHOUT_DESCRIPTION_STYLE_OPTIONS } from '~modules/content-page/const/get-card-without-description-style-options.js';
import {
	GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF,
	GET_BACKGROUND_COLOR_OPTIONS_AVO,
} from '~modules/content-page/const/get-color-options.js';

import type { FileUploadProps } from '~modules/shared/components/FileUpload/FileUpload.js';
import { isAvo } from '~modules/shared/helpers/is-avo.js';
import { tText } from '~shared/helpers/translation-functions.js';
import type {
	CardWithoutDescriptionBlockComponentState,
	ContentBlockConfig,
	DefaultContentBlockState,
} from '../../../types/content-block.types.js';
import { Color, ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types.js';

import {
	BACKGROUND_COLOR_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FOREGROUND_COLOR_FIELD,
	TEXT_FIELD,
} from '../defaults.js';

export const INITIAL_CARDS_WITHOUT_DESCRIPTION_COMPONENTS_STATE =
	(): CardWithoutDescriptionBlockComponentState[] => [
		{
			title: '',
			style: 'round',
			textColor: Color.White,
			backgroundColor: Color.Black,
		},
	];

export const INITIAL_CARDS_WITHOUT_DESCRIPTION_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS();

export const CARDS_WITHOUT_DESCRIPTION_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'react-admin/modules/content-page/components/blocks/block-cards-without-description/block-cards-without-description___cards'
	),
	type: ContentBlockType.CardsWithoutDescription,
	components: {
		state: INITIAL_CARDS_WITHOUT_DESCRIPTION_COMPONENTS_STATE(),
		name: tText(
			'react-admin/modules/content-page/components/blocks/block-cards-without-description/block-cards-without-description___card'
		),
		fields: {
			title: TEXT_FIELD(
				tText(
					'react-admin/modules/content-page/components/blocks/block-cards-without-description/block-cards-without-description___label-is-verplicht'
				),
				{
					label: tText(
						'react-admin/modules/content-page/components/blocks/block-cards-without-description/block-cards-without-description___label'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			image: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-cards-without-description/block-cards-without-description___image'
				),
				editorType: ContentBlockEditor.FileUpload,
				validator: undefined,
				editorProps: {
					assetType: 'CONTENT_BLOCK_IMAGE',
					allowMulti: false,
				} as FileUploadProps,
			},
			style: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-cards-without-description/block-cards-without-description___style'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_CARD_WITHOUT_DESCRIPTION_STYLE_OPTIONS(),
				},
			},
			textColor: FOREGROUND_COLOR_FIELD(
				tText(
					'react-admin/modules/content-page/components/blocks/block-cards-without-description/block-cards-without-description___tekst-kleur'
				)
			),
			backgroundColor: BACKGROUND_COLOR_FIELD(
				tText(
					'react-admin/modules/content-page/components/blocks/block-cards-without-description/block-cards-without-description___achtergrondkleur-van-de-card'
				),
				isAvo() ? GET_BACKGROUND_COLOR_OPTIONS_AVO()[1] : GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[1]
			),
			linkAction: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-cards-without-description/block-cards-without-description___tegel-link'
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: ['CONTENT_PAGE', 'INTERNAL_LINK', 'EXTERNAL_LINK', 'ANCHOR_LINK'],
				},
			},
		},
	},
	block: {
		state: INITIAL_CARDS_WITHOUT_DESCRIPTION_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
