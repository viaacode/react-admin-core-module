import type { FlowplayerSourceList } from '@meemoo/react-components';
import type { AvoItemItem } from '@viaa/avo2-types';
import type { ReactNode } from 'react';

/**
 * Keep in sync with avo2 client src/shared/components/FlowPlayerWrapper/FlowPlayerWrapper.tsx
 */
export interface CuePoints {
	end: number | null;
	start: number | null;
}

/**
 * Keep in sync with avo2 client src/shared/components/FlowPlayerWrapper/FlowPlayerWrapper.tsx
 */
export type FlowPlayerWrapperProps = {
	annotationText?: string;
	annotationTitle?: string;
	autoplay?: boolean;
	canPlay?: boolean;
	cuePoints?: CuePoints;
	duration?: string;
	external_id?: string;
	issuedDate?: string;
	item?: AvoItemItem;
	cuePointsVideo?: CuePoints;
	cuePointsLabel?: CuePoints;
	onEnded?: () => void;
	onPlay?: (playingSrc?: string) => void;
	organisationLogo?: string;
	organisationName?: string;
	poster?: string;
	seekTime?: number;
	src?: string | FlowplayerSourceList;
	title?: string;
	topRight?: ReactNode;
	seekable?: boolean;
	ui?: number;
	controls?: boolean;
	speed?: unknown | null;
	trackPlayEvent: boolean;
};
