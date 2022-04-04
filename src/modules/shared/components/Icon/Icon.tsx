import React, { FC } from 'react';

import { IconConfig } from '../../../../core/config';
import { useConfig } from '../../hooks';

interface IconProps {
	name: keyof IconConfig['componentProps'];
}

const Icon: FC<IconProps> = ({ name }) => {
	const iconConfig = useConfig('icon');
	const iconProps = iconConfig?.componentProps?.[name];
	const IconComponent = iconConfig?.component ?? (() => null);

	return <IconComponent {...iconProps} />;
};

export default Icon;
