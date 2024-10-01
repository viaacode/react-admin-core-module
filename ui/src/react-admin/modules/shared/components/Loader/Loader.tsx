import type { SpinnerProps } from '@viaa/avo2-components';
import { Spinner } from '@viaa/avo2-components';
import type { FC } from 'react';
import React from 'react';

import { AdminConfigManager } from '~core/config';
import type { DefaultComponentProps } from '../../types';

export const Loader: FC<DefaultComponentProps & { fullscreen?: boolean }> = (props) => {
	const componentsConfig = AdminConfigManager.getConfig().components;

	if (componentsConfig?.loader.component) {
		const LoaderComponent = componentsConfig?.loader.component;
		return <LoaderComponent {...(props as any)} />;
	} else {
		return <Spinner {...(props as SpinnerProps)} />;
	}
};
