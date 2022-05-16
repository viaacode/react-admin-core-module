import { NavigationElement } from '../../types';

export interface NavigationDetailCellProps {
	row: {
		original: NavigationElement;
	};
}

export interface NavigationDetailParams {
	navigationName: string;
}

export type ReorderRowFunc = (currentIndex: number, indexUpdate: number, id: string) => void;
