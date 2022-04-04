import React, { FC } from 'react';

import { useConfig } from '../../hooks';
import { DefaultComponentProps } from '../../types';

const Loader: FC<DefaultComponentProps> = (props) => {
	const componentsConfig = useConfig('components');
	const LoaderComponent =
		componentsConfig?.loader.component ?? (() => <span {...props}>Laden...</span>);

	return <LoaderComponent {...props} />;
};

export default Loader;
