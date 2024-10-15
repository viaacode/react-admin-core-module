import type { FlowplayerSourceList } from '@meemoo/react-components/dist/components/FlowPlayer/FlowPlayer.types';
import type { ReactNode } from 'react';
import type { Avo } from '@viaa/avo2-types';

/**
 * Source page is used for determining on which type of page play and view events should be counted
 * The admin-core can only output contentPage type, but avo has more types like: collectionPage, assignmentPage, etc.
 */
export enum SourcePage {
	contentPage = 'contentPage',
}

export type FlowPlayerWrapperProps = {
	annotationText?: string;
	annotationTitle?: string;
	autoplay?: boolean;
	canPlay?: boolean;
	cuePoints?: {
		start: number | null;
		end: number | null;
	};
	duration?: string;
	external_id?: string;
	issuedDate?: string;
	item?: Avo.Item.Item;
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
	sourcePage: SourcePage;
};
