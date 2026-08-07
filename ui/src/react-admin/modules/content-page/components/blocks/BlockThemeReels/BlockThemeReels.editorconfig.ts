import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '~content-blocks/defaults';
import { AdminConfigManager } from '~core/config';
import {
	type ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	type DefaultContentBlockState,
} from '~modules/content-page/types/content-block.types';
import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload.tsx';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts.ts';
import { PHOTO_TYPES } from '~shared/helpers/files.ts';
import { tText } from '~shared/helpers/translation-functions';
import { validateRequiredValue } from '~shared/helpers/validation';
import { HET_ARCHIEF } from '~shared/types';

const INITIAL_THEME_REELS_THEME_STATE = () => ({
	theme: '',
	image: '',
	imageAlt: '',
	imageMask: '',
	description: '',
});

export const INITIAL_THEME_REELS_COMPONENTS_STATE = () => ({
	elements: [INITIAL_THEME_REELS_THEME_STATE()],
	buttonLabel: '',
	buttonType: 'content-page-button--black',
	buttonAltTitle: '',
	buttonAction: '',
});

export const INITIAL_THEME_REELS_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS();

export const THEME_REELS_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___thema-reels',
		{},
		[HET_ARCHIEF]
	),
	type: ContentBlockType.ThemeReels,
	components: {
		state: INITIAL_THEME_REELS_COMPONENTS_STATE(),
		fields: {
			elements: {
				label: tText(
					'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___thema',
					{},
					[HET_ARCHIEF]
				),
				fields: {
					theme: {
						label: tText(
							'modules/content-page/components/blocks/block-overview-themes/block-overview-themes___thema',
							{},
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.ContentPicker,
						editorProps: {
							allowedTypes: [AvoCoreContentPickerType.IE_OBJECT_THEME],
							hideTypeDropdown: true,
							hideTargetSwitch: true,
						},
					},
					image: {
						label: tText(
							'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___afbeelding',
							{},
							[HET_ARCHIEF]
						),
						editorType: ContentBlockEditor.FileUpload,
						editorProps: {
							assetType: 'CONTENT_BLOCK_IMAGE',
							allowMulti: false,
							allowedTypes: PHOTO_TYPES,
						} as FileUploadProps,
					},
					imageAlt: TEXT_FIELD({
						label: tText(
							'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___alt-tekst-voor-de-afbeelding'
						),
						validator: undefined,
					}),
					imageMask: {
						label: tText(
							'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___masker'
						),
						editorType: ContentBlockEditor.Select,
						editorProps: {
							options: [
								{
									label: tText(
										'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___iooi',
										{},
										[HET_ARCHIEF]
									),
									value: 'IOOI',
								},
								{
									label: tText(
										'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___ioio',
										{},
										[HET_ARCHIEF]
									),
									value: 'IOIO',
								},
								{
									label: tText(
										'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___oioi',
										{},
										[HET_ARCHIEF]
									),
									value: 'OIOI',
								},
							],
						},
						validator: (value: string) =>
							validateRequiredValue(
								value,
								tText(
									'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___masker-is-verplicht',
									{},
									[HET_ARCHIEF]
								)
							),
					},
					description: TEXT_FIELD({
						label: tText(
							'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___beschrijving'
						),
						validator: (value: string) => {
							const errorArray: string[] = [];

							if (value?.length > 300) {
								errorArray.push(
									tText(
										'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___beschrijving-mag-max-300-karakters-lang-zijn',
										{},
										[HET_ARCHIEF]
									)
								);
							}

							return errorArray;
						},
					}),
				},
				type: 'fieldGroup',
				max: 10,
				repeat: {
					defaultState: INITIAL_THEME_REELS_THEME_STATE(),
					addButtonLabel: tText(
						'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___voeg-thema-toe',
						{},
						[HET_ARCHIEF]
					),
					deleteButtonLabel: tText(
						'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___verwijder-thema',
						{},
						[HET_ARCHIEF]
					),
				},
			},
			buttonLabel: TEXT_FIELD(
				{
					label: tText(
						'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___button-label',
						{},
						[HET_ARCHIEF]
					),
				},
				tText(
					'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___button-label-is-verplicht',
					{},
					[HET_ARCHIEF]
				)
			),
			buttonAltTitle: TEXT_FIELD({
				label: tText(
					'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___button-alt-title',
					{},
					[HET_ARCHIEF]
				),
			}),
			buttonType: {
				label: tText(
					'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___knop-type',
					{},
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
				validator: (value: string) =>
					validateRequiredValue(
						value,
						tText(
							'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___knop-type-is-verplicht',
							{},
							[HET_ARCHIEF]
						)
					),
			},
			buttonIcon: {
				label: tText('admin/content-block/helpers/generators/ctas___knop-icoon'),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			buttonAction: {
				label: tText(
					'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___bestemming',
					{},
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: [AvoCoreContentPickerType.CONTENT_PAGE],
					hideTypeDropdown: true,
					hideTargetSwitch: true,
				},
				validator: (value: string) =>
					validateRequiredValue(
						value,
						tText(
							'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___bestemming-is-verplicht',
							{},
							[HET_ARCHIEF]
						)
					),
			},
		},
	},
	block: {
		state: INITIAL_THEME_REELS_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
