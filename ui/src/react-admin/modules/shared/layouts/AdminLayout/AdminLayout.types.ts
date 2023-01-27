import { FC, ReactNode } from 'react';
import { DefaultComponentProps } from '~shared/types/components';

export interface AdminLayoutProps extends DefaultComponentProps {
	pageTitle?: ReactNode;
}

export type AdminLayoutComponent = FC<AdminLayoutProps> & {
	Actions: FC;
	Back: FC;
	Content: FC;
	FiltersLeft: FC;
	FiltersRight: FC;
};
