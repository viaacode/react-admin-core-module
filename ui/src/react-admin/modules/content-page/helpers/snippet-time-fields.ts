import { ConfigFn } from '@testing-library/react';
import type { TextInputProps } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import type { HeroCarouselBlockComponentState } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import type { HetArchiefVideoBlockComponentState } from '~content-blocks/BlockHetArchiefVideo';
import { TIMELINE_BLOCK_CONFIG } from '~content-blocks/BlockTimeline';
import { TEXT_FIELD } from '~content-blocks/defaults.ts';
import {
	type ContentBlockComponentState,
	type ContentBlockConfig,
	ContentBlockEditor,
	type ContentBlockField,
	type ContentBlockState,
	ContentBlockType,
	type TimelineNodeBlockComponentState,
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

const getFormatFromMediaItem = (
	config: ContentBlockConfig,
	formGroupState: ContentBlockComponentState | ContentBlockState
): IeObjectType | undefined => {
	if (config.type === ContentBlockType.HetArchiefVideo) {
		return (config.components.state as HetArchiefVideoBlockComponentState).mediaItem
			?.dctermsFormat as IeObjectType;
	}
	if (config.type === ContentBlockType.HeroCarousel) {
		return (formGroupState as HeroCarouselBlockComponentState).mediaItem
			?.dctermsFormat as IeObjectType;
	}
	if (config.type === ContentBlockType.Timeline) {
		return (formGroupState as TimelineNodeBlockComponentState).mediaItem
			?.dctermsFormat as IeObjectType;
	}
	return undefined;
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
		isVisible: (config, formGroupState) =>
			isAudioVideoFormat(getFormatFromMediaItem(config, formGroupState)),
	});

export const IE_OBJECT_WITH_SNIPPET_TIME_FIELDS = (
	allowedObjectTypes: IeObjectType[] = Object.values(IeObjectType),
	isVisibleFunc: (
		config: ContentBlockConfig,
		formGroupState: ContentBlockComponentState | ContentBlockState
	) => boolean = () => true
): Record<string, ContentBlockField> => ({
	// Named `mediaItem` on purpose: generateFieldAttributes reads `state.item ||
	// state.mediaItem` to tell the still picker below which object to fetch stills for.
	mediaItem: {
		label: tText('Object', undefined, [HET_ARCHIEF]),
		editorType: ContentBlockEditor.ContentPicker,
		editorProps: {
			allowedTypes: [AvoCoreContentPickerType.IE_OBJECT],
			hideTypeDropdown: true,
			hideTargetSwitch: true,
			// Only video and audio objects can be played
			ieObjectFormats: allowedObjectTypes,
		},
		fieldsToResetOnChange: ['startPoint', 'endPoint'],
		validator: (value: PickerItem | undefined) =>
			value?.value ? [] : [tText('Een object is verplicht', undefined, [HET_ARCHIEF])],
		isVisible: isVisibleFunc,
	},
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
});
