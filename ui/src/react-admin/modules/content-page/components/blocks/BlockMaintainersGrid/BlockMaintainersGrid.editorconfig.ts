import type { MultiRangeProps } from '@viaa/avo2-components';
import { tText } from '~shared/helpers/translation-functions';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
	MaintainersGridBlockComponentState} from '../../../types/content-block.types';
import {
	ContentBlockEditor,
	ContentBlockType
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '../defaults';

import { GET_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';

export const INITIAL_MAINTAINERS_GRID_COMPONENTS_STATE =
	(): MaintainersGridBlockComponentState => ({
		title: '',
		titleType: 'h3',
		subtitle: '',
		buttonLabel: '',
		buttonAction: undefined,
		visibleItems: 14,
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
	name: tText(
		'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___aanbieders-grid'
	),
	type: ContentBlockType.MaintainersGrid,
	components: {
		state: INITIAL_MAINTAINERS_GRID_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD(
				tText(
					'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___is-verplicht'
				),
				{
					label: tText(
						'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___titel'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			titleType: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___titel-grootte'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_HEADING_TYPE_OPTIONS(),
				},
			},
			subtitle: TEXT_FIELD(undefined, {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___subtitel'
				),
				editorType: ContentBlockEditor.TextInput,
			}),
			buttonLabel: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___link-tekst'
				),
				editorType: ContentBlockEditor.TextInput,
			},
			buttonAction: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___link-actie'
				),
				editorType: ContentBlockEditor.ContentPicker,
			},
			visibleItems: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-maintainers-grid/block-maintainers-grid___zichtbare-items'
				),
				editorType: ContentBlockEditor.MultiRange,
				editorProps: {
					min: 0,
					max: 400,
					step: 1,
					showNumber: true,
				} as MultiRangeProps,
			},
		},
	},
	block: {
		state: INITIAL_MAINTAINERS_GRID_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
