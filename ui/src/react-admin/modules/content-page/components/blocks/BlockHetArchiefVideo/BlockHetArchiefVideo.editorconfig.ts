import type { CheckboxProps, TextInputProps } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import {
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	COPYRIGHT_FIELDS,
	COPYRIGHT_STATE,
	TEXT_FIELD,
} from '~content-blocks/defaults';
import { GET_MEDIA_PLAYER_WIDTH_OPTIONS } from '~modules/content-page/const/get-media-player-width-options';
import type {
	ContentBlockComponentState,
	ContentBlockConfig,
	ContentBlockField,
	CopyrightComponentState,
	DefaultContentBlockState,
} from '~modules/content-page/types/content-block.types';
import {
	ContentBlockEditor,
	ContentBlockType,
} from '~modules/content-page/types/content-block.types';
import { IeObjectType } from '~shared/helpers/map-format-to-type.ts';
import { snippetTimeToSeconds } from '~shared/helpers/parsers/duration';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import type { PickerItem } from '~shared/types/content-picker';

export interface HetArchiefVideoBlockComponentState extends CopyrightComponentState {
	/** The AV ie-object to play, referenced by its pid / fragmentId. */
	mediaItem?: PickerItem;
	/** Start of the snippet, as the admin types it: HH:MM:SS or MM:SS. */
	startTime?: string;
	/** End of the snippet, as the admin types it: HH:MM:SS or MM:SS. */
	endTime?: string;
	poster?: string;
	/** Accessibility title for the player. */
	title: string;
	width?: string;
	autoplay: boolean;
}

/**
 * Validates one of the two snippet time fields.
 *
 * The times are enforced as a pair: the media service only cuts when it is given an end time, so
 * a start time on its own would silently play the whole object. The proxy rejects a half pair as
 * well; this is the same rule, surfaced in the editor.
 *
 * https://meemoo.atlassian.net/browse/ARC-3832
 */
const validateSnippetTime =
	(field: 'startTime' | 'endTime') =>
	(value: string | undefined, siblingState?: ContentBlockComponentState): string[] => {
		const state = siblingState as HetArchiefVideoBlockComponentState | undefined;
		const otherValue = (field === 'startTime' ? state?.endTime : state?.startTime)?.trim();
		const ownValue = (value || '').trim();

		if (!ownValue) {
			// Both empty is valid: the block then plays the whole object.
			if (!otherValue) {
				return [];
			}
			return [
				field === 'startTime'
					? tText(
							'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___vul-ook-een-starttijd-in-of-laat-de-eindtijd-leeg',
							undefined,
							[HET_ARCHIEF]
						)
					: tText(
							'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___vul-ook-een-eindtijd-in-of-laat-de-starttijd-leeg',
							undefined,
							[HET_ARCHIEF]
						),
			];
		}

		const ownSeconds = snippetTimeToSeconds(ownValue);
		if (ownSeconds === null) {
			return [
				tText(
					'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___gebruik-het-formaat-uu-mm-ss-of-mm-ss',
					undefined,
					[HET_ARCHIEF]
				),
			];
		}

		// Only the end time reports the ordering problem, so the admin does not get the same
		// message twice on two fields.
		if (field === 'endTime') {
			const startSeconds = snippetTimeToSeconds(otherValue);
			if (startSeconds !== null && ownSeconds <= startSeconds) {
				return [
					tText(
						'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___de-eindtijd-moet-na-de-starttijd-liggen',
						undefined,
						[HET_ARCHIEF]
					),
				];
			}
		}

		return [];
	};

const SNIPPET_TIME_FIELD = (field: 'startTime' | 'endTime', label: string): ContentBlockField =>
	TEXT_FIELD({
		label,
		editorType: ContentBlockEditor.TextInput,
		editorProps: {
			placeholder: tText(
				'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___bv-00-01-30',
				undefined,
				[HET_ARCHIEF]
			),
		} as TextInputProps,
		validator: validateSnippetTime(field),
		// The two times validate against each other, so editing one must re-check the other.
		revalidateFields: [field === 'startTime' ? 'endTime' : 'startTime'],
	});

export const INITIAL_HETARCHIEF_VIDEO_COMPONENTS_STATE =
	(): HetArchiefVideoBlockComponentState => ({
		...COPYRIGHT_STATE(),
		title: '',
		startTime: '',
		endTime: '',
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
		'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___videoblok',
		undefined,
		[HET_ARCHIEF]
	),
	type: ContentBlockType.HetArchiefVideo,
	components: {
		state: INITIAL_HETARCHIEF_VIDEO_COMPONENTS_STATE(),
		fields: {
			// Named `mediaItem` on purpose: generateFieldAttributes reads `state.item ||
			// state.mediaItem` to tell the still picker below which object to fetch stills for.
			mediaItem: {
				label: tText(
					'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___object-pid-of-fragment-id',
					undefined,
					[HET_ARCHIEF]
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: [AvoCoreContentPickerType.IE_OBJECT],
					hideTypeDropdown: true,
					// Only video and audio objects can be played
					ieObjectFormats: [
						IeObjectType.video,
						IeObjectType.videofragment,
						IeObjectType.film,
						IeObjectType.audio,
						IeObjectType.audiofragment,
					],
				},
				validator: (value: PickerItem | undefined) =>
					value?.value
						? []
						: [
								tText(
									'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___een-object-is-verplicht',
									undefined,
									[HET_ARCHIEF]
								),
							],
			} as ContentBlockField,
			startTime: SNIPPET_TIME_FIELD(
				'startTime',
				tText(
					'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___starttijd',
					undefined,
					[HET_ARCHIEF]
				)
			),
			endTime: SNIPPET_TIME_FIELD(
				'endTime',
				tText(
					'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___eindtijd',
					undefined,
					[HET_ARCHIEF]
				)
			),
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
			autoplay: {
				editorType: ContentBlockEditor.Checkbox,
				editorProps: {
					label: tText(
						'modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___automatisch-afspelen',
						undefined,
						[HET_ARCHIEF]
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
