import type { CheckboxProps, TextInputProps } from '@viaa/avo2-components';
import { GET_MEDIA_PLAYER_WIDTH_OPTIONS } from '~modules/content-page/const/get-media-player-width-options';

import { tText } from '~shared/helpers/translation-functions';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
	HetArchiefVideoBlockComponentState,
} from '../../../types/content-block.types';
import { ContentBlockEditor, ContentBlockType } from '../../../types/content-block.types';

import {
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	ITEM_PICKER_FIELD,
	TEXT_FIELD,
} from '../defaults';

function validateFragmentTime(value: string | undefined): string[] {
	if (!value) {
		return [];
	}
	if (!/^[0-9]+$/.test(value)) {
		return [
			tText(
				'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___de-tijd-moet-een-getal-in-seconden-zijn'
			),
		];
	}
	return [];
}

export const INITIAL_HETARCHIEF_VIDEO_COMPONENTS_STATE =
	(): HetArchiefVideoBlockComponentState => ({
		title: '',
		autoplay: false,
	});

export const INITIAL_HETARCHIEF_VIDEO_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-extra-large',
			bottom: 'bottom-extra-large',
		},
	});

export const HETARCHIEF_VIDEO_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText(
		'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___video'
	),
	type: ContentBlockType.HetArchiefVideo,
	components: {
		state: INITIAL_HETARCHIEF_VIDEO_COMPONENTS_STATE(),
		fields: {
			title: TEXT_FIELD({
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___toegankelijkheidstitel'
				),
				validator: undefined,
			}),
			item: ITEM_PICKER_FIELD(undefined, {
				validator: undefined,
			}),
			startTime: TEXT_FIELD({
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___starttijd-in-seconden'
				),
				editorProps: {
					placeholder: tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___bv-10'
					),
				} as TextInputProps,
				validator: validateFragmentTime,
			}),
			endTime: TEXT_FIELD({
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___eindtijd-in-seconden'
				),
				editorProps: {
					placeholder: tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___bv-20'
					),
				} as TextInputProps,
				validator: validateFragmentTime,
			}),
			poster: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___poster'
				),
				editorType: ContentBlockEditor.UploadOrSelectVideoStill,
			},
			showCopyright: {
				editorType: ContentBlockEditor.Checkbox,
				editorProps: {
					label: tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___toon-auteursrecht-melding-voor-deze-poster'
					),
				} as CheckboxProps,
			},
			annotationTitle: TEXT_FIELD({
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___bijschift-titel'
				),
				validator: undefined,
			}),
			annotationText: TEXT_FIELD({
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___bijschrift-beschrijving'
				),
				validator: undefined,
			}),
			width: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___breedte'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_MEDIA_PLAYER_WIDTH_OPTIONS(),
				},
			},
			autoplay: {
				editorType: ContentBlockEditor.Checkbox,
				editorProps: {
					label: tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___automatisch-afspelen'
					),
				} as CheckboxProps,
			},
		},
	},
	block: {
		state: INITIAL_HETARCHIEF_VIDEO_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
