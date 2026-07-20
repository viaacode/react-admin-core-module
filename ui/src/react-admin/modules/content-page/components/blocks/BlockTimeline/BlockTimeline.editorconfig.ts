import type { CheckboxProps, SelectOption } from '@viaa/avo2-components';
import { GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF } from '~modules/content-page/const/get-color-options';
import { GET_TIMELINE_SORT_ORDER_OPTIONS } from '~modules/content-page/const/get-timeline-sort-order-options';
import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import type {
	ContentBlockConfig,
	ContentBlockField,
	TimelineBlockState,
	TimelineNodeBlockComponentState,
	TimelineNodeVisualType,
} from '../../../types/content-block.types';
import { Color, ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from '../defaults';

const GET_TIMELINE_NODE_VISUAL_TYPE_OPTIONS = (): SelectOption<TimelineNodeVisualType>[] => [
	{
		label: tText(
			'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___geen',
			{},
			[HET_ARCHIEF]
		),
		value: 'NONE',
	},
	{
		label: tText(
			'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___object',
			{},
			[HET_ARCHIEF]
		),
		value: 'OBJECT',
	},
	{
		label: tText(
			'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___afbeelding',
			{},
			[HET_ARCHIEF]
		),
		value: 'IMAGE',
	},
];

const visualTypeIsObject: ContentBlockField['isVisible'] = (_config, formGroupState) =>
	(formGroupState as TimelineNodeBlockComponentState).visualType === 'OBJECT';

const visualTypeIsImage: ContentBlockField['isVisible'] = (_config, formGroupState) =>
	(formGroupState as TimelineNodeBlockComponentState).visualType === 'IMAGE';

export const INITIAL_TIMELINE_COMPONENTS_STATE = (): TimelineNodeBlockComponentState[] => [
	{
		date: '',
		title: '',
		text: '',
		visualType: 'NONE',
		mediaItem: undefined,
		image: undefined,
		imageAlt: '',
		imageCaptionCopyright: '',
		imageCaptionCopyrightIconVisible: true,
		imageCaptionDescription: '',
		backgroundColor: Color.Transparent,
	},
];

export const INITIAL_TIMELINE_BLOCK_STATE = (): TimelineBlockState => ({
	...BLOCK_STATE_DEFAULTS(),
	sortOrder: 'date__desc',
});

export const TIMELINE_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___tijdslijn',
		{},
		[HET_ARCHIEF]
	),
	type: ContentBlockType.Timeline,
	components: {
		name: tText(
			'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___node',
			{},
			[HET_ARCHIEF]
		),
		state: INITIAL_TIMELINE_COMPONENTS_STATE(),
		fields: {
			date: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___datum',
					{},
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.DatePicker,
				validator: (value: string) =>
					value
						? []
						: [
								tText(
									'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___datum-is-verplicht',
									{},
									[HET_ARCHIEF]
								),
							],
			},
			title: TEXT_FIELD(
				{
					label: tText(
						'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___titel',
						{},
						[HET_ARCHIEF]
					),
				},
				tText(
					'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___titel-is-verplicht',
					{},
					[HET_ARCHIEF]
				)
			),
			text: TEXT_FIELD({
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___tekst',
					{},
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.RICH_TEXT_EDITOR,
				validator: undefined,
			}),
			visualType: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___visuele-elementen',
					{},
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_TIMELINE_NODE_VISUAL_TYPE_OPTIONS(),
				},
				validator: (value: string) =>
					value
						? []
						: [
								tText(
									'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___keuze-van-visuele-elementen-is-verplicht',
									{},
									[HET_ARCHIEF]
								),
							],
			},
			mediaItem: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___object-audio-video-of-krant',
					{},
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: ['IE_OBJECT'],
					hideTargetSwitch: true,
				},
				isVisible: visualTypeIsObject,
				validator: (value: unknown) =>
					value
						? []
						: [
								tText(
									'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___selecteren-van-een-object-is-verplicht',
									{},
									[HET_ARCHIEF]
								),
							],
			},
			image: FILE_FIELD(
				tText(
					'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___een-afbeelding-is-verplicht',
					{},
					[HET_ARCHIEF]
				),
				{
					label: tText(
						'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___afbeelding',
						{},
						[HET_ARCHIEF]
					),
					editorProps: {
						assetType: 'CONTENT_BLOCK_IMAGE',
						allowMulti: false,
						showDeleteButton: true,
					} as FileUploadProps,
					isVisible: visualTypeIsImage,
				}
			),
			imageAlt: TEXT_FIELD({
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___alternatieve-tekst-afbeelding',
					{},
					[HET_ARCHIEF]
				),
				validator: undefined,
				isVisible: visualTypeIsImage,
			}),
			imageCaptionCopyright: TEXT_FIELD({
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___bijschrift-copyright',
					{},
					[HET_ARCHIEF]
				),
				validator: undefined,
				isVisible: visualTypeIsImage,
			}),
			imageCaptionCopyrightIconVisible: {
				editorType: ContentBlockEditor.Checkbox,
				editorProps: {
					label: tText(
						'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___copyright-icoon-toevoegen',
						{},
						[HET_ARCHIEF]
					),
				} as CheckboxProps,
				isVisible: visualTypeIsImage,
			},
			imageCaptionDescription: TEXT_FIELD({
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___bijschrift-beschrijving',
					{},
					[HET_ARCHIEF]
				),
				validator: undefined,
				isVisible: visualTypeIsImage,
			}),
			backgroundColor: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___achtergrondkleur-van-de-node',
					{},
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.ColorSelect,
				editorProps: {
					options: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF(),
					defaultValue: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[0],
				},
			},
		},
	},
	block: {
		state: INITIAL_TIMELINE_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
			sortOrder: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___sortering',
					{},
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_TIMELINE_SORT_ORDER_OPTIONS(),
				},
			},
		},
	},
});
