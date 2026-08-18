import type { PickerItem } from '~shared/types/content-picker';

export type BlockBreadcrumbsProps = {
	foregroundColor: string;
	overlayNextBlock: boolean;
	elements: BreadCrumb[];
};

export interface BreadCrumb {
	label: string;
	link: PickerItem;
}
