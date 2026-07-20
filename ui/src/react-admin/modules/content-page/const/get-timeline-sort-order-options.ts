import type { SelectOption } from '@viaa/avo2-components';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import type { TimelineSortOrder } from '../types/content-block.types';

export const GET_TIMELINE_SORT_ORDER_OPTIONS: () => SelectOption<TimelineSortOrder>[] = () => [
	{
		label: tText(
			'react-admin/modules/content-page/const/get-timeline-sort-order-options___aflopend-nieuwste-eerst',
			{},
			[HET_ARCHIEF]
		),
		value: 'date__desc',
	},
	{
		label: tText(
			'react-admin/modules/content-page/const/get-timeline-sort-order-options___oplopend-oudste-eerst',
			{},
			[HET_ARCHIEF]
		),
		value: 'date__asc',
	},
];
