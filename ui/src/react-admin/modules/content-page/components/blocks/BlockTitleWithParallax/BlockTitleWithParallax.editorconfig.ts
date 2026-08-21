import type { SelectOption } from '@viaa/avo2-components';
import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, TEXT_FIELD } from '~content-blocks/defaults';
import {
	type ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	type DefaultContentBlockState,
	type TitleWithParallaxBlockComponentState,
	TitleWithParallaxVisualisationOption,
} from '~modules/content-page/types/content-block.types';
import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload.tsx';
import { PHOTO_TYPES } from '~shared/helpers/files.ts';
import { tText } from '~shared/helpers/translation-functions';
import { validateRequiredValue } from '~shared/helpers/validation.ts';
import { HET_ARCHIEF } from '~shared/types';

const GET_VISUAL_TYPE_OPTIONS = (): SelectOption<TitleWithParallaxVisualisationOption>[] => [
	{
		label: tText('Groot', {}, [HET_ARCHIEF]),
		value: TitleWithParallaxVisualisationOption.BIG,
	},
	{
		label: tText('Klein', {}, [HET_ARCHIEF]),
		value: TitleWithParallaxVisualisationOption.SMALL,
	},
];

export const INITIAL_TITLE_WITH_PARALLAX_COMPONENTS_STATE = () => ({
	title: '',
	image: '',
});

export const INITIAL_TITLE_WITH_PARALLAX_BLOCK_STATE = (): DefaultContentBlockState => ({
	...BLOCK_STATE_DEFAULTS(),
	fullWidth: true,
});

export const TITLE_WITH_PARALLAX_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('Titel met parallax'),
	type: ContentBlockType.TitleWithParallax,
	components: {
		state: INITIAL_TITLE_WITH_PARALLAX_COMPONENTS_STATE(),
		fields: {
			visualType: {
				label: tText('Visualisatie'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_VISUAL_TYPE_OPTIONS(),
				},
				// The subtitle field is only visible for 'BIG' (see its own isVisible below), so
				// clear its value whenever visualType changes - otherwise a subtitle typed while
				// on 'BIG' keeps rendering after switching to 'SMALL', just hidden from the editor.
				fieldsToResetOnChange: ['subtitle'],
			},
			title: TEXT_FIELD(
				{
					label: tText('title', undefined, [HET_ARCHIEF]),
				},
				tText('titel is verplicht', undefined, [HET_ARCHIEF])
			),
			subtitle: TEXT_FIELD({
				label: tText('subtitle', undefined, [HET_ARCHIEF]),
				isVisible: (_config, formGroupState) =>
					(formGroupState as TitleWithParallaxBlockComponentState).visualType === 'BIG',
			}),
			image: {
				label: tText('item-image', undefined, [HET_ARCHIEF]),
				editorType: ContentBlockEditor.FileUpload,
				validator: (value: string) =>
					validateRequiredValue(value, tText('afbeelding-is-verplicht', undefined, [HET_ARCHIEF])),
				editorProps: {
					assetType: 'CONTENT_BLOCK_IMAGE',
					allowMulti: false,
					allowedTypes: PHOTO_TYPES,
				} as FileUploadProps,
			},
		},
	},
	block: {
		state: INITIAL_TITLE_WITH_PARALLAX_BLOCK_STATE(),
		fields: {
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
