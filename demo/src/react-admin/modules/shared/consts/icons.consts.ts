import { IconName } from '@viaa/avo2-components';

import { ReactSelectOption } from '../types';

import { AdminConfigManager } from '~core/config';

export const GET_ADMIN_ICON_OPTIONS: () => ReactSelectOption<IconName>[] = () => {
	return [
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___afbeelding'),
			value: 'image',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___aktetas'),
			value: 'briefcase',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___audio'),
			value: 'headphone',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___collectie'),
			value: 'collection',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___download'),
			value: 'download',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t(
				'admin/shared/constants/index___externe-link'
			),
			value: 'external-link',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___help'),
			value: 'help-circle',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___info'),
			value: 'info',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___kalender'),
			value: 'calendar',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___klascement'),
			value: 'klascement',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___link'),
			value: 'link-2',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___link-delen'),
			value: 'share-2',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___login'),
			value: 'log-in',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___opdracht'),
			value: 'clipboard',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___profiel'),
			value: 'user',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___smartschool'),
			value: 'smartschool',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t(
				'admin/shared/constants/index___tekstbestand'
			),
			value: 'file-text',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___uploaden'),
			value: 'upload',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___video'),
			value: 'video',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___view'),
			value: 'eye',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/shared/constants/index___zoek'),
			value: 'search',
		},
	];
};
