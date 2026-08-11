import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '~content-blocks/defaults';
import { GET_ALIGN_OPTIONS } from '~modules/content-page/const/get-align-options.ts';
import { GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF } from '~modules/content-page/const/get-color-options.ts';
import {
	Color,
	type ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	type DefaultContentBlockState,
} from '~modules/content-page/types/content-block.types';
import { RICH_TEXT_EDITOR_OPTIONS_FULL } from '~shared/consts/rich-text-editor.consts.ts';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';

export const INITIAL_CONTENT_HOMEPAGE_BANNER_COMPONENTS_STATE = () => ({
	title: '',
	content: '',
	textAlign: 'left',
	backgroundColor: Color.Transparent,
	bannerColor: Color.OceanGreen,
});

export const INITIAL_CONTENT_HOMEPAGE_BANNER_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS(),
	fullWidth: true,
});

export const CONTENT_HOMEPAGE_BANNER_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'modules/content-page/components/blocks/block-homepage-banner/block-homepage-banner___homepage-banner'
	),
	type: ContentBlockType.HomepageBanner,
	components: {
		state: INITIAL_CONTENT_HOMEPAGE_BANNER_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(
				{
					label: tText(
						'modules/content-page/components/blocks/block-homepage-banner/block-homepage-banner___title',
						undefined,
						[HET_ARCHIEF]
					),
				},
				tText(
					'modules/content-page/components/blocks/block-homepage-banner/block-homepage-banner___titel-is-verplicht',
					undefined,
					[HET_ARCHIEF]
				)
			),
			content: TEXT_FIELD({
				editorType: ContentBlockEditor.RICH_TEXT_EDITOR,
				editorProps: {
					controls: RICH_TEXT_EDITOR_OPTIONS_FULL,
				},
				validator: undefined,
			}),
			textAlign: {
				label: tText(
					'modules/content-page/components/blocks/block-homepage-banner/block-homepage-banner___text-alignatie',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_ALIGN_OPTIONS(),
				},
			},
			bannerColor: {
				label: tText(
					'modules/content-page/components/blocks/block-homepage-banner/block-homepage-banner___kleur-banner',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.ColorSelect,
				editorProps: {
					options: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF(),
					defaultValue: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[2],
				},
			},
		},
	},
	block: {
		state: INITIAL_CONTENT_HOMEPAGE_BANNER_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
