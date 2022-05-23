import { FileUploadProps } from '../../../shared/components/FileUpload/FileUpload';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	ImageBlockComponentState,
} from '../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD } from './defaults';

import { Config } from '~core/config';
import {
	GET_ALIGN_OPTIONS,
	GET_WIDTH_OPTIONS,
} from '~modules/content-page/const/content-block.common.consts';

export const INITIAL_IMAGE_COMPONENTS_STATE = (): ImageBlockComponentState => ({
	title: '',
	text: '',
	source: '',
	width: 'full-width',
});

export const INITIAL_IMAGE_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-extra-large',
			bottom: 'bottom-extra-large',
		},
	});

export const IMAGE_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/image___afbeelding'
	),
	type: ContentBlockType.Image,
	components: {
		state: INITIAL_IMAGE_COMPONENTS_STATE(),
		fields: {
			title: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image___bijschift-titel'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			},
			text: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image___bijschrift-beschrijving'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			},
			imageSource: FILE_FIELD(
				Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image___een-afbeelding-is-verplicht'
				),
				{
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/image___afbeelding'
					),
					editorProps: { assetType: 'CONTENT_BLOCK_IMAGE' } as FileUploadProps,
				}
			),
			width: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image___breedte'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_WIDTH_OPTIONS(),
				},
			},
			align: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image___alignatie'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_ALIGN_OPTIONS(),
				},
			},
		},
	},
	block: {
		state: INITIAL_IMAGE_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
