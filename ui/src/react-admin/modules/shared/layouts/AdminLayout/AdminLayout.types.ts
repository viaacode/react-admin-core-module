import { FC } from 'react';

export interface AdminLayoutProps {
	pageTitle?: string;
}

export type AdminLayoutComponent = FC<AdminLayoutProps> & {
	Content: FC;
	Actions: FC;
	FiltersLeft: FC;
	FiltersRight: FC;
};
