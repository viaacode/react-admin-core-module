import type { MultiRangeProps } from "@viaa/avo2-components";
import type { GridItem } from "~content-blocks/BlockImageGrid/BlockImageGrid.types";
import type { BlockLogoGridWrapperProps } from "~content-blocks/BlockImageGrid/BlockLogoGrid.wrapper";
import { GET_ALIGN_OPTIONS } from "~modules/content-page/const/get-align-options";
import { GET_FILL_OPTIONS } from "~modules/content-page/const/get-fill-options";
import { GET_IMAGE_GRID_FORMAT_OPTIONS } from "~modules/content-page/const/get-image-grid-format-options";

import type { FileUploadProps } from "~shared/components/FileUpload/FileUpload";
import { tText } from "~shared/helpers/translation-functions";
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
	ImageGridBlockComponentStateFields,
} from "../../../types/content-block.types";
import {
	ContentBlockEditor,
	ContentBlockType,
} from "../../../types/content-block.types";

import {
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FILE_FIELD,
	TEXT_FIELD,
} from "../defaults";

export const INITIAL_LOGO_GRID_COMPONENTS_STATE =
	(): ImageGridBlockComponentStateFields[] => [
		{
			source: undefined,
			title: "",
			text: "",
			action: undefined,
		} as unknown as ImageGridBlockComponentStateFields,
	];

export const INITIAL_LOGO_GRID_BLOCK_STATE = (): BlockLogoGridWrapperProps &
	DefaultContentBlockState => {
	return {
		...BLOCK_STATE_DEFAULTS({
			padding: {
				top: "top-large",
				bottom: "bottom",
			},
		}),
		elements: [] as GridItem[],
		format: "2:1",
		fill: "cover",
		textAlign: "center",
		itemWidth: "40rem",
	};
};

export const LOGO_GRID_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		"admin/content-block/helpers/generators/logo-grid___logos-sign-off",
	),
	type: ContentBlockType.LogoGrid,
	components: {
		name: tText("admin/content-block/helpers/generators/image-grid___item"),
		state: INITIAL_LOGO_GRID_COMPONENTS_STATE(),
		fields: {
			textAbove: TEXT_FIELD(undefined, {
				label: tText(
					"admin/content-block/helpers/generators/logo-grid___tekst-boven-afbeelding",
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			source: FILE_FIELD(
				tText(
					"admin/content-block/helpers/generators/image-grid___een-afbeelding-is-verplicht",
				),
				{
					label: tText(
						"admin/content-block/helpers/generators/image-grid___afbeelding",
					),
					editorProps: {
						assetType: "CONTENT_BLOCK_IMAGE",
						allowMulti: false,
						showDeleteButton: false,
					} as FileUploadProps,
				},
			),
			action: {
				label: tText(
					"admin/content-block/helpers/generators/image-grid___link",
				),
				editorType: ContentBlockEditor.ContentPicker,
			},
		},
	},

	block: {
		state: INITIAL_LOGO_GRID_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
			format: {
				label: tText(
					"admin/content-block/helpers/generators/image-grid___formaat",
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_IMAGE_GRID_FORMAT_OPTIONS(),
				},
			},
			itemWidth: {
				label: tText(
					"admin/content-block/helpers/generators/logo-grid___kolom-breedte",
				),
				editorType: ContentBlockEditor.MultiRange,
				editorProps: {
					min: 0,
					max: 500,
					step: 1,
					showNumber: true,
				} as MultiRangeProps,
			},
			fill: {
				label: tText(
					"admin/content-block/helpers/generators/image-grid___zoom",
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_FILL_OPTIONS(),
				},
			},
			align: {
				label: tText(
					"admin/content-block/helpers/generators/image-grid___alignatie",
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_ALIGN_OPTIONS(),
				},
			},
			textAlign: {
				label: tText(
					"admin/content-block/helpers/generators/image-grid___text-alignatie",
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_ALIGN_OPTIONS(),
				},
			},
		},
	},
});
