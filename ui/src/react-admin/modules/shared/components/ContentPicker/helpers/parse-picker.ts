import { LinkTarget } from '@viaa/avo2-components';
import { parse } from 'query-string';

import { PickerItem } from '../../../types/content-picker';
import { ContentPickerType } from '../ContentPicker.types';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';

export const parseSearchQuery = (input: string): string => {
	try {
		// replace %22 by "
		const replacedString = decodeURI(input);

		// split on first instance of ?
		const splitString = replacedString.includes('?')
			? replacedString.split('?').slice(1).join('?')
			: replacedString;

		// parse as objects
		let filterDefinition: any;
		if (splitString.trim()[0] !== '{') {
			filterDefinition = parse(splitString);
			filterDefinition.filters = JSON.parse(filterDefinition.filters as string);
		} else {
			filterDefinition = JSON.parse(splitString);
		}

		return JSON.stringify(filterDefinition);
	} catch (err) {
		console.error('Failed to parse search query input', err);
		AdminConfigManager.getConfig().services.toastService.showToast({
			title: AdminConfigManager.getConfig().services.i18n.tText(
				'modules/admin/shared/components/content-picker/helpers/parse-picker___error'
			),
			description: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/shared/helpers/content-picker/parse-picker___gelieve-een-correcte-zoekfilter-link-in-te-vullen'
			),
			type: ToastType.ERROR,
		});

		return 'Ongeldige zoekfilter';
	}
};

export const parsePickerItem = (
	type: ContentPickerType,
	value: string,
	target: LinkTarget = LinkTarget.Blank
): PickerItem => ({
	type,
	target,
	value: type === ContentPickerType.SEARCH_QUERY ? parseSearchQuery(value) : value,
});