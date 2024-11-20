import type { TextInputProps } from '@viaa/avo2-components';
import { noop } from 'lodash-es';
import type { BlockAvoHeroProps } from '~content-blocks/BlockAvoHero/BlockAvoHero';
import { GET_AVO_HERO_BACKGROUND_COLOR_OPTIONS } from '~modules/content-page/const/get-color-options';

import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import { RICH_TEXT_EDITOR_OPTIONS_FULL } from '~shared/consts/rich-text-editor.consts';
import { PHOTO_TYPES } from '~shared/helpers/files';
import { tText } from '~shared/helpers/translation-functions';
import { validateFlowplayerVideoUrl } from '~shared/helpers/validation';

import type {
	ContentBlockConfig,
	ContentBlockFieldGroup,
	DefaultContentBlockState,
} from '../../../types/content-block.types';
import {
	Color,
	ContentBlockEditor,
	ContentBlockType,
	DEFAULT_BUTTON_PROPS,
} from '../../../types/content-block.types';

import {
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FILE_FIELD,
	FOREGROUND_COLOR_FIELD,
	TEXT_FIELD,
} from '../defaults';

import { AdminConfigManager } from '~core/config';
import { AVO } from '~shared/types';

export const INITIAL_AVO_HERO_COMPONENTS_STATE = (): Partial<BlockAvoHeroProps> => ({
	title: '',
	titleColor: Color.White,
	content: '',
	contentColor: Color.White,
	altText: '',
	buttons: [],
});

export const INITIAL_AVO_HERO_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'none',
			bottom: 'none',
		},
	}),
	backgroundColor: Color.NightBlue,
});

export const AVO_HERO_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/hero___hero', {}, [AVO]),
	type: ContentBlockType.AvoHero,
	components: {
		state: INITIAL_AVO_HERO_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/hero___titel', {}, [AVO]),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			titleColor: FOREGROUND_COLOR_FIELD(
				tText('admin/content-block/helpers/generators/hero___titel-kleur', {}, [AVO])
			),
			content: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/hero___beschrijving', {}, [
					AVO,
				]),
				editorType: ContentBlockEditor.TextArea,
				validator: undefined,
			}),
			contentColor: FOREGROUND_COLOR_FIELD(
				tText('admin/content-block/helpers/generators/hero___beschrijving-kleur', {}, [AVO])
			),

			buttons: {
				label: tText('admin/content-block/helpers/generators/hero___knop', {}, [AVO]),
				fields: {
					type: {
						label: tText('admin/content-block/helpers/generators/buttons___type', {}, [
							AVO,
						]),
						editorType: ContentBlockEditor.Select,
						editorProps: {
							options: AdminConfigManager.getConfig().components.buttonTypes(),
						},
					},
					label: TEXT_FIELD(
						tText(
							'admin/content-block/helpers/generators/buttons___knoptekst-is-verplicht',
							{},
							[AVO]
						),
						{
							label: tText(
								'admin/content-block/helpers/generators/buttons___tekst',
								{},
								[AVO]
							),
							editorType: ContentBlockEditor.TextInput,
						}
					),
					altTitle: TEXT_FIELD(undefined, {
						label: tText(
							'admin/content-block/helpers/generators/hero___alt-title-text'
						),
						editorType: ContentBlockEditor.TextInput,
						validator: undefined,
					}),
					icon: {
						label: tText('admin/content-block/helpers/generators/buttons___icoon', {}, [
							AVO,
						]),
						editorType: ContentBlockEditor.IconPicker,
						editorProps: {
							options: GET_ADMIN_ICON_OPTIONS(),
						},
					},
					buttonAction: {
						label: tText(
							'admin/content-block/helpers/generators/buttons___knop-actie',
							{},
							[AVO]
						),
						editorType: ContentBlockEditor.ContentPicker,
					},
				},
				type: 'fieldGroup',
				repeat: {
					defaultState: DEFAULT_BUTTON_PROPS,
					addButtonLabel: tText(
						'admin/content-block/helpers/generators/rich-text-two-columns___voeg-knop-toe',
						{},
						[AVO]
					),
					deleteButtonLabel: tText(
						'admin/content-block/helpers/generators/rich-text-two-columns___verwijder-knop',
						{},
						[AVO]
					),
				},
			} as ContentBlockFieldGroup,

			textBelowButtons: TEXT_FIELD(undefined, {
				label: tText(
					'admin/content-block/helpers/generators/hero___text-onder-knoppen',
					{},
					[AVO]
				),
				editorProps: {
					controls: RICH_TEXT_EDITOR_OPTIONS_FULL,
				},
				validator: undefined,
			}),
			src: TEXT_FIELD(undefined, {
				label: tText(
					'admin/content-block/helpers/generators/hero___eigen-video-url-van-flowplayer-com',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.TextInput,
				validator: validateFlowplayerVideoUrl,
				editorProps: {
					placeholder: tText(
						'admin/content-block/helpers/generators/hero___bv-https-cdn-flowplayer-com-hls-playlist-m-3-u-8',
						{},
						[AVO]
					),
				} as TextInputProps,
			}),
			poster: FILE_FIELD(undefined, {
				label: tText(
					'admin/content-block/helpers/generators/hero___eigen-poster-uploaden',
					{},
					[AVO]
				),
				validator: undefined,
				editorProps: {
					allowMulti: false,
					allowedTypes: PHOTO_TYPES,
					assetType: 'CONTENT_BLOCK_IMAGE',
					ownerId: '',
					onDeleteFile: noop, // images will be deleted from the assets service when the user saves the content page
				} as Partial<FileUploadProps>,
			}),
			altText: TEXT_FIELD(undefined, {
				label: tText(
					'admin/content-block/helpers/generators/hero___alt-tekst-voor-video-afbeelding',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
		},
	},
	block: {
		state: INITIAL_AVO_HERO_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
			backgroundColor: {
				label: tText(
					'admin/content-block/helpers/generators/defaults___achtergrondkleur',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.ColorSelect,
				editorProps: {
					options: GET_AVO_HERO_BACKGROUND_COLOR_OPTIONS(),
					defaultValue: GET_AVO_HERO_BACKGROUND_COLOR_OPTIONS()[0],
				},
			},
		},
	},
});
