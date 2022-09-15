import React, { FC } from 'react';

import { AdminConfigManager } from '~core/config';
import { IconConfig } from '~core/config/config.types';

interface IconProps {
	name: keyof IconConfig['componentProps'];
	className?: string;
}

const Icon: FC<IconProps> = ({ name, className }) => {
	const iconConfig = AdminConfigManager.getConfig().icon;
	const iconProps = iconConfig?.componentProps?.[name] as { name: string };
	const IconComponent = iconConfig?.component ?? (() => null);

	return <IconComponent {...iconProps} className={className} />;
};

export default Icon;
