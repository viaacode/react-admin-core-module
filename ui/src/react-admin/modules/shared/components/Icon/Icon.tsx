import type { IconName } from '@viaa/avo2-components';
import type { FC } from 'react';
import React from 'react';

import type { IconConfig } from '~core/config';
import { AdminConfigManager } from '~core/config';

interface IconProps {
	name: keyof IconConfig['componentProps'] | IconName;
	className?: string;
}

export const Icon: FC<IconProps> = ({ name, className }) => {
	const iconConfig = AdminConfigManager.getConfig().icon;
	const iconProps = ((iconConfig?.componentProps as any)?.[name] as {
		name: string;
	}) ?? { name }; // Default to avo2 icons
	const IconComponent = iconConfig?.component ?? (() => null);

	return <IconComponent {...iconProps} className={className} />;
};
