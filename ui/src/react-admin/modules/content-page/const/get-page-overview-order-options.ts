import { SelectOption } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';

export type PageOverviewOrderOptions =
	| 'published_at__asc'
	| 'published_at__desc'
	| 'title__asc'
	| 'title__desc';

export const GET_PAGE_OVERVIEW_ORDER_OPTIONS: () => SelectOption<PageOverviewOrderOptions>[] =
	() => [
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___publicatie-datum-nieuw-oud'
			),
			value: 'published_at__desc',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___publicatie-datum-oud-nieuw'
			),
			value: 'published_at__asc',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___titel-a-z'
			),
			value: 'title__asc',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___titel-z-a'
			),
			value: 'title__desc',
		},
	];
