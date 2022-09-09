import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

import './Sidebar.scss';
import { AdminConfigManager } from '~core/config';

interface SidebarProps {
	className?: string;
	headerLink?: string;
	light?: boolean;
}

export const Sidebar: FunctionComponent<SidebarProps> = ({
	children,
	className,
	headerLink,
	light = false,
}) => {
	const { t } = useTranslation();
	const Link = AdminConfigManager.getConfig().services.router.Link;

	return (
		<div className={clsx(className, 'o-sidebar', { 'o-sidebar--light': light })}>
			{headerLink && (
				<div className="o-sidebar__header">
					<Link className="u-remove-link-styling u-color-white" to={headerLink}>
						{t('admin/shared/components/sidebar/sidebar___beheer')}
					</Link>
				</div>
			)}
			<div className="o-sidebar__content">{children}</div>
		</div>
	);
};
