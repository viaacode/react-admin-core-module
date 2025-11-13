import type { GridItem } from '~content-blocks/BlockImageGrid/BlockImageGrid.types';
import type { BlockImageGridWrapperProps } from '~content-blocks/BlockImageGrid/BlockImageGrid.wrapper';

import { AdminConfigManager } from '~core/config/config.class';
import { GET_ALIGN_OPTIONS } from '~modules/content-page/const/get-align-options';
import { GET_FILL_OPTIONS } from '~modules/content-page/const/get-fill-options';
import { GET_IMAGE_GRID_FORMAT_OPTIONS } from '~modules/content-page/const/get-image-grid-format-options';

import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload';
import { tText } from '~shared/helpers/translation-functions';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
	ImageGridBlockComponentStateFields,
} from '../../../types/content-block.types';
import { ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from '../defaults';

export const INITIAL_IMAGE_GRID_COMPONENTS_STATE = (): ImageGridBlockComponentStateFields[] => [
	{
		source: undefined,
		title: '',
		text: '',
		buttonLabel: '',
		buttonType: 'primary',
		buttonTitle: '',
		action: undefined,
	} as unknown as ImageGridBlockComponentStateFields,
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
		format: '16:9Small',
		fill: 'cover',
		textAlign: 'center',
	};
};

export const IMAGE_GRID_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/image-grid___afbeeldingen-grid'),
	type: ContentBlockType.ImageGrid,
	components: {
		name: tText('admin/content-block/helpers/generators/image-grid___item'),
		state: INITIAL_IMAGE_GRID_COMPONENTS_STATE(),
		fields: {
			source: FILE_FIELD(
				tText('admin/content-block/helpers/generators/image-grid___een-afbeelding-is-verplicht'),
				{
					label: tText('admin/content-block/helpers/generators/image-grid___afbeelding'),
					editorProps: {
						assetType: 'CONTENT_BLOCK_IMAGE',
						allowMulti: false,
						showDeleteButton: false,
					} as FileUploadProps,
				}
			),
			title: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/image-grid___titel'),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			text: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/image-grid___tekst'),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonLabel: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/image-grid___knop-tekst'),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonAltTitle: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/image-grid___alt-title-text'),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonTitle: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/image-grid___knop-tooltip'),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonType: {
				label: tText('admin/content-block/helpers/generators/image-grid___knop-type-kleur'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
				validator: undefined,
			},
			action: {
				label: tText('admin/content-block/helpers/generators/image-grid___link'),
				editorType: ContentBlockEditor.ContentPicker,
			},
		},
	},
	block: {
		state: INITIAL_IMAGE_GRID_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
			format: {
				label: tText('admin/content-block/helpers/generators/image-grid___formaat'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_IMAGE_GRID_FORMAT_OPTIONS(),
				},
			},
			fill: {
				label: tText('admin/content-block/helpers/generators/image-grid___zoom'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_FILL_OPTIONS(),
				},
			},
			align: {
				label: tText('admin/content-block/helpers/generators/image-grid___alignatie'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_ALIGN_OPTIONS(),
				},
			},
			textAlign: {
				label: tText('admin/content-block/helpers/generators/image-grid___text-alignatie'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_ALIGN_OPTIONS(),
				},
			},
		},
	},
});
