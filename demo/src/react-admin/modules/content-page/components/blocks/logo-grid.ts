import { GridItem, MultiRangeProps } from '@viaa/avo2-components';

import { FileUploadProps } from '../../../shared/components/FileUpload/FileUpload';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	ImageGridBlockComponentStateFields,
} from '../../types/content-block.types';
import { BlockLogoGridWrapperProps } from '../wrappers/LogoGridWrapper/LogoGridWrapper';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from './defaults';

import { Config } from '~core/config';
import {
	GET_ALIGN_OPTIONS,
	GET_FILL_OPTIONS,
	GET_IMAGE_GRID_FORMAT_OPTIONS,
} from '~modules/content-page/const/content-block.common.consts';

export const INITIAL_LOGO_GRID_COMPONENTS_STATE = (): ImageGridBlockComponentStateFields[] => [
	{
		source: undefined,
		title: '',
		text: '',
		action: undefined,
	} as any,
];

export const INITIAL_LOGO_GRID_BLOCK_STATE = (): BlockLogoGridWrapperProps &
	DefaultContentBlockState => {
	return {
		...BLOCK_STATE_DEFAULTS({
			padding: {
				top: 'top-large',
				bottom: 'bottom',
			},
		}),
		elements: [] as GridItem[],
		format: '2:1',
		fill: 'cover',
		textAlign: 'center',
		itemWidth: 400,
	};
};

export const LOGO_GRID_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/logo-grid___logos-sign-off'
	),
	type: ContentBlockType.LogoGrid,
	components: {
		name: Config.getConfig().services.i18n.t(
			'admin/content-block/helpers/generators/image-grid___item'
		),
		state: INITIAL_LOGO_GRID_COMPONENTS_STATE(),
		fields: {
			textAbove: TEXT_FIELD('', {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/logo-grid___tekst-boven-afbeelding'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
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
			action: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image-grid___link'
				),
				editorType: ContentBlockEditor.ContentPicker,
			},
		},
	},

	block: {
		state: INITIAL_LOGO_GRID_BLOCK_STATE(),
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
			itemWidth: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/logo-grid___kolom-breedte'
				),
				editorType: ContentBlockEditor.MultiRange,
				editorProps: {
					min: 0,
					max: 500,
					step: 1,
					showNumber: true,
				} as MultiRangeProps,
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
