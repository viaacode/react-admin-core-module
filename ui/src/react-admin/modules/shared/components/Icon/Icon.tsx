import type { IconName } from '@viaa/avo2-components';
import type { FC } from 'react';
import React from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import type { IconConfig } from '~core/config/config.types';

interface IconProps {
	name: keyof IconConfig['componentProps'] | IconName;
	className?: string;
}

export const Icon: FC<IconProps> = ({ name, className }) => {
	const iconConfig = AdminConfigManager.getConfig().icon;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	const iconProps = ((iconConfig?.componentProps as any)?.[name] as {
		name: string;
	}) ?? { name }; // Default to avo2 icons
	const IconComponent = iconConfig?.component ?? (() => null);

	return <IconComponent {...iconProps} className={className} />;
};
