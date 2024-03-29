import React, { FC } from 'react';

import { AdminConfigManager } from '~core/config';

interface IconProps {
	name: string;
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
