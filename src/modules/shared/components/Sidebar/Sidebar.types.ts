import { ReactNode } from 'react';

import { DefaultComponentProps } from '../../types';

export interface SidebarProps extends DefaultComponentProps {
	title?: string;
	heading?: ReactNode;
}
