import { Avo } from '@viaa/avo2-types';
import { AvoOrHetArchief } from '../shared/types';
import {
	ContentOverviewTableCols,
	MediaPlayerPathInfo,
} from './content-pages.types';

export const MEDIA_PLAYER_BLOCKS: { [blockType: string]: MediaPlayerPathInfo } =
	{
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
	[columnId in ContentOverviewTableCols]: (
		order: Avo.Search.OrderDirection,
	) => any;
}> = {
	user_profile_id: (order: Avo.Search.OrderDirection) => {
		if (process.env.DATABASE_APPLICATION_TYPE === AvoOrHetArchief.hetArchief) {
			return {
				owner_profile: { first_name: order },
			};
		}
		return {
			profile: { first_name: order },
		};
	},
	author_user_group: (order: Avo.Search.OrderDirection) => {
		if (process.env.DATABASE_APPLICATION_TYPE === AvoOrHetArchief.hetArchief) {
			return {
				owner_profile: { group: { name: order } },
			};
		}
		return {
			profile: { profile_user_group: { group: { label: order } } },
		};
	},
};
