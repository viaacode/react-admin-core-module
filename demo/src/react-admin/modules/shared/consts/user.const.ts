import { Avo } from "@viaa/avo2-types";
import { AdminConfigManager } from "~core/config";
import { ROUTE_PARTS } from "./routes";

export const USER_PATH = {
	USER_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.user}`,
	USER_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.user}/:id`,
	// USER_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.user}/:id/${ROUTE_PARTS.edit}`,
};

type UserDeleteRadioOption = { label: string; value: Avo.User.UserDeleteOption };
export const GET_DELETE_RADIO_OPTIONS = (): UserDeleteRadioOption[] => {
	return [
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/users/user___verwijder-alle-content'),
			value: 'DELETE_ALL',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/users/user___anonimiseer-de-publieke-content-verwijder-de-rest'),
			value: 'ANONYMIZE_PUBLIC',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t(
				'admin/users/user___verwijder-prive-content-behoud-publieke-content-met-de-naam-van-de-gebruiker'
			),
			value: 'DELETE_PRIVATE_KEEP_NAME',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t(
				'admin/users/user___zet-publieke-content-over-naar-een-andere-gebruiker-verwijder-de-rest'
			),
			value: 'TRANSFER_PUBLIC',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.t('admin/users/user___zet-alle-content-over-naar-een-andere-gebruiker'),
			value: 'TRANSFER_ALL',
		},
	];
};
