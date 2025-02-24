import { AdminConfigManager } from '~core/config';
import {
	GET_ALIGN_OPTIONS,
	GET_SIMPLE_ALIGN_OPTIONS,
} from '~modules/content-page/const/get-align-options';
import {
	GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF,
	GET_COLOR_OPTIONS_EXTENDED_AVO,
	GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF,
} from '~modules/content-page/const/get-color-options';
import {
	GET_FULL_HEADING_TYPE_OPTIONS,
	GET_HEADING_SIZE_OPTIONS,
} from '~modules/content-page/const/get-heading-type-options';
import type { FileUploadProps } from '~modules/shared/components/FileUpload/FileUpload';
import { GET_ADMIN_ICON_OPTIONS } from '~modules/shared/consts/icons.consts';
import { tText } from '~shared/helpers/translation-functions';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
	ImageTextBackgroundBlockComponentState,
} from '../../../types/content-block.types';
import { Color, ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types';

import {
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	PADDING_SINGLE_VALUE_FIELD,
	TEXT_FIELD,
} from '../defaults';
import { isAvo } from '~shared/helpers/is-avo';
import type { MultiRangeProps } from '@viaa/avo2-components';
import { PHOTO_TYPES } from '~shared/helpers/files';

export const INITIAL_AVO_IMAGE_TEXT_BACKGROUND_COMPONENTS_STATE =
	(): ImageTextBackgroundBlockComponentState => ({
		heading: '',
		headingType: isAvo() ? 'h1' : 'h3',
		headingSize: 'medium',
		content: '',
		textPadding: 'small',
		contentWidth: 60,
		contentPosition: 0,
		foregroundColor: Color.Black,
		backgroundColor: Color.TealBright,
		backgroundAlignment: isAvo() ? 'fill-screen' : 'left-inside-page',
		buttonLabel: '',
		buttonIconAlignment: 'left',
	});

export const INITIAL_AVO_IMAGE_TEXT_BACKGROUND_BLOCK_STATE = (): DefaultContentBlockState => {
	return {
		...BLOCK_STATE_DEFAULTS(),
		padding: {
			top: 'none',
			bottom: 'none',
		},
		fullWidth: true,
	};
};

export const AVO_IMAGE_TEXT_BACKGROUND_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'react-admin/modules/content-page/components/blocks/block-image-text-background/block-image-text-background___admin-content-block-helpers-image-text-background-image-text-background'
	),
	type: ContentBlockType.AvoImageTextBackground,
	components: {
		state: INITIAL_AVO_IMAGE_TEXT_BACKGROUND_COMPONENTS_STATE(),
		fields: {
			heading: TEXT_FIELD(
				tText(
					'admin/content-block/helpers/image-text-background/image-text-background___titel-is-verplicht'
				),
				{
					label: tText(
						'admin/content-block/helpers/image-text-background/image-text-background___titel-tekst'
					),
					editorType: ContentBlockEditor.TextInput,
					validator: undefined,
				}
			),
			headingType: {
				label: tText(
					'admin/content-block/helpers/image-text-background/image-text-background___titel-stijl'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: isAvo()
						? [
								{
									label: tText('admin/content-block/content-block___h-1'),
									value: 'h1',
								},
						  ]
						: GET_FULL_HEADING_TYPE_OPTIONS(),
				},
			},
			headingSize: {
				label: tText(
					'modules/content-page/components/blocks/block-image-text-background/block-image-text-background___titel-grootte'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_HEADING_SIZE_OPTIONS(),
				},
			},
			content: TEXT_FIELD(undefined, {
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			textAlign: {
				label: tText('admin/content-block/helpers/generators/image-grid___text-alignatie'),
				editorType: ContentBlockEditor.AlignSelect,
				editorProps: {
					options: GET_ALIGN_OPTIONS(),
				},
			},
			contentWidth: {
				label: tText(
					'modules/content-page/components/blocks/block-avo-image-text-background/block-avo-image-text-background___tekst-breedte'
				),
				editorType: ContentBlockEditor.MultiRange,
				editorProps: {
					showNumber: true,
					min: 0,
					max: 100,
					step: 5,
					values: [0],
				} as MultiRangeProps,
			},
			contentPosition: {
				label: tText(
					'modules/content-page/components/blocks/block-avo-image-text-background/block-avo-image-text-background___tekst-positie'
				),
				editorType: ContentBlockEditor.MultiRange,
				editorProps: {
					showNumber: true,
					min: 0,
					max: 100,
					step: 5,
					values: [0],
				} as MultiRangeProps,
			},
			foregroundColor: {
				label: tText(
					'modules/content-page/components/blocks/block-image-text-background/block-image-text-background___tekst-kleur'
				),
				editorType: ContentBlockEditor.ColorSelect,
				editorProps: {
					options: isAvo()
						? GET_COLOR_OPTIONS_EXTENDED_AVO()
						: GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF(),
					defaultValue: isAvo()
						? GET_COLOR_OPTIONS_EXTENDED_AVO()[0]
						: GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF()[0],
				},
			},
			backgroundColor: {
				label: tText(
					'modules/content-page/components/blocks/block-image-text-background/block-image-text-background___achtergrond-kleur-tekst'
				),
				editorType: ContentBlockEditor.ColorSelect,
				editorProps: {
					options: isAvo()
						? GET_COLOR_OPTIONS_EXTENDED_AVO()
						: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF(),
					defaultValue: isAvo()
						? GET_COLOR_OPTIONS_EXTENDED_AVO()[0]
						: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[0],
				},
			},
			textPadding: PADDING_SINGLE_VALUE_FIELD(
				tText(
					'modules/content-page/components/blocks/block-image-text-background/block-image-text-background___tekst-padding-achtergrondkleur'
				)
			),
			image: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/image-text-background/image-text-background___image'
				),
				editorType: ContentBlockEditor.FileUpload,
				validator: undefined,
				editorProps: {
					assetType: 'CONTENT_BLOCK_IMAGE',
					allowMulti: false,
					allowedTypes: PHOTO_TYPES,
					label: tText(
						'modules/content-page/components/blocks/block-avo-image-text-background/block-avo-image-text-background___afbeelding-1920-x-385'
					),
					imageDimensions: { width: 1920, height: 385 },
				} as FileUploadProps,
			},
			imageAttribution: {
				label: tText(
					'modules/content-page/components/blocks/block-image-text-background/block-image-text-background___bijschrift-bronvermelding'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			},
			imageAttributionText: {
				label: tText(
					'modules/content-page/components/blocks/block-image-text-background/block-image-text-background___bijschrift-beschrijving'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			},
			buttonType: {
				label: tText(
					'admin/content-block/helpers/image-text-background/image-text-background___knop-type'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
			},
			buttonLabel: {
				label: tText(
					'admin/content-block/helpers/image-text-background/image-text-background___knop-tekst'
				),
				editorType: ContentBlockEditor.TextInput,
			},
			buttonAltTitle: TEXT_FIELD(undefined, {
				label: tText(
					'admin/content-block/helpers/image-text-background/image-text-background___alt-title-text'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonAction: {
				label: tText(
					'admin/content-block/helpers/image-text-background/image-text-background___knop-actie'
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: ['CONTENT_PAGE', 'INTERNAL_LINK', 'EXTERNAL_LINK', 'ANCHOR_LINK'],
				},
			},
			buttonIcon: {
				label: tText(
					'admin/content-block/helpers/image-text-background/image-text-background___knop-icoon'
				),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			buttonIconAlignment: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/image-text-background/image-text-background___button-icon-alignment'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_SIMPLE_ALIGN_OPTIONS(),
				},
			},
		},
	},
	block: {
		state: INITIAL_AVO_IMAGE_TEXT_BACKGROUND_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
			backgroundColor: {
				label: tText(
					'modules/content-page/components/blocks/block-image-text-background/block-image-text-background___achtergrond-kleur-blok'
				),
				editorType: ContentBlockEditor.ColorSelect,
				editorProps: {
					options: isAvo()
						? GET_COLOR_OPTIONS_EXTENDED_AVO()
						: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF(),
					defaultValue: isAvo()
						? GET_COLOR_OPTIONS_EXTENDED_AVO()[0]
						: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[0],
				},
			},
		},
	},
});
