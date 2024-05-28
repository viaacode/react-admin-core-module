import { times } from 'lodash-es';
import { ImageInfo } from '~content-blocks/BlockSpotlight/BlockSpotlight';

import { ContentPickerProps } from '~shared/components/ContentPicker/ContentPicker';
import { FileUploadProps } from '~shared/components/FileUpload/FileUpload';
import { tText } from '~shared/helpers/translation-functions';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from '../defaults';

export const INITIAL_PROJECTS_SPOTLIGHT_COMPONENTS_STATE = (): ImageInfo[] =>
	times(
		3,
		() =>
			({
				image: undefined,
				title: '',
				buttonAction: undefined,
			}) as any
	);

export const INITIAL_PROJECTS_SPOTLIGHT_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-small',
			bottom: 'bottom-extra-large',
		},
	});

export const PROJECTS_SPOTLIGHT_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'admin/content-block/helpers/generators/projects-spotlight___projecten-in-de-kijker'
	),
	type: ContentBlockType.ProjectsSpotlight,
	components: {
		name: tText('admin/content-block/helpers/generators/projects-spotlight___project'),
		limits: {
			min: 3,
			max: 3,
		},
		state: INITIAL_PROJECTS_SPOTLIGHT_COMPONENTS_STATE(),
		fields: {
			project: {
				label: tText(
					'admin/content-block/helpers/generators/project-spotlight___project-pagina'
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: ['PROJECTS'],
					hideTypeDropdown: true,
				} as ContentPickerProps,
			},
			customImage: FILE_FIELD('', {
				label: tText(
					'admin/content-block/helpers/generators/project-spotlight___aangepaste-afbeelding-optioneel'
				),
				editorProps: {
					assetType: 'CONTENT_BLOCK_IMAGE',
					allowMulti: false,
				} as FileUploadProps,
			}),
			customTitle: TEXT_FIELD(undefined, {
				label: tText(
					'admin/content-block/helpers/generators/project-spotlight___aangepaste-titel-optioneel'
				),
				editorType: ContentBlockEditor.TextInput,
			}),
		},
	},
	block: {
		state: INITIAL_PROJECTS_SPOTLIGHT_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
