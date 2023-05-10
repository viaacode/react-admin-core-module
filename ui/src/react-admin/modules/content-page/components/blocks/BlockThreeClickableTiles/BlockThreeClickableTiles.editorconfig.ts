import { ContentPickerType } from '~modules/shared/components/ContentPicker/ContentPicker.types';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	ThreeClickableTilesBlockComponentState,
} from '../../../types/content-block.types';
import { GET_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from '../defaults';

import { AdminConfigManager } from '~core/config';
import { FileUploadProps } from '~modules/shared/components/FileUpload/FileUpload';

export const INITIAL_THREE_CLICKABLE_TILES_COMPONENTS_STATE =
	(): ThreeClickableTilesBlockComponentState[] => [
		{
			title: '',
			image: '',
			titleType: 'h4',
		},
	];

export const INITIAL_THREE_CLICKABLE_TILES_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS();

export const THREE_CLICKABLE_TILES_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/three-clickable-tiles___three-clickable-tiles'
	),
	type: ContentBlockType.ThreeClickableTiles,
	components: {
		name: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/helpers/generators/three-clickable-tiles___clickable-tile'
		),
		limits: {
			min: 1,
			max: 3,
		},
		state: INITIAL_THREE_CLICKABLE_TILES_COMPONENTS_STATE(),
		fields: {
			image: FILE_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/three-clickable-tiles___afbeelding-is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/three-clickable-tiles___afbeelding'
					),
					editorProps: { assetType: 'CONTENT_BLOCK_IMAGE' } as FileUploadProps,
				}
			),
			title: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/three-clickable-tiles___subtitel-is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/three-clickable-tiles___subtitel'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			titleType: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/heading___type'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_HEADING_TYPE_OPTIONS(),
				},
			},
			link: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/three-clickable-tiles___link'
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: [
						ContentPickerType.CONTENT_PAGE,
						ContentPickerType.INTERNAL_LINK,
						ContentPickerType.EXTERNAL_LINK,
						ContentPickerType.ANCHOR_LINK,
					],
				},
			},
		},
	},
	block: {
		state: INITIAL_THREE_CLICKABLE_TILES_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
