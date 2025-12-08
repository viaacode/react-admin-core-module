import { AdminConfigManager } from '~core/config/config.class';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import { tText } from '~shared/helpers/translation-functions';

import type {
	ButtonsBlockComponentState,
	ContentBlockConfig,
	DefaultContentBlockState,
} from '../../../types/content-block.types';
import { ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types';

import { ALIGN_FIELD, BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

export const INITIAL_BUTTONS_COMPONENTS_STATE = (): ButtonsBlockComponentState[] => [
	{
		label: '',
		type: 'primary',
	},
];

export const INITIAL_BUTTONS_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'none',
			bottom: 'bottom-extra-large',
		},
	});

export const BUTTONS_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/buttons___knoppen'),
	type: ContentBlockType.Buttons,
	components: {
		name: tText('admin/content-block/helpers/generators/buttons___knop'),
		limits: {
			max: 3,
		},
		state: INITIAL_BUTTONS_COMPONENTS_STATE(),
		fields: {
			type: {
				label: tText('admin/content-block/helpers/generators/buttons___type'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
			},
			label: TEXT_FIELD(
				tText('admin/content-block/helpers/generators/buttons___knoptekst-is-verplicht'),
				{
					label: tText('admin/content-block/helpers/generators/buttons___tekst'),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			altTitle: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/buttons___alt-title-text'),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			icon: {
				label: tText('admin/content-block/helpers/generators/buttons___icoon'),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			buttonAction: {
				label: tText('admin/content-block/helpers/generators/buttons___knop-actie'),
				editorType: ContentBlockEditor.ContentPicker,
			},
		},
	},
	block: {
		state: INITIAL_BUTTONS_BLOCK_STATE(),
		fields: {
			align: ALIGN_FIELD(tText('admin/content-block/helpers/generators/defaults___uitlijning')),
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
