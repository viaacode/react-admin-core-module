import { isAvo } from '~modules/shared/helpers/is-avo';
import { Translation, TranslationContextName } from '~modules/translations/translations.types';
import { flatten, fromPairs, groupBy, map, snakeCase } from 'lodash-es';

export const getKeyPrefix = () => (isAvo() ? 'translations-' : 'TRANSLATIONS_');

export function convertFromDatabaseToList(
	translationList: Record<string, Record<string, string>>
): Translation[] {
	// convert translations to state format
	return flatten(
		Object.entries(translationList).map((entry: [string, Record<string, string>]) => {
			// convert single object-based translations to array-based translations where each item has a key and a value
			return Object.entries(entry[1]).map((entryPair): Translation => {
				return {
					context: snakeCase(entry[0]).toUpperCase() as TranslationContextName,
					key: entryPair[0],
					label: `${entry[0].replace(getKeyPrefix(), '')}/${entryPair[0]}`,
					value: entryPair[1] as string,
				};
			});
		})
	);
}

export function convertFromListToDatabase(
	data: Translation[]
): { name: string; value: Record<string, string> }[] {
	const translationsPerContext = groupBy(data, (dataItem) => {
		return dataItem.context;
	});

	return map(translationsPerContext, (list: Translation[], context: string) => {
		return {
			name: context,
			value: fromPairs(
				list.map((translation): [string, string] => [translation.key, translation.value])
			) as Record<string, string>,
		};
	});
}
