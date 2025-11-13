import type { CheckboxProps, TextInputProps } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config/config.class';
import { GET_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import { tText } from '~shared/helpers/translation-functions';
import { validateFlowplayerVideoUrl } from '~shared/helpers/validation';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
	MediaPlayerTitleTextButtonBlockComponentState,
} from '../../../types/content-block.types';
import { ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types';
import {
	ALIGN_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	ITEM_PICKER_FIELD,
	TEXT_FIELD,
} from '../defaults';

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
	name: tText(
		'admin/content-block/helpers/generators/media-player-title-text-button___media-speler-met-titel-tekst-en-knop'
	),
	type: ContentBlockType.MediaPlayerTitleTextButton,
	components: {
		state: INITIAL_MEDIA_PLAYER_TITLE_TEXT_BUTTON_COMPONENTS_STATE(),
		fields: {
			mediaTitle: {
				label: tText(
					'admin/content-block/helpers/generators/media-player-title-text-button___video-of-audio-item-toegankelijkheidstitel'
				),
				editorType: ContentBlockEditor.TextInput,
			},
			mediaItem: ITEM_PICKER_FIELD(),
			mediaSrc: TEXT_FIELD(undefined, {
				label: tText(
					'admin/content-block/helpers/generators/media-player-title-text-button___eigen-video-url-van-flowplayer-com-optioneel'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: validateFlowplayerVideoUrl,
				editorProps: {
					placeholder: tText(
						'admin/content-block/helpers/generators/media-player-title-text-button___bv-https-cdn-flowplayer-com-hls-playlist-m-3-u-8'
					),
				} as TextInputProps,
			}),
			mediaPoster: {
				label: tText(
					'admin/content-block/helpers/generators/media-player-title-text-button___eigen-poster-uploaden-optioneel'
				),
				editorType: ContentBlockEditor.UploadOrSelectVideoStill,
			},
			showCopyright: {
				editorType: ContentBlockEditor.Checkbox,
				editorProps: {
					label: tText(
						'react-admin/modules/content-page/components/blocks/block-video-title-text-button/block-video-title-text-button___toon-auteursrecht-melding-voor-deze-poster'
					),
				} as CheckboxProps,
			},
			mediaAutoplay: {
				editorType: ContentBlockEditor.Checkbox,
				editorProps: {
					label: tText(
						'admin/content-block/helpers/generators/media-player-title-text-button___automatisch-afspelen'
					),
				} as CheckboxProps,
			},
			headingTitle: TEXT_FIELD(
				tText('admin/content-block/helpers/generators/heading___titel-is-verplicht'),
				{
					label: tText('admin/content-block/helpers/generators/heading___titel'),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			headingType: {
				label: tText('admin/content-block/helpers/generators/heading___stijl'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_HEADING_TYPE_OPTIONS(),
				},
			},
			content: TEXT_FIELD(),
			buttonType: {
				label: tText('admin/content-block/helpers/generators/ctas___knop-type'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
			},
			buttonLabel: {
				label: tText('admin/content-block/helpers/generators/ctas___knop-tekst'),
				editorType: ContentBlockEditor.TextInput,
			},
			buttonAltTitle: TEXT_FIELD(undefined, {
				label: tText(
					'admin/content-block/helpers/generators/media-player-title-text-button___alt-title-text'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonIcon: {
				label: tText('admin/content-block/helpers/generators/ctas___knop-icoon'),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			buttonAction: {
				label: tText(
					'admin/content-block/helpers/generators/media-player-title-text-button___knop-actie'
				),
				editorType: ContentBlockEditor.ContentPicker,
			},
			align: ALIGN_FIELD(tText('admin/content-block/helpers/generators/defaults___uitlijning')),
		},
	},
	block: {
		state: INITIAL_MEDIA_PLAYER_TITLE_TEXT_BUTTON_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
