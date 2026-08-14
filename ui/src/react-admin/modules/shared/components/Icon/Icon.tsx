import type { IconName } from '@viaa/avo2-components';
import type { FC } from 'react';
import React from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import type { IconConfig } from '~core/config/config.types';
import { CustomError } from '~shared/helpers/custom-error.ts';
import { isHetArchief } from '~shared/helpers/is-hetarchief.ts';

interface IconProps {
	name: keyof IconConfig['componentProps'] | IconName;
	className?: string;
}

export const Icon: FC<IconProps> = ({ name, className }) => {
	const iconConfig = AdminConfigManager.getConfig().icon;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	let iconProps = (iconConfig?.componentProps as any)?.[name] as {
		name: string;
	};
	if (!iconProps) {
		if (isHetArchief()) {
			console.error(
				new CustomError('Failed to find hetarchief icon in admin-core config', null, {
					name,
					config: iconConfig?.componentProps,
				})
			);
		} else {
			// Default to avo2 icons
			iconProps = { name };
		}
	}
	const IconComponent = iconConfig?.component ?? (() => null);

	return <IconComponent {...iconProps} className={className} />;
};
