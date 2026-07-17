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
	name: tText('Homepage banner'),
	type: ContentBlockType.HomepageBanner,
	components: {
		state: INITIAL_CONTENT_HOMEPAGE_BANNER_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(
				{
					label: tText('title', undefined, [HET_ARCHIEF]),
				},
				tText('titel is verplicht')
			),
			content: TEXT_FIELD({
				editorType: ContentBlockEditor.RICH_TEXT_EDITOR,
				editorProps: {
					controls: RICH_TEXT_EDITOR_OPTIONS_FULL,
				},
				validator: undefined,
			}),
			textAlign: {
				label: tText('admin/content-block/helpers/generators/image-grid___text-alignatie'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_ALIGN_OPTIONS(),
				},
			},
			bannerColor: {
				label: tText('Kleur banner'),
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
