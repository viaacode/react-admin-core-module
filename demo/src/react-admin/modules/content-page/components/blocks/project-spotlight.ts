import { ImageInfo } from '@viaa/avo2-components';
import { times } from 'lodash-es';

import { ContentPickerProps } from '../../../shared/components/ContentPicker/ContentPicker';
import { FileUploadProps } from '../../../shared/components/FileUpload/FileUpload';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
} from '../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from './defaults';

import { AdminConfigManager } from '~core/config';

export const INITIAL_PROJECTS_SPOTLIGHT_COMPONENTS_STATE = (): ImageInfo[] =>
	times(
		3,
		() =>
			({
				image: undefined,
				title: '',
				buttonAction: undefined,
			} as any)
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
	name: AdminConfigManager.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/projects-spotlight___projecten-in-de-kijker'
	),
	type: ContentBlockType.ProjectsSpotlight,
	components: {
		name: AdminConfigManager.getConfig().services.i18n.t(
			'admin/content-block/helpers/generators/projects-spotlight___project'
		),
		limits: {
			min: 3,
			max: 3,
		},
		state: INITIAL_PROJECTS_SPOTLIGHT_COMPONENTS_STATE(),
		fields: {
			project: {
				label: AdminConfigManager.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/project-spotlight___project-pagina'
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: ['PROJECTS'],
					hideTypeDropdown: true,
				} as ContentPickerProps,
			},
			customImage: FILE_FIELD('', {
				label: AdminConfigManager.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/project-spotlight___aangepaste-afbeelding-optioneel'
				),
				editorProps: {
					assetType: 'CONTENT_BLOCK_IMAGE',
					allowMulti: false,
				} as FileUploadProps,
				validator: undefined,
			}),
			customTitle: TEXT_FIELD('', {
				label: AdminConfigManager.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/project-spotlight___aangepaste-titel-optioneel'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
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
