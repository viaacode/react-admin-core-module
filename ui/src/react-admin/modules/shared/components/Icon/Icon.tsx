import { IconName } from '@viaa/avo2-components';
import React, { FC } from 'react';

import { AdminConfigManager, IconConfig } from '~core/config';

interface IconProps {
	name: keyof IconConfig['componentProps'] | IconName;
	className?: string;
}

const Icon: FC<IconProps> = ({ name, className }) => {
	const iconConfig = AdminConfigManager.getConfig().icon;
	const iconProps = ((iconConfig?.componentProps as any)?.[name] as {
		name: string;
	}) ?? { name }; // Default to avo2 icons
	const IconComponent = iconConfig?.component ?? (() => null);

	return <IconComponent {...iconProps} className={className} />;
};

export default Icon;
