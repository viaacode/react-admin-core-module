import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockFieldGroup,
	ContentBlockType,
	DEFAULT_BUTTON_PROPS,
	DefaultContentBlockState,
	MaintainersGridBlockComponentState,
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from '../defaults';

import { AdminConfigManager } from '~core/config';
import { GET_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';

export const INITIAL_MAINTAINERS_GRID_COMPONENTS_STATE =
	(): MaintainersGridBlockComponentState => ({
		title: '',
		titleType: 'h3',
		subtitle: '',
		buttonLabel: '',
		buttonAction: undefined,
		maintainers: [
			{
				imageSrc: undefined,
				linkAction: undefined,
			},
		],
	});

export const INITIAL_MAINTAINERS_GRID_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS();

export const MAINTAINERS_GRID_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___aanbieders-grid'
	),
	type: ContentBlockType.MaintainersGrid,
	components: {
		state: INITIAL_MAINTAINERS_GRID_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___titel'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			titleType: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___titel-grootte'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_HEADING_TYPE_OPTIONS(),
				},
			},
			subtitle: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___subtitel'
				),
				editorType: ContentBlockEditor.TextInput,
			}),
			buttonLabel: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___link-tekst'
				),
				editorType: ContentBlockEditor.TextInput,
			},
			buttonAction: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___link-actie'
				),
				editorType: ContentBlockEditor.ContentPicker,
			},
			maintainers: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___aanbieders'
				),
				fields: {
					imageSrc: FILE_FIELD(
						AdminConfigManager.getConfig().services.i18n.tText(
							'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___een-aanbieder-logo-is-verplicht'
						),
						{
							label: AdminConfigManager.getConfig().services.i18n.tText(
								'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___logo'
							),
							editorType: ContentBlockEditor.FileUpload,
						}
					),
					linkAction: {
						label: AdminConfigManager.getConfig().services.i18n.tText(
							'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___logo-link'
						),
						editorType: ContentBlockEditor.ContentPicker,
					},
				},
				type: 'fieldGroup',
				repeat: {
					defaultState: DEFAULT_BUTTON_PROPS,
					addButtonLabel: AdminConfigManager.getConfig().services.i18n.tText(
						'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___voeg-aanbieder-toe'
					),
					deleteButtonLabel: AdminConfigManager.getConfig().services.i18n.tText(
						'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___verwijder-aanbieder'
					),
				},
			} as ContentBlockFieldGroup,
		},
	},
	block: {
		state: INITIAL_MAINTAINERS_GRID_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
