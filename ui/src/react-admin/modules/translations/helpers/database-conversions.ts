import { TranslationV2 } from '~modules/translations/translations.types';
import { flatten, fromPairs, groupBy, map } from 'lodash-es';
import { AdminConfigManager } from '~core/config';
import { AvoOrHetArchief } from '~modules/shared/types';

export const getKeyPrefix = () =>
	AdminConfigManager.getConfig().database.databaseApplicationType === AvoOrHetArchief.avo
		? 'translations-'
		: 'TRANSLATIONS_';

export function convertFromDatabaseToList(
	translationList: Record<string, Record<string, string>>
): TranslationV2[] {
	// convert translations to state format
	return flatten(
		Object.entries(translationList).map((entry: [string, Record<string, string>]) => {
			// convert single object-based translations to array-based translations where each item has a key and a value
			return Object.entries(entry[1]).map((entryPair): TranslationV2 => {
				return {
					context: entry[0],
					key: entryPair[0],
					label: `${entry[0].replace(getKeyPrefix(), '')}/${entryPair[0]}`,
					value: entryPair[1] as string,
				};
			});
		})
	);
}

export function convertFromListToDatabase(
	data: TranslationV2[]
): { name: string; value: Record<string, string> }[] {
	const translationsPerContext = groupBy(data, (dataItem) => {
		return dataItem.context;
	});

	return map(translationsPerContext, (list: TranslationV2[], context: string) => {
		return {
			name: context,
			value: fromPairs(
				list.map((translation): [string, string] => [translation.key, translation.value])
			) as Record<string, string>,
		};
	});
}
