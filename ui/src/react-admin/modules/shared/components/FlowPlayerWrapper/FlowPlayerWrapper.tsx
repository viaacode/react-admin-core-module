import type { FC } from 'react';
import { useMemo } from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import type { FlowPlayerWrapperProps } from '~shared/components/FlowPlayerWrapper/FlowPlayerWrapper.types';

export const FlowPlayerWrapper: FC<FlowPlayerWrapperProps> = (props) => {
	const config = AdminConfigManager.getConfig().components;
	const Renderer = useMemo(
		() => config?.flowplayer || (() => <>No video player wrapper configured.</>),
		[config]
	);

	return <Renderer {...props} />;
};
