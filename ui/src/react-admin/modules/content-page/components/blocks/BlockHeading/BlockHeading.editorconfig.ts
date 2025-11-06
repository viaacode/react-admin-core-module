import { GET_FULL_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options.js';
import { tText } from '~shared/helpers/translation-functions.js';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
	HeadingBlockComponentState,
} from '../../../types/content-block.types.js';
import { ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types.js';

import {
	ALIGN_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FOREGROUND_COLOR_FIELD,
	TEXT_FIELD,
} from '../defaults.js';

export const INITIAL_HEADING_COMPONENTS_STATE = (): HeadingBlockComponentState => ({
	children: '',
	type: 'h2',
	align: 'center',
});

export const INITIAL_HEADING_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-extra-large',
			bottom: 'bottom-small',
		},
	});

export const HEADING_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/heading___titel'),
	type: ContentBlockType.Heading,
	components: {
		state: INITIAL_HEADING_COMPONENTS_STATE(),
		fields: {
			children: TEXT_FIELD(
				tText('admin/content-block/helpers/generators/heading___titel-is-verplicht'),
				{
					label: tText('admin/content-block/helpers/generators/heading___titel'),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			color: FOREGROUND_COLOR_FIELD(
				tText('admin/content-block/helpers/generators/heading___titel-kleur')
			),
			type: {
				label: tText('admin/content-block/helpers/generators/heading___stijl'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_FULL_HEADING_TYPE_OPTIONS(),
				},
			},
			align: ALIGN_FIELD(tText('admin/content-block/helpers/generators/defaults___uitlijning')),
		},
	},
	block: {
		state: INITIAL_HEADING_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
