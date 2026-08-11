import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload';
import { tText } from '~shared/helpers/translation-functions';
import { AVO, HET_ARCHIEF } from '~shared/types';
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
	name: tText('admin/content-block/helpers/generators/quote___quote', {}, [AVO, HET_ARCHIEF]),
	type: ContentBlockType.AvoQuote,
	components: {
		state: INITIAL_AVO_QUOTE_COMPONENTS_STATE(),
		fields: {
			quote: TEXT_FIELD(
				{
					label: tText('admin/content-block/helpers/generators/quote___quote', {}, [
						AVO,
						HET_ARCHIEF,
					]),
				},
				tText('admin/content-block/helpers/generators/quote___quote-is-verplicht', {}, [
					AVO,
					HET_ARCHIEF,
				])
			),
			authorName: TEXT_FIELD({
				label: tText('admin/content-block/helpers/generators/quote___auteur', {}, [
					AVO,
					HET_ARCHIEF,
				]),
				validator: undefined,
			}),
			authorInitials: TEXT_FIELD({
				label: tText('admin/content-block/helpers/generators/quote___initialen', {}, [
					AVO,
					HET_ARCHIEF,
				]),
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
