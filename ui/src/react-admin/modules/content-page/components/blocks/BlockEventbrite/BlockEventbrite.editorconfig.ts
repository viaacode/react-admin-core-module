import type { BlockEventbriteProps } from '~content-blocks/BlockEventbrite/BlockEventbrite';

import { AdminConfigManager } from '~core/config/config.class';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import { tText } from '~shared/helpers/translation-functions';

import type {
	ContentBlockConfig,
	DefaultContentBlockState,
} from '../../../types/content-block.types';
import { ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types';

import { ALIGN_FIELD, BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

export const INITIAL_EVENTBRITE_COMPONENTS_STATE = (): Partial<BlockEventbriteProps> => ({
	eventId: '',
});

export const INITIAL_EVENTBRITE_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'medium',
			bottom: 'large',
		},
	}),
});

export const EVENTBRITE_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/eventbrite___eventbrite'),
	type: ContentBlockType.Eventbrite,
	components: {
		state: INITIAL_EVENTBRITE_COMPONENTS_STATE(),
		fields: {
			eventId: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/eventbrite___event-id'),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
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
			icon: {
				label: tText('admin/content-block/helpers/generators/buttons___icoon'),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
		},
	},
	block: {
		state: INITIAL_EVENTBRITE_BLOCK_STATE(),
		fields: {
			align: ALIGN_FIELD(tText('admin/content-block/helpers/generators/defaults___uitlijning')),
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
