import { FC, ReactNode } from 'react';
import { DefaultComponentProps } from '~shared/types/components';

export interface AdminLayoutProps extends DefaultComponentProps {
	children?: ReactNode;
	pageTitle?: ReactNode;
	className?: string;
}

export type AdminLayoutComponent = FC<AdminLayoutProps> & {
	Actions: FC<{ children?: ReactNode }>;
	Back: FC<{ children?: ReactNode }>;
	Content: FC<{ children?: ReactNode }>;
	FiltersLeft: FC<{ children?: ReactNode }>;
	FiltersRight: FC<{ children?: ReactNode }>;
};
