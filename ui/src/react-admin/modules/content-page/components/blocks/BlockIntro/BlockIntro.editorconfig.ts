import { GET_FULL_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';
import { RICH_TEXT_EDITOR_OPTIONS_FULL_WITHOUT_ALIGN } from '~shared/consts/rich-text-editor.consts';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	IntroBlockComponentState,
} from '../../../types/content-block.types';

import { ALIGN_FIELD, BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

import { AdminConfigManager } from '~core/config';

export const INITIAL_INTRO_COMPONENTS_STATE = (): IntroBlockComponentState => ({
	title: '',
	headingType: 'h2',
	content: '',
	align: 'center',
});

export const INITIAL_INTRO_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: { top: 'top-extra-large', bottom: 'bottom-small' },
	});

export const INTRO_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/intro___intro'
	),
	type: ContentBlockType.Intro,
	components: {
		state: INITIAL_INTRO_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/intro___titel-is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/intro___titel'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			headingType: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/heading___stijl'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_FULL_HEADING_TYPE_OPTIONS(),
				},
			},
			content: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/intro___tekst-is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/defaults___tekst'
					),
					editorType: ContentBlockEditor.RICH_TEXT_EDITOR,
					editorProps: {
						controls: [...RICH_TEXT_EDITOR_OPTIONS_FULL_WITHOUT_ALIGN, 'media'],
						fileType: 'CONTENT_BLOCK_IMAGE',
					},
				}
			),
			align: ALIGN_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/intro___uitlijning'
				)
			),
		},
	},
	block: {
		state: INITIAL_INTRO_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
