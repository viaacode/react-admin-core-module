import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import { useTranslation } from '~shared/hooks/useTranslation';
import { Link } from '../Link';

import './Sidebar.scss';

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
	const { tHtml } = useTranslation();

	return (
		<div className={clsx(className, 'o-sidebar', { 'o-sidebar--light': light })}>
			{headerLink && (
				<div className="o-sidebar__header">
					<Link className="u-remove-link-styling u-color-white" to={headerLink}>
						{tHtml('admin/shared/components/sidebar/sidebar___beheer')}
					</Link>
				</div>
			)}
			<div className="o-sidebar__content">{children}</div>
		</div>
	);
};
