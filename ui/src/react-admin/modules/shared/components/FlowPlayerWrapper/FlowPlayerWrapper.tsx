import { FC, ReactNode, useMemo } from 'react';
import type { Avo } from '@viaa/avo2-types';
import { AdminConfigManager } from '~core/config';
import { FlowplayerSourceList } from '@meemoo/react-components';

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
	ui?: | number;
	controls?: boolean;
	speed?: unknown | null;
};

export const FlowPlayerWrapper: FC<FlowPlayerWrapperProps> = (props) => {
	const config = AdminConfigManager.getConfig().components;
	const Renderer = useMemo(
		() => config?.flowplayer || (() => <>No video player wrapper configured.</>),
		[config]
	);

	return <Renderer {...props} />;
};
