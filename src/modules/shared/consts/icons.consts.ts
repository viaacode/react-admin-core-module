import { IconName } from '@viaa/avo2-components';

import { ReactSelectOption } from '../types';

import { Config } from 'core/config';

export const GET_ADMIN_ICON_OPTIONS: () => ReactSelectOption<IconName>[] = () => {
	return [
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___afbeelding'),
			value: 'image',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___aktetas'),
			value: 'briefcase',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___audio'),
			value: 'headphone',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___collectie'),
			value: 'collection',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___download'),
			value: 'download',
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/shared/constants/index___externe-link'
			),
			value: 'external-link',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___help'),
			value: 'help-circle',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___info'),
			value: 'info',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___kalender'),
			value: 'calendar',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___klascement'),
			value: 'klascement',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___link'),
			value: 'link-2',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___link-delen'),
			value: 'share-2',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___login'),
			value: 'log-in',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___opdracht'),
			value: 'clipboard',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___profiel'),
			value: 'user',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___smartschool'),
			value: 'smartschool',
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/shared/constants/index___tekstbestand'
			),
			value: 'file-text',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___uploaden'),
			value: 'upload',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___video'),
			value: 'video',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___view'),
			value: 'eye',
		},
		{
			label: Config.getConfig().services.i18n.t('admin/shared/constants/index___zoek'),
			value: 'search',
		},
	];
};
