import type { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { isHetArchief } from '../shared/helpers/is-hetarchief';
import type { ContentOverviewTableCols, MediaPlayerPathInfo } from './content-pages.types';

export const CONTENT_PAGE_COPY = 'Kopie %index%: ';
export const CONTENT_PAGE_COPY_REGEX = /^Kopie [0-9]+: /gi;

export const MEDIA_PLAYER_BLOCKS: { [blockType: string]: MediaPlayerPathInfo } = {
	MEDIA_PLAYER: {
		getItemExternalIdPath: 'variables.componentState.item.value',
		setItemExternalIdPath: 'variables.componentState.external_id',
		setVideoSrcPath: 'variables.componentState.src',
		setPosterSrcPath: 'variables.componentState.poster',
		setTitlePath: 'variables.componentState.title',
		setDescriptionPath: 'variables.componentState.description',
		setIssuedPath: 'variables.componentState.issued',
		setOrganisationPath: 'variables.componentState.organisation',
		setDurationPath: 'variables.componentState.duration',
	},
	MEDIA_PLAYER_TITLE_TEXT_BUTTON: {
		getItemExternalIdPath: 'variables.componentState.mediaItem.value',
		setItemExternalIdPath: 'variables.componentState.mediaExternalId',
		setVideoSrcPath: 'variables.componentState.mediaSrc',
		setPosterSrcPath: 'variables.componentState.mediaPoster',
		setTitlePath: 'variables.componentState.mediaTitle',
		setDescriptionPath: 'variables.componentState.mediaDescription',
		setIssuedPath: 'variables.componentState.mediaIssued',
		setOrganisationPath: 'variables.componentState.mediaOrganisation',
		setDurationPath: 'variables.componentState.mediaDuration',
	},
};

export const DEFAULT_AUDIO_STILL = '/images/audio-still.svg';

export const TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT: Partial<{
	// biome-ignore lint/suspicious/noExplicitAny: order object can be different for each property
	[columnId in ContentOverviewTableCols]: (order: AvoSearchOrderDirection) => any;
}> = {
	contentType: (order: AvoSearchOrderDirection) => {
		return { content_type: order };
	},
	createdAt: (order: AvoSearchOrderDirection) => {
		return { created_at: order };
	},
	updatedAt: (order: AvoSearchOrderDirection) => {
		return { updated_at: order };
	},
	isPublic: (order: AvoSearchOrderDirection) => {
		return { is_public: order };
	},
	publishedAt: (order: AvoSearchOrderDirection) => {
		return { published_at: order };
	},
	publishAt: (order: AvoSearchOrderDirection) => {
		return { publish_at: order };
	},
	depublishAt: (order: AvoSearchOrderDirection) => {
		return { depublish_at: order };
	},
	userGroupIds: (order: AvoSearchOrderDirection) => {
		return { user_group_ids: order };
	},
	userProfileId: (order: AvoSearchOrderDirection) => {
		if (isHetArchief()) {
			return {
				owner_profile: { first_name: order },
			};
		}
		return {
			profile: { usersByuserId: { first_name: order } },
		};
	},
	authorUserGroup: (order: AvoSearchOrderDirection) => {
		if (isHetArchief()) {
			return {
				owner_profile: { group: { name: order } },
			};
		}
		return {
			profile: { profile_user_group: { group: { label: order } } },
		};
	},
};
