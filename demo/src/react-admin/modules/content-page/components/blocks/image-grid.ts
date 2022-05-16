import { GridItem } from '@viaa/avo2-components';

import { FileUploadProps } from '../../../shared/components/FileUpload/FileUpload';
import {
	GET_ALIGN_OPTIONS,
	GET_BUTTON_TYPE_OPTIONS,
	GET_FILL_OPTIONS,
	GET_IMAGE_GRID_FORMAT_OPTIONS,
} from '../../const/content-block.consts';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	ImageGridBlockComponentStateFields,
} from '../../types/content-block.types';
import { BlockImageGridWrapperProps } from '../wrappers/ImageGridWrapper/ImageGridWrapper';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from './defaults';

import { Config } from '~core/config';

export const INITIAL_IMAGE_GRID_COMPONENTS_STATE = (): ImageGridBlockComponentStateFields[] => [
	{
		source: undefined,
		title: '',
		text: '',
		buttonLabel: '',
		buttonType: 'primary',
		buttonTitle: '',
		action: undefined,
	} as any,
];

export const INITIAL_IMAGE_GRID_BLOCK_STATE = (): BlockImageGridWrapperProps &
	DefaultContentBlockState => {
	return {
		...BLOCK_STATE_DEFAULTS({
			padding: {
				top: 'top-large',
				bottom: 'bottom',
			},
		}),
		elements: [] as GridItem[],
		format: 'squareLarge',
		fill: 'cover',
		textAlign: 'center',
	};
};

export const IMAGE_GRID_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/image-grid___afbeeldingen-grid'
	),
	type: ContentBlockType.ImageGrid,
	components: {
		name: Config.getConfig().services.i18n.t(
			'admin/content-block/helpers/generators/image-grid___item'
		),
		state: INITIAL_IMAGE_GRID_COMPONENTS_STATE(),
		fields: {
			source: FILE_FIELD(
				Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___een-afbeelding-is-verplicht'
				),
				{
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/image-grid___afbeelding'
					),
					editorProps: {
						assetType: 'CONTENT_BLOCK_IMAGE',
						allowMulti: false,
						showDeleteButton: false,
					} as FileUploadProps,
				}
			),
			title: TEXT_FIELD('', {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___titel'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			text: TEXT_FIELD('', {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___tekst'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonLabel: TEXT_FIELD('', {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___knop-tekst'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonAltTitle: TEXT_FIELD('', {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___alt-title-text'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonTitle: TEXT_FIELD('', {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___knop-tooltip'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonType: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___knop-type-kleur'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_BUTTON_TYPE_OPTIONS(),
				},
			},
			action: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___link'
				),
				editorType: ContentBlockEditor.ContentPicker,
			},
		},
	},
	block: {
		state: INITIAL_IMAGE_GRID_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
			format: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___formaat'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_IMAGE_GRID_FORMAT_OPTIONS(),
				},
			},
			fill: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___zoom'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_FILL_OPTIONS(),
				},
			},
			align: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___alignatie'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_ALIGN_OPTIONS(),
				},
			},
			textAlign: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___text-alignatie'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_ALIGN_OPTIONS(),
				},
			},
		},
	},
});
