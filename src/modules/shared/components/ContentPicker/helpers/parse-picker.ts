import { LinkTarget } from '@viaa/avo2-components';
import queryString from 'query-string';

import { Config, ToastType } from '../../../../../core/config';
import { PickerItem } from '../../../types/content-picker';
import { ContentPickerType } from '../ContentPicker.const';

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
			filterDefinition = queryString.parse(splitString);
			filterDefinition.filters = JSON.parse(filterDefinition.filters as string);
		} else {
			filterDefinition = JSON.parse(splitString);
		}

		return JSON.stringify(filterDefinition);
	} catch (err) {
		console.error('Failed to parse search query input', err);
		Config.getConfig().services.toastService.showToast({
			title: Config.getConfig().services.i18n.t(
				'modules/admin/shared/components/content-picker/helpers/parse-picker___error'
			),
			description: Config.getConfig().services.i18n.t(
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
