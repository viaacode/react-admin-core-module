import { GET_UNDERLINED_LINK_BUTTON_TYPE_OPTIONS } from '../../const/content-block.consts';
import {
	AnchorLinksBlockComponentState,
	AnchorLinksBlockState,
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
} from '../../types/content-block.types';

import { ALIGN_FIELD, BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from './defaults';

import { i18n } from 'modules/admin/shared/helpers/i18n';

export const INITIAL_ANCHOR_LINKS_COMPONENTS_STATE = (): AnchorLinksBlockComponentState[] => [
	{
		label: '',
		type: 'underlined-link',
	},
];

export const INITIAL_ANCHOR_LINKS_BLOCK_STATE = (): AnchorLinksBlockState => ({
	...BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top',
			bottom: 'bottom',
		},
	}),
	align: 'center',
	hasDividers: true,
});

export const ANCHOR_LINKS_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: i18n.t('admin/content-block/helpers/generators/anchor-links___links'),
	type: ContentBlockType.AnchorLinks,
	components: {
		name: i18n.t('admin/content-block/helpers/generators/anchor-links___link'),
		state: INITIAL_ANCHOR_LINKS_COMPONENTS_STATE(),
		fields: {
			label: TEXT_FIELD(
				i18n.t('admin/content-block/helpers/generators/buttons___knoptekst-is-verplicht'),
				{
					label: i18n.t('admin/content-block/helpers/generators/buttons___tekst'),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			type: {
				label: i18n.t('admin/content-block/helpers/generators/anchor-links___kleur'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_UNDERLINED_LINK_BUTTON_TYPE_OPTIONS(),
				},
			},
			buttonAction: {
				label: i18n.t('admin/content-block/helpers/generators/anchor-links___link'),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: ['ANCHOR_LINK'],
					hideTargetSwitch: true,
					hideTypeDropdown: true,
				},
			},
		},
	},
	block: {
		state: INITIAL_ANCHOR_LINKS_BLOCK_STATE(),
		fields: {
			align: ALIGN_FIELD(),
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
