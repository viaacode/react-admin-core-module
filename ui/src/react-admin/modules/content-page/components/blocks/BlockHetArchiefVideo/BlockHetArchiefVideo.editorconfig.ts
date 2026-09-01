import {
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	COPYRIGHT_FIELDS,
	COPYRIGHT_STATE,
	TEXT_FIELD,
} from '~content-blocks/defaults';
import { GET_MEDIA_PLAYER_WIDTH_OPTIONS } from '~modules/content-page/const/get-media-player-width-options';
import { IE_OBJECT_WITH_SNIPPET_TIME_FIELDS } from '~modules/content-page/helpers/snippet-time-fields.ts';
import type {
	ContentBlockConfig,
	CopyrightComponentState,
	DefaultContentBlockState,
	MediaItemComponentState,
} from '~modules/content-page/types/content-block.types';
import {
	ContentBlockEditor,
	ContentBlockType,
} from '~modules/content-page/types/content-block.types';
import { IeObjectType } from '~shared/helpers/map-format-to-type.ts';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';

export interface HetArchiefVideoBlockComponentState
	extends CopyrightComponentState,
		MediaItemComponentState {
	/** Start of the snippet, as the admin types it: HH:MM:SS or MM:SS. */
	startTime?: string;
	/** End of the snippet, as the admin types it: HH:MM:SS or MM:SS. */
	endTime?: string;
	poster?: string;
	/** Accessibility title for the player. */
	title: string;
	width?: string;
}

export const INITIAL_HETARCHIEF_VIDEO_COMPONENTS_STATE =
	(): HetArchiefVideoBlockComponentState => ({
		...COPYRIGHT_STATE(),
		title: '',
		startTime: '',
		endTime: '',
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
		'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___videoblok',
		undefined,
		[HET_ARCHIEF]
	),
	type: ContentBlockType.HetArchiefVideo,
	components: {
		state: INITIAL_HETARCHIEF_VIDEO_COMPONENTS_STATE(),
		fields: {
			...IE_OBJECT_WITH_SNIPPET_TIME_FIELDS([
				IeObjectType.VIDEO,
				IeObjectType.VIDEO_FRAGMENT,
				IeObjectType.FILM,
				IeObjectType.AUDIO,
				IeObjectType.AUDIO_FRAGMENT,
			]),
			poster: {
				label: tText(
					'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___thumbnail',
					undefined,
					[HET_ARCHIEF]
				),
				note: tHtml(
					'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___kies-een-still-uit-het-fragment-of-laad-een-eigen-afbeelding-op',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.UploadOrSelectVideoStill,
			},
			// "Bijschrift: titel", the copyright icon checkbox and "Bijschrift: beschrijving",
			// shown underneath the player. Same fields as the "Afbeelding" block.
			...COPYRIGHT_FIELDS(),
			title: TEXT_FIELD({
				label: tText(
					'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___toegankelijkheidstitel',
					undefined,
					[HET_ARCHIEF]
				),
				validator: undefined,
			}),
			width: {
				label: tText(
					'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___breedte',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_MEDIA_PLAYER_WIDTH_OPTIONS(),
				},
			},
		},
	},
	block: {
		state: INITIAL_HETARCHIEF_VIDEO_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
