import clsx from 'clsx';
import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import { tHtml } from '~shared/helpers/translation-functions.js';
import { Link } from '../Link/Link.js';

import './Sidebar.scss';

interface SidebarProps {
	children?: ReactNode;
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
