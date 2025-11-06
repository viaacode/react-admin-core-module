import type { SelectOption } from '@viaa/avo2-components';
import { tText } from '~shared/helpers/translation-functions.js';

export type PageOverviewOrderOptions =
	| 'published_at__asc'
	| 'published_at__desc'
	| 'title__asc'
	| 'title__desc';

export const GET_PAGE_OVERVIEW_ORDER_OPTIONS: () => SelectOption<PageOverviewOrderOptions>[] =
	() => [
		{
			label: tText('admin/content-block/content-block___publicatie-datum-nieuw-oud'),
			value: 'published_at__desc',
		},
		{
			label: tText('admin/content-block/content-block___publicatie-datum-oud-nieuw'),
			value: 'published_at__asc',
		},
		{
			label: tText('admin/content-block/content-block___titel-a-z'),
			value: 'title__asc',
		},
		{
			label: tText('admin/content-block/content-block___titel-z-a'),
			value: 'title__desc',
		},
	];
