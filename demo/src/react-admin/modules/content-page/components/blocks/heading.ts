import { GET_FULL_HEADING_TYPE_OPTIONS } from '../../const/content-block.common.consts';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	HeadingBlockComponentState,
} from '../../types/content-block.types';

import {
	ALIGN_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FOREGROUND_COLOR_FIELD,
	TEXT_FIELD,
} from './defaults';

import { AdminConfigManager } from '~core/config';

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
	name: AdminConfigManager.getConfig().services.i18n.t(
		'admin/content-block/helpers/generators/heading___titel'
	),
	type: ContentBlockType.Heading,
	components: {
		state: INITIAL_HEADING_COMPONENTS_STATE(),
		fields: {
			children: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/heading___titel-is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/heading___titel'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			color: FOREGROUND_COLOR_FIELD(
				AdminConfigManager.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/heading___titel-kleur'
				)
			),
			type: {
				label: AdminConfigManager.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/heading___stijl'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_FULL_HEADING_TYPE_OPTIONS(),
				},
			},
			align: ALIGN_FIELD(
				AdminConfigManager.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/defaults___uitlijning'
				)
			),
		},
	},
	block: {
		state: INITIAL_HEADING_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
