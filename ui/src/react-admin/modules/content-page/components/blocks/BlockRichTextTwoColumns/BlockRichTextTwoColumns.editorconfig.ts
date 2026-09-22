import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { ColumnType } from '~content-blocks/BlockRichTextTwoColumns/BlockRichTextTwoColumns.types.ts';
import { AdminConfigManager } from '~core/config/config.class';
import {
	GET_ALIGN_OPTIONS,
	GET_SIMPLE_ALIGN_OPTIONS,
} from '~modules/content-page/const/get-align-options';
import { isAvo } from '~modules/shared/helpers/is-avo';
import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import { RICH_TEXT_EDITOR_OPTIONS_FULL } from '~shared/consts/rich-text-editor.consts';
import { tText } from '~shared/helpers/translation-functions';
import type {
	ContentBlockConfig,
	ContentBlockField,
	ContentBlockFieldGroup,
	DefaultContentBlockState,
	RichTextTwoColumnsBlockComponentState,
} from '../../../types/content-block.types';
import {
	ContentBlockEditor,
	ContentBlockType,
	DEFAULT_BUTTON_PROPS,
} from '../../../types/content-block.types';
import {
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	COPYRIGHT_FIELDS,
	COPYRIGHT_STATE,
	FILE_FIELD,
	TEXT_FIELD,
} from '../defaults';

const GET_RICH_TEXT_COLUMN_TYPE_OPTIONS: () => {
	label: string;
	value: ColumnType;
}[] = () => [
	{
		label: tText('admin/content-block/helpers/generators/rich-text-two-columns___tekst'),
		value: ColumnType.TEXT,
	},
	{
		label: tText('admin/content-block/helpers/generators/rich-text-two-columns___afbeelding'),
		value: ColumnType.IMAGE,
	},
];

// Columns saved before the image option existed have no columnType, so they render as text
const columnIsText: ContentBlockField['isVisible'] = (_config, formGroupState) =>
	(formGroupState as RichTextTwoColumnsBlockComponentState).columnType !== ColumnType.IMAGE;

const columnIsImage: ContentBlockField['isVisible'] = (_config, formGroupState) =>
	(formGroupState as RichTextTwoColumnsBlockComponentState).columnType === ColumnType.IMAGE;

const INITIAL_RICH_TEXT_TWO_COLUMNS_COLUMN_STATE = (): RichTextTwoColumnsBlockComponentState => ({
	columnType: ColumnType.TEXT,
	content: '',
	...COPYRIGHT_STATE(),
	buttons: [],
	imageSource: '',
	imageAlt: '',
	imageAction: undefined,
	imageAlign: 'center',
});

export const INITIAL_RICH_TEXT_TWO_COLUMNS_COMPONENTS_STATE =
	(): RichTextTwoColumnsBlockComponentState[] => [
		INITIAL_RICH_TEXT_TWO_COLUMNS_COLUMN_STATE(),
		INITIAL_RICH_TEXT_TWO_COLUMNS_COLUMN_STATE(),
	];

export const INITIAL_RICH_TEXT_TWO_COLUMNS_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-small',
			bottom: 'bottom-small',
		},
	});

export const RICH_TEXT_TWO_COLUMNS_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/rich-text-two-columns___tekst-2-kolommen'),
	type: ContentBlockType.RichTextTwoColumns,
	components: {
		name: tText('admin/content-block/helpers/generators/rich-text-two-columns___kolom'),
		limits: {
			min: 2,
			max: 2,
		},
		state: INITIAL_RICH_TEXT_TWO_COLUMNS_COMPONENTS_STATE(),
		fields: {
			columnType: {
				label: tText('admin/content-block/helpers/generators/rich-text-two-columns___type-kolom'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_RICH_TEXT_COLUMN_TYPE_OPTIONS(),
				},
			},
			content: TEXT_FIELD(
				{
					editorType: ContentBlockEditor.RICH_TEXT_EDITOR,
					editorProps: {
						controls: [...RICH_TEXT_EDITOR_OPTIONS_FULL, 'media'],
						fileType: 'CONTENT_BLOCK_IMAGE',
					},
					isVisible: columnIsText,
				},
				tText('admin/content-block/helpers/generators/rich-text-two-columns___tekst-is-verplicht')
			),
			imageSource: FILE_FIELD(
				tText(
					'admin/content-block/helpers/generators/rich-text-two-columns___een-afbeelding-is-verplicht'
				),
				{
					label: tText('admin/content-block/helpers/generators/rich-text-two-columns___afbeelding'),
					editorProps: {
						assetType: 'CONTENT_BLOCK_IMAGE',
						allowMulti: false,
						showDeleteButton: true,
					} as FileUploadProps,
					isVisible: columnIsImage,
				}
			),
			imageAlt: TEXT_FIELD({
				label: tText(
					'admin/content-block/helpers/generators/rich-text-two-columns___alt-tekst-voor-de-afbeelding'
				),
				validator: undefined,
				isVisible: columnIsImage,
			}),
			imageAction: {
				label: tText(
					'admin/content-block/helpers/generators/rich-text-two-columns___link-achter-de-afbeelding'
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					...(!isAvo() && {
						allowedTypes: ['CONTENT_PAGE', 'INTERNAL_LINK', 'EXTERNAL_LINK', 'ANCHOR_LINK'],
					}),
					defaultType: AvoCoreContentPickerType.EXTERNAL_LINK,
				},
				isVisible: columnIsImage,
			},
			imageAlign: {
				label: tText(
					'admin/content-block/helpers/generators/rich-text-two-columns___alignatie-afbeelding'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_ALIGN_OPTIONS(),
				},
				isVisible: columnIsImage,
			},
			...COPYRIGHT_FIELDS({
				title: { overrides: { isVisible: columnIsImage } },
				showIcon: { overrides: { isVisible: columnIsImage } },
				text: { overrides: { isVisible: columnIsImage } },
			}),
			buttons: {
				label: tText('admin/content-block/helpers/generators/rich-text-two-columns___knop'),
				fields: {
					type: {
						label: tText('admin/content-block/helpers/generators/buttons___type'),
						editorType: ContentBlockEditor.Select,
						editorProps: {
							options: AdminConfigManager.getConfig().components.buttonTypes(),
						},
					},
					label: TEXT_FIELD(
						{
							label: tText('admin/content-block/helpers/generators/buttons___tekst'),
						},
						tText('admin/content-block/helpers/generators/buttons___knoptekst-is-verplicht')
					),
					altTitle: TEXT_FIELD({
						label: tText(
							'admin/content-block/helpers/generators/rich-text-two-columns___alt-title-text'
						),
						validator: undefined,
					}),
					icon: {
						label: tText('admin/content-block/helpers/generators/buttons___icoon'),
						editorType: ContentBlockEditor.IconPicker,
						editorProps: {
							options: GET_ADMIN_ICON_OPTIONS(),
						},
					},
					buttonIconAlignment: {
						label: tText(
							'react-admin/modules/content-page/components/blocks/image-text-background/image-text-background___button-icon-alignment'
						),
						editorType: ContentBlockEditor.Select,
						editorProps: {
							options: GET_SIMPLE_ALIGN_OPTIONS(),
						},
					},
					buttonAction: {
						label: tText('admin/content-block/helpers/generators/buttons___knop-actie'),
						editorType: ContentBlockEditor.ContentPicker,
						...(!isAvo() && {
							editorProps: {
								allowedTypes: ['CONTENT_PAGE', 'INTERNAL_LINK', 'EXTERNAL_LINK', 'ANCHOR_LINK'],
							},
						}),
					},
				},
				type: 'fieldGroup',
				min: 0,
				max: 10,
				repeat: {
					defaultState: DEFAULT_BUTTON_PROPS,
					addButtonLabel: tText(
						'admin/content-block/helpers/generators/rich-text-two-columns___voeg-knop-toe'
					),
					deleteButtonLabel: tText(
						'admin/content-block/helpers/generators/rich-text-two-columns___verwijder-knop'
					),
				},
			} as ContentBlockFieldGroup,
		},
	},
	block: {
		state: INITIAL_RICH_TEXT_TWO_COLUMNS_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
