import { ButtonAction, ButtonType } from '@viaa/avo2-components';
import { IconNameSchema } from '@viaa/avo2-components/dist/components/Icon/Icon.types';
import { ContentPickerTypeSchema } from '@viaa/avo2-types/types/core';
import { HeadingTypeOption } from '~modules/content-page/types/content-block.types';
import { PickerItem } from '~shared/types/content-picker';

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

export interface EnclosedContent {
	thumbnail_path: string;
	name: string;
	description: string;
	id: string;
}
