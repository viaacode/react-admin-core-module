import { TranslationsState, TranslationV2 } from '~modules/translations/translations.types';
import { flatten, fromPairs, get, groupBy, map } from 'lodash-es';
import { AdminConfigManager } from '~core/config';
import { AvoOrHetArchief } from '~modules/shared/types';

export const getKeyPrefix = () =>
	AdminConfigManager.getConfig().database.databaseApplicationType === AvoOrHetArchief.avo
		? 'translations-'
		: 'TRANSLATIONS_';

export function convertFromDatabaseToList(translationList: TranslationsState[]): TranslationV2[] {
	// convert translations to state format
	return flatten(
		translationList.map((context: TranslationsState) => {
			// convert single object-based translations to array-based translations where each item has a key and a value
			return Object.entries(get(context, 'value')).map((entryPair): TranslationV2 => {
				return {
					context: context.name,
					key: entryPair[0],
					label: `${context?.name.replace(getKeyPrefix(), '')}/${entryPair[0]}`,
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
