import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload';
import { tText } from '~shared/helpers/translation-functions';
import type {
	AvoQuoteBlockComponentState,
	ContentBlockConfig,
	DefaultContentBlockState,
} from '../../../types/content-block.types';
import { ContentBlockType } from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from '../defaults';

export const INITIAL_AVO_QUOTE_COMPONENTS_STATE = (): AvoQuoteBlockComponentState => ({
	quote: '',
	authorName: '',
	authorInitials: '',
});

export const INITIAL_AVO_QUOTE_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-small',
			bottom: 'bottom-small',
		},
	});

export const AVO_QUOTE_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/quote___quote'),
	type: ContentBlockType.AvoQuote,
	components: {
		state: INITIAL_AVO_QUOTE_COMPONENTS_STATE(),
		fields: {
			quote: TEXT_FIELD(
				{
					label: tText('admin/content-block/helpers/generators/quote___quote'),
				},
				tText('admin/content-block/helpers/generators/quote___quote-is-verplicht')
			),
			authorName: TEXT_FIELD({
				label: tText('admin/content-block/helpers/generators/quote___auteur'),
				validator: undefined,
			}),
			authorInitials: TEXT_FIELD({
				label: tText('admin/content-block/helpers/generators/quote___initialen'),
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
		state: INITIAL_AVO_QUOTE_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
