import { CheckboxProps, TextInputProps } from '@viaa/avo2-components';

import { FileUploadProps } from '../../../shared/components/FileUpload/FileUpload';
import { GET_ADMIN_ICON_OPTIONS } from '../../../shared/consts/icons.consts';
import { PHOTO_TYPES } from '../../../shared/helpers/files';
import { validateFlowplayerVideoUrl } from '../../../shared/helpers/validation';
import {
	GET_BUTTON_TYPE_OPTIONS,
	GET_HEADING_TYPE_OPTIONS,
} from '../../const/content-block.common.consts';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	MediaPlayerTitleTextButtonBlockComponentState,
} from '../../types/content-block.types';

import {
	ALIGN_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FILE_FIELD,
	ITEM_PICKER_FIELD,
	TEXT_FIELD,
} from './defaults';

import { Config } from '~core/config';

export const INITIAL_MEDIA_PLAYER_TITLE_TEXT_BUTTON_COMPONENTS_STATE =
	(): MediaPlayerTitleTextButtonBlockComponentState => ({
		mediaTitle: '',
		mediaAutoplay: false,
		headingTitle: '',
		headingType: 'h2',
		align: 'left',
		content: '',
		buttonType: 'secondary',
		buttonLabel: '',
	});

export const INITIAL_MEDIA_PLAYER_TITLE_TEXT_BUTTON_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS();

export const MEDIA_PLAYER_TITLE_TEXT_BUTTON_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/media-player-title-text-button___media-speler-met-titel-tekst-en-knop'
	),
	type: ContentBlockType.MediaPlayerTitleTextButton,
	components: {
		state: INITIAL_MEDIA_PLAYER_TITLE_TEXT_BUTTON_COMPONENTS_STATE(),
		fields: {
			mediaTitle: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/media-player-title-text-button___video-of-audio-item-toegankelijkheidstitel'
				),
				editorType: ContentBlockEditor.TextInput,
			},
			mediaItem: ITEM_PICKER_FIELD(),
			mediaSrc: TEXT_FIELD(undefined, {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/media-player-title-text-button___eigen-video-url-van-flowplayer-com-optioneel'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: validateFlowplayerVideoUrl,
				editorProps: {
					placeholder: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/media-player-title-text-button___bv-https-cdn-flowplayer-com-hls-playlist-m-3-u-8'
					),
				} as TextInputProps,
			}),
			mediaPoster: FILE_FIELD(undefined, {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/media-player-title-text-button___eigen-poster-uploaden-optioneel'
				),
				validator: undefined,
				editorProps: {
					allowMulti: false,
					allowedTypes: PHOTO_TYPES,
					assetType: 'CONTENT_BLOCK_IMAGE',
					ownerId: '',
				} as FileUploadProps,
			}),
			mediaAutoplay: {
				editorType: ContentBlockEditor.Checkbox,
				editorProps: {
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/media-player-title-text-button___automatisch-afspelen'
					),
				} as CheckboxProps,
			},
			headingTitle: TEXT_FIELD(
				Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/heading___titel-is-verplicht'
				),
				{
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/heading___titel'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			headingType: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/heading___stijl'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_HEADING_TYPE_OPTIONS(),
				},
			},
			content: TEXT_FIELD(),
			buttonType: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/ctas___knop-type'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_BUTTON_TYPE_OPTIONS(),
				},
			},
			buttonLabel: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/ctas___knop-tekst'
				),
				editorType: ContentBlockEditor.TextInput,
			},
			buttonAltTitle: TEXT_FIELD('', {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/media-player-title-text-button___alt-title-text'
				),
				editorType: ContentBlockEditor.TextInput,
			}),
			buttonIcon: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/ctas___knop-icoon'
				),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			buttonAction: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/media-player-title-text-button___knop-actie'
				),
				editorType: ContentBlockEditor.ContentPicker,
			},
			align: ALIGN_FIELD(
				Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/defaults___uitlijning'
				)
			),
		},
	},
	block: {
		state: INITIAL_MEDIA_PLAYER_TITLE_TEXT_BUTTON_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
