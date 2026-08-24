import type { TextInputProps } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import type { HetArchiefVideoBlockComponentState } from '~content-blocks/BlockHetArchiefVideo';
import { TEXT_FIELD } from '~content-blocks/defaults.ts';
import {
	type ContentBlockComponentState,
	ContentBlockEditor,
	type ContentBlockField,
	type ContentBlockState,
	type IsVisibleFunc,
	type MediaItemComponentState,
} from '~modules/content-page/types/content-block.types.ts';
import { isAudioVideoFormat } from '~shared/helpers/is-audio-video-format.ts';
import { IeObjectType } from '~shared/helpers/map-format-to-type.ts';
import { snippetTimeToSeconds } from '~shared/helpers/parsers/duration.ts';
import { tText } from '~shared/helpers/translation-functions.ts';
import { HET_ARCHIEF } from '~shared/types';
import type { PickerItem } from '~shared/types/content-picker.ts';

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
	(value: string | undefined, parentState?: ContentBlockComponentState): string[] => {
		const state = parentState as HetArchiefVideoBlockComponentState | undefined;
		const otherValue = (field === 'startTime' ? state?.endTime : state?.startTime)?.trim();
		const ownValue = (value || '').trim();

		if (!ownValue) {
			// Both fields being empty is valid: the block then plays the whole object.
			if (!otherValue) {
				return [];
			}
			return [
				field === 'startTime'
					? tText(
							'modules/content-page/helpers/snippet-time-fields___vul-ook-een-starttijd-in-of-laat-de-eindtijd-leeg',
							undefined,
							[HET_ARCHIEF]
						)
					: tText(
							'modules/content-page/helpers/snippet-time-fields___vul-ook-een-eindtijd-in-of-laat-de-starttijd-leeg',
							undefined,
							[HET_ARCHIEF]
						),
			];
		}

		const ownSeconds = snippetTimeToSeconds(ownValue);
		if (ownSeconds === null) {
			return [
				tText(
					'modules/content-page/helpers/snippet-time-fields___gebruik-het-formaat-uu-mm-ss-of-mm-ss',
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
						'modules/content-page/helpers/snippet-time-fields___de-eindtijd-moet-na-de-starttijd-liggen',
						undefined,
						[HET_ARCHIEF]
					),
				];
			}
		}

		return [];
	};

/**
 * Reads the format of the IE object picked in this form group.
 *
 * Structural on purpose: every block state that carries a picked object implements
 * MediaItemComponentState, so a new block gets the snippet time fields simply by extending it --
 * no per-block branch here. `formGroupState` is already the right object for both shapes: the
 * callers hand us the single element for repeated states (BlockTimeline nodes, BlockHeroCarousel
 * elements) and the whole component state for non repeatable blocks (BlockHetArchiefVideo).
 */
const hasMediaItem = (
	state: ContentBlockComponentState | ContentBlockState
): state is MediaItemComponentState => !!state && 'mediaItem' in state;

const getFormatFromMediaItem = (
	formGroupState: ContentBlockComponentState | ContentBlockState
): IeObjectType | undefined =>
	hasMediaItem(formGroupState)
		? (formGroupState.mediaItem?.dctermsFormat as IeObjectType | undefined)
		: undefined;

/**
 * Decides whether the snippet time fields apply to the object picked in this form group.
 *
 * The format is only known when the content picker itself reported it, so blocks that were saved
 * before the picker started storing `dctermsFormat` come back from the database with a picked
 * object but no format. Hiding the times in that case would make them reappear only after
 * reselecting the very same object, and would hide times that are already filled in. So an object
 * without a known format is treated as playable: the format is what narrows the fields away, not
 * its absence.
 */
const hasSnippetTimes = (
	formGroupState: ContentBlockComponentState | ContentBlockState
): boolean => {
	if (!hasMediaItem(formGroupState) || !formGroupState.mediaItem?.value) {
		return false;
	}

	const format = getFormatFromMediaItem(formGroupState);
	return format === undefined || isAudioVideoFormat(format);
};

const SNIPPET_TIME_FIELD = (
	field: 'startTime' | 'endTime',
	label: string,
	isVisibleFunc: IsVisibleFunc
): ContentBlockField =>
	TEXT_FIELD({
		label,
		editorType: ContentBlockEditor.TextInput,
		editorProps: {
			placeholder: tText('modules/content-page/helpers/snippet-time-fields___uu-mm-ss', undefined, [
				HET_ARCHIEF,
			]),
		} as TextInputProps,
		validator: validateSnippetTime(field),
		// The two times validate against each other, so editing one must re-check the other.
		revalidateFields: [field === 'startTime' ? 'endTime' : 'startTime'],
		isVisible: (config, formGroupState) => {
			return hasSnippetTimes(formGroupState) && isVisibleFunc(config, formGroupState);
		},
	});

export const IE_OBJECT_WITH_SNIPPET_TIME_FIELDS = (
	allowedObjectTypes: IeObjectType[] = Object.values(IeObjectType),
	isVisibleFunc: IsVisibleFunc = () => true
): Record<string, ContentBlockField> => ({
	// Named `mediaItem` on purpose: generateFieldAttributes reads `state.item ||
	// state.mediaItem` to tell the still picker below which object to fetch stills for.
	mediaItem: {
		label: tText('modules/content-page/helpers/snippet-time-fields___object', undefined, [
			HET_ARCHIEF,
		]),
		editorType: ContentBlockEditor.ContentPicker,
		editorProps: {
			allowedTypes: [AvoCoreContentPickerType.IE_OBJECT],
			hideTypeDropdown: true,
			hideTargetSwitch: true,
			// Only video and audio objects can be played
			ieObjectFormats: allowedObjectTypes,
		},
		fieldsToResetOnChange: ['startTime', 'endTime'],
		validator: (value: PickerItem | undefined) =>
			value?.value
				? []
				: [
						tText(
							'modules/content-page/helpers/snippet-time-fields___een-object-is-verplicht',
							undefined,
							[HET_ARCHIEF]
						),
					],
		isVisible: isVisibleFunc,
	},
	startTime: SNIPPET_TIME_FIELD(
		'startTime',
		tText('modules/content-page/helpers/snippet-time-fields___starttijd', undefined, [HET_ARCHIEF]),
		isVisibleFunc
	),
	endTime: SNIPPET_TIME_FIELD(
		'endTime',
		tText('modules/content-page/helpers/snippet-time-fields___eindtijd', undefined, [HET_ARCHIEF]),
		isVisibleFunc
	),
});
