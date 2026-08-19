import type { FC } from 'react';
import React from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import type { AdminCoreIconName } from '~core/config/config.types';
import { CustomError } from '~shared/helpers/custom-error.ts';
import { isHetArchief } from '~shared/helpers/is-hetarchief.ts';

interface IconProps {
	name: AdminCoreIconName;
	className?: string;
}

/**
 * Renders one of the icons every client maps in the `icon.componentProps` of its admin-core config.
 * Use this for icons that are part of the admin-core interface itself. Icons that come from content
 * page data are stored by their raw client icon name, use ContentPageIcon for those.
 */
export const Icon: FC<IconProps> = ({ name, className }) => {
	const iconConfig = AdminConfigManager.getConfig().icon;
	const iconProps = iconConfig?.componentProps?.[name];

	if (!iconConfig || !iconProps) {
		return null;
	}

	const IconComponent = iconConfig.component;

	return <IconComponent {...iconProps} className={className} />;
};

interface ContentPageIconProps {
	/** A raw client icon name, eg: arrow-right--light for hetarchief or arrow-right for avo */
	name: string | undefined;
	className?: string;
}

/**
 * Renders an icon by its raw client icon name. Icons picked in the content page editor are stored
 * by their raw icon name (eg: arrow-right--light) instead of by an admin-core config key
 * (eg: arrowRight), so they cannot be resolved through the icon.componentProps of the config.
 */
export const ContentPageIcon: FC<ContentPageIconProps> = ({ name, className }) => {
	const iconConfig = AdminConfigManager.getConfig().icon;

	if (!iconConfig || !name) {
		return null;
	}

	if (isHetArchief() && !(iconConfig.list?.() || []).some((option) => option.value === name)) {
		// The content page references an icon hetarchief doesn't have (anymore), eg: after a rename
		console.error(
			new CustomError('Failed to find hetarchief icon in the admin-core config icon list', null, {
				name,
			})
		);
		return null;
	}

	const IconComponent = iconConfig.component;

	return <IconComponent name={name} className={className} />;
};
