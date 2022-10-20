import { FC, ReactNode } from 'react';

export interface AdminLayoutProps {
	pageTitle?: ReactNode;
}

export type AdminLayoutComponent = FC<AdminLayoutProps> & {
	Content: FC;
	Actions: FC;
	FiltersLeft: FC;
	FiltersRight: FC;
};
