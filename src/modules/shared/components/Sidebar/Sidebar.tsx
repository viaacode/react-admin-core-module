import clsx from 'clsx';
import React, { FC } from 'react';

import { SidebarProps } from './Sidebar.types';

// TODO: move Sidebar component from hetarchief 2 to @meemoo/react-components
const Sidebar: FC<SidebarProps> = ({ className, children, title, heading }) => {
	return (
		<aside className={clsx(className, 'c-sidebar')}>
			{heading ?? <h2 className="c-sidebar__title">{title}</h2>}
			{children}
		</aside>
	);
};

export default Sidebar;
