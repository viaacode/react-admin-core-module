import type { Avo } from '@viaa/avo2-types';
import { tText } from '~shared/helpers/translation-functions';

type UserDeleteRadioOption = { label: string; value: Avo.User.UserDeleteOption };
export const GET_DELETE_RADIO_OPTIONS = (): UserDeleteRadioOption[] => {
	return [
		{
			label: tText('admin/users/user___verwijder-alle-content'),
			value: 'DELETE_ALL',
		},
		{
			label: tText('admin/users/user___anonimiseer-de-publieke-content-verwijder-de-rest'),
			value: 'ANONYMIZE_PUBLIC',
		},
		{
			label: tText(
				'admin/users/user___verwijder-prive-content-behoud-publieke-content-met-de-naam-van-de-gebruiker'
			),
			value: 'DELETE_PRIVATE_KEEP_NAME',
		},
		{
			label: tText(
				'admin/users/user___zet-publieke-content-over-naar-een-andere-gebruiker-verwijder-de-rest'
			),
			value: 'TRANSFER_PUBLIC',
		},
		{
			label: tText('admin/users/user___zet-alle-content-over-naar-een-andere-gebruiker'),
			value: 'TRANSFER_ALL',
		},
	];
};
