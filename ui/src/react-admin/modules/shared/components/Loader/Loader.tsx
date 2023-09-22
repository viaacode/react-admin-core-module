import { Spinner, SpinnerProps } from '@viaa/avo2-components';
import React, { FC } from 'react';

import { AdminConfigManager } from '~core/config';
import { DefaultComponentProps } from '../../types';

const Loader: FC<DefaultComponentProps> = (props) => {
	const componentsConfig = AdminConfigManager.getConfig().components;

	if (componentsConfig?.loader.component) {
		const LoaderComponent = componentsConfig?.loader.component;
		return <LoaderComponent {...(props as any)} />;
	} else {
		return <Spinner {...(props as SpinnerProps)} />;
	}
};

export default Loader;
