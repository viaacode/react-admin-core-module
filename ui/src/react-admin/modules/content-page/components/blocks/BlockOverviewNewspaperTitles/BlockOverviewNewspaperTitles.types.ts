import { ButtonAction, ButtonType, HeadingType, IconName } from '@viaa/avo2-components';

export interface NewspaperTitle {
	url: string;
	title: string;
}
export type BlockOverviewNewspaperTitlesProps = {
	title: 'string';
	titleType: HeadingType;
	buttonType?: ButtonType;
	buttonLabel: 'string';
	buttonAltTitle?: 'string';
	buttonIcon?: IconName;
	buttonAction?: ButtonAction;
};
