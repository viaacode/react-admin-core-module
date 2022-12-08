import { BlockHeroProps, TextInputProps } from '@viaa/avo2-components';
import { GET_HERO_BACKGROUND_COLOR_OPTIONS } from '~modules/content-page/const/get-color-options';

import { FileUploadProps } from '../../../shared/components/FileUpload/FileUpload';
import { GET_ADMIN_ICON_OPTIONS } from '../../../shared/consts/icons.consts';
import { RICH_TEXT_EDITOR_OPTIONS_FULL } from '../../../shared/consts/rich-text-editor.consts';
import { PHOTO_TYPES } from '../../../shared/helpers/files';
import { validateFlowplayerVideoUrl } from '../../../shared/helpers/validation';

import {
	Color,
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockFieldGroup,
	ContentBlockType,
	DEFAULT_BUTTON_PROPS,
	DefaultContentBlockState,
} from '../../types/content-block.types';

import {
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FILE_FIELD,
	FOREGROUND_COLOR_FIELD,
	TEXT_FIELD,
} from './defaults';

import { AdminConfigManager } from '~core/config';

export const INITIAL_HERO_COMPONENTS_STATE = (): Partial<BlockHeroProps> => ({
	title: '',
	titleColor: Color.White,
	content: '',
	contentColor: Color.White,
	altText: '',
	buttons: [],
});

export const INITIAL_HERO_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'none',
			bottom: 'none',
		},
	}),
	backgroundColor: Color.NightBlue,
});

export const HERO_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/hero___hero'
	),
	type: ContentBlockType.Hero,
	components: {
		state: INITIAL_HERO_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD('', {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/hero___titel'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			titleColor: FOREGROUND_COLOR_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/hero___titel-kleur'
				)
			),
			content: TEXT_FIELD('', {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/hero___beschrijving'
				),
				editorType: ContentBlockEditor.TextArea,
				validator: undefined,
			}),
			contentColor: FOREGROUND_COLOR_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/hero___beschrijving-kleur'
				)
			),

			buttons: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/hero___knop'
				),
				fields: {
					type: {
						label: AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-block/helpers/generators/buttons___type'
						),
						editorType: ContentBlockEditor.Select,
						editorProps: {
							options: AdminConfigManager.getConfig().components.buttonTypes(),
						},
					},
					label: TEXT_FIELD(
						AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-block/helpers/generators/buttons___knoptekst-is-verplicht'
						),
						{
							label: AdminConfigManager.getConfig().services.i18n.tText(
								'admin/content-block/helpers/generators/buttons___tekst'
							),
							editorType: ContentBlockEditor.TextInput,
						}
					),
					altTitle: TEXT_FIELD('', {
						label: AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-block/helpers/generators/hero___alt-title-text'
						),
						editorType: ContentBlockEditor.TextInput,
					}),
					icon: {
						label: AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-block/helpers/generators/buttons___icoon'
						),
						editorType: ContentBlockEditor.IconPicker,
						editorProps: {
							options: GET_ADMIN_ICON_OPTIONS(),
						},
					},
					buttonAction: {
						label: AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-block/helpers/generators/buttons___knop-actie'
						),
						editorType: ContentBlockEditor.ContentPicker,
					},
				},
				type: 'fieldGroup',
				repeat: {
					defaultState: DEFAULT_BUTTON_PROPS,
					addButtonLabel: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/rich-text-two-columns___voeg-knop-toe'
					),
					deleteButtonLabel: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/rich-text-two-columns___verwijder-knop'
					),
				},
			} as ContentBlockFieldGroup,

			textBelowButtons: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/hero___text-onder-knoppen'
				),
				editorProps: {
					controls: RICH_TEXT_EDITOR_OPTIONS_FULL,
				},
			}),
			src: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/hero___eigen-video-url-van-flowplayer-com'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: validateFlowplayerVideoUrl,
				editorProps: {
					placeholder: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/hero___bv-https-cdn-flowplayer-com-hls-playlist-m-3-u-8'
					),
				} as TextInputProps,
			}),
			poster: FILE_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/hero___eigen-poster-uploaden'
				),
				validator: undefined,
				editorProps: {
					allowMulti: false,
					allowedTypes: PHOTO_TYPES,
					assetType: 'CONTENT_BLOCK_IMAGE',
					ownerId: '',
				} as Partial<FileUploadProps>,
			}),
			altText: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/hero___alt-tekst-voor-video-afbeelding'
				),
				editorType: ContentBlockEditor.TextInput,
			}),
		},
	},
	block: {
		state: INITIAL_HERO_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
			backgroundColor: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/defaults___achtergrondkleur'
				),
				editorType: ContentBlockEditor.ColorSelect,
				editorProps: {
					options: GET_HERO_BACKGROUND_COLOR_OPTIONS(),
					defaultValue: GET_HERO_BACKGROUND_COLOR_OPTIONS()[0],
				},
			},
		},
	},
});
