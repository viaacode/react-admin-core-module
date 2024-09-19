import type { ButtonAction, ButtonType } from '@viaa/avo2-components';
import type { IconNameSchema } from '@viaa/avo2-components/dist/components/Icon/Icon.types';
import type { ContentPickerTypeSchema } from '@viaa/avo2-types/types/core';
import type { HeadingTypeOption } from '~modules/content-page/types/content-block.types';
import type { PickerItem } from '~shared/types/content-picker';

export type BlockContentEncloseProps = {
	title: string;
	titleType: HeadingTypeOption;
	description: string;
	buttonLabel: string;
	buttonAction: ButtonAction;
	buttonType: ButtonType;
	buttonIcon: IconNameSchema;
	buttonAltTitle: string;
	elements: {
		mediaItem: PickerItem;
	}[];
};

export type MappedElement = {
	value: string;
	type: ContentPickerTypeSchema;
};
