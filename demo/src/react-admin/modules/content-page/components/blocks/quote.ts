import { FileUploadProps } from '../../../shared/components/FileUpload/FileUpload';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	QuoteBlockComponentState,
} from '../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from './defaults';

import { Config } from '~core/config';

export const INITIAL_QUOTE_COMPONENTS_STATE = (): QuoteBlockComponentState => ({
	quote: '',
	authorName: '',
	authorInitials: '',
});

export const INITIAL_QUOTE_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-small',
			bottom: 'bottom-small',
		},
	});

export const QUOTE_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: Config.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/quote___quote'
	),
	type: ContentBlockType.Quote,
	components: {
		state: INITIAL_QUOTE_COMPONENTS_STATE(),
		fields: {
			quote: TEXT_FIELD(
				Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/quote___quote-is-verplicht'
				),
				{
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/quote___quote'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			authorName: TEXT_FIELD(
				undefined,
				{
				 label: Config.getConfig().services.i18n.t(
				  'admin/content-block/helpers/generators/quote___auteur'
				 ),
				 editorType: ContentBlockEditor.TextInput,
				 validator: undefined,
				}
			   ),
			   authorInitials: TEXT_FIELD(
				undefined,
				{
				 label: Config.getConfig().services.i18n.t(
				  'admin/content-block/helpers/generators/quote___initialen'
				 ),
				 editorType: ContentBlockEditor.TextInput,
				 validator: undefined,
				}
			),
			authorImage: FILE_FIELD(
				Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/image___een-afbeelding-is-verplicht'
				),
				{
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/image___afbeelding'
					),
					editorProps: { assetType: 'CONTENT_BLOCK_IMAGE' } as FileUploadProps,
				}
			),
		},
	},
	block: {
		state: INITIAL_QUOTE_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
