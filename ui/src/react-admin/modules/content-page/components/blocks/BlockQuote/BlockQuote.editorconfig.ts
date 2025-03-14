import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload';
import { tText } from '~shared/helpers/translation-functions';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
	QuoteBlockComponentState,
} from '../../../types/content-block.types';
import { ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from '../defaults';

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
	name: tText('admin/content-block/helpers/generators/quote___quote'),
	type: ContentBlockType.Quote,
	components: {
		state: INITIAL_QUOTE_COMPONENTS_STATE(),
		fields: {
			quote: TEXT_FIELD(
				tText('admin/content-block/helpers/generators/quote___quote-is-verplicht'),
				{
					label: tText('admin/content-block/helpers/generators/quote___quote'),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			authorName: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/quote___auteur'),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			authorInitials: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/quote___initialen'),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			authorImage: FILE_FIELD(
				tText('admin/content-block/helpers/generators/image___een-afbeelding-is-verplicht'),
				{
					label: tText('admin/content-block/helpers/generators/image___afbeelding'),
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
