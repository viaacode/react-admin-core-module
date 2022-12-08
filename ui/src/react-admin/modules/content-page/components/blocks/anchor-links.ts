import { GET_UNDERLINED_LINK_BUTTON_TYPE_OPTIONS } from '../../const/get-underline-link-button-type-options';
import {
	AnchorLinksBlockComponentState,
	AnchorLinksBlockState,
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
} from '../../types/content-block.types';

import { ALIGN_FIELD, BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from './defaults';

import { AdminConfigManager } from '~core/config';

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
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/anchor-links___links'
	),
	type: ContentBlockType.AnchorLinks,
	components: {
		name: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/helpers/generators/anchor-links___link'
		),
		state: INITIAL_ANCHOR_LINKS_COMPONENTS_STATE(),
		fields: {
			label: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/buttons___knoptekst-is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/buttons___tekst'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			type: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/anchor-links___kleur'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_UNDERLINED_LINK_BUTTON_TYPE_OPTIONS(),
				},
			},
			buttonAction: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/anchor-links___link'
				),
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
			align: ALIGN_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/defaults___uitlijning'
				)
			),
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
