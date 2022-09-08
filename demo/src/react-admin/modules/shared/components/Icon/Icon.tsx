import React, { FC } from 'react';

import { Config, IconConfig } from '~core/config';

interface IconProps {
	name: keyof IconConfig['componentProps'];
	className?: string;
}

const Icon: FC<IconProps> = ({ name, className }) => {
	const iconConfig = Config.getConfig().icon;
	const iconProps = iconConfig?.componentProps?.[name];
	const IconComponent = iconConfig?.component ?? (() => null);

	return <IconComponent {...iconProps} />;
};

export default Icon;
