import { ContentPickerType } from '~modules/shared/components/ContentPicker/ContentPicker.types';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	ThreeClickableTilesBlockComponentState,
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from '../defaults';

import { AdminConfigManager } from '~core/config';
import { FileUploadProps } from '~modules/shared/components/FileUpload/FileUpload';

export const INITIAL_THREE_CLICKABLE_TILES_COMPONENTS_STATE =
	(): ThreeClickableTilesBlockComponentState[] => [
		{
			subtitle: '',
			source: '',
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
			imgSource: FILE_FIELD(
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
			subtitle: TEXT_FIELD(
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
			link: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/three-clickable-tiles___link'
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: [
						ContentPickerType.ANCHOR_LINK,
						ContentPickerType.INTERNAL_LINK,
						ContentPickerType.EXTERNAL_LINK,
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
