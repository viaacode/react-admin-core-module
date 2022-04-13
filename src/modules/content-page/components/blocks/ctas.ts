import { CTAProps } from '@viaa/avo2-components';

import { GET_ADMIN_ICON_OPTIONS } from '../../../shared/consts/icons.consts';
import {
	GET_BACKGROUND_COLOR_OPTIONS,
	GET_BUTTON_TYPE_OPTIONS,
	GET_HEADING_TYPE_OPTIONS,
} from '../../const/content-block.consts';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
} from '../../types/content-block.types';

import {
	BACKGROUND_COLOR_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FOREGROUND_COLOR_FIELD,
	TEXT_FIELD,
} from './defaults';

import { Config } from '~core/config';

const EMPTY_CTA: Partial<CTAProps> = {
	headingType: 'h2',
	heading: '',
	content: '',
	buttonType: 'secondary',
	buttonLabel: '',
};

export const INITIAL_CTAS_COMPONENTS_STATE = (): Partial<CTAProps>[] => [EMPTY_CTA, EMPTY_CTA];

export const INITIAL_CTAS_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-large',
			bottom: 'bottom-small',
		},
	});

export const CTAS_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: Config.getConfig().services.i18n.t('admin/content-block/helpers/generators/ctas___ctas'),
	type: ContentBlockType.CTAs,
	components: {
		name: Config.getConfig().services.i18n.t(
			'admin/content-block/helpers/generators/ctas___cta'
		),
		limits: {
			min: 1,
			max: 2,
		},
		state: INITIAL_CTAS_COMPONENTS_STATE(),
		fields: {
			headingType: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/ctas___titel-stijl'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_HEADING_TYPE_OPTIONS(),
				},
			},
			heading: TEXT_FIELD(
				Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/ctas___titel-is-verplicht'
				),
				{
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/ctas___titel-tekst'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			headingColor: FOREGROUND_COLOR_FIELD(
				Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/ctas___titel-kleur'
				)
			),
			content: TEXT_FIELD(),
			contentColor: FOREGROUND_COLOR_FIELD(
				Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/ctas___tekst-kleur'
				)
			),
			buttonType: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/ctas___knop-type'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_BUTTON_TYPE_OPTIONS(),
				},
			},
			buttonLabel: TEXT_FIELD(
				Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/ctas___knoptekst-is-verplicht'
				),
				{
					label: Config.getConfig().services.i18n.t(
						'admin/content-block/helpers/generators/ctas___knop-tekst'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			buttonAltTitle: TEXT_FIELD('', {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/ctas___alt-button-text'
				),
				editorType: ContentBlockEditor.TextInput,
			}),
			buttonIcon: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/ctas___knop-icoon'
				),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			buttonAction: {
				label: Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/ctas___knop-actie'
				),
				editorType: ContentBlockEditor.ContentPicker,
			},
			backgroundColor: BACKGROUND_COLOR_FIELD(
				Config.getConfig().services.i18n.t(
					'admin/content-block/helpers/generators/ctas___achtergrond-kleur'
				),
				GET_BACKGROUND_COLOR_OPTIONS()[1]
			),
		},
	},
	block: {
		state: INITIAL_CTAS_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});