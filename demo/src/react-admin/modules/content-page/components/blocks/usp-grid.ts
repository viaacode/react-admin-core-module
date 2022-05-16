import { GridItem } from '@viaa/avo2-components';

import { FileUploadProps } from '../../../shared/components/FileUpload/FileUpload';
import { GET_ALIGN_OPTIONS, GET_BUTTON_TYPE_OPTIONS } from '../../const/content-block.consts';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	ImageGridBlockComponentStateFields,
} from '../../types/content-block.types';
import { BlockUspGridWrapperProps } from '../wrappers/UspGridWrapper/UspGridWrapper';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from './defaults';

import { Config } from '~core/config';

export const INITIAL_USP_GRID_COMPONENTS_STATE = (): ImageGridBlockComponentStateFields[] => [
	{
		source: undefined,
		title: '',
		text: '',
		action: undefined,
	} as any,
];

export const INITIAL_USP_GRID_BLOCK_STATE = (): BlockUspGridWrapperProps &
	DefaultContentBlockState => {
	return {
		...BLOCK_STATE_DEFAULTS({
			padding: {
				top: 'top-large',
				bottom: 'bottom',
			},
		}),
		elements: [] as GridItem[],
		textAlign: 'center',
	};
};

export const USP_GRID_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/usp-grid___usp'
	),
	type: ContentBlockType.UspGrid,
	components: {
		name: Config.getConfig().services.i18n.t(
			'admin/content-block/helpers/generators/image-grid___item'
		),
		state: INITIAL_USP_GRID_COMPONENTS_STATE(),
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
			buttonAltTitle: TEXT_FIELD('', {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/usp-grid___alt-title-text'
				),
				editorType: ContentBlockEditor.TextInput,
			}),
			action: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___link'
				),
				editorType: ContentBlockEditor.ContentPicker,
			},
		},
	},

	block: {
		state: INITIAL_USP_GRID_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
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
