import { flatten, fromPairs, get, groupBy, isNil, map } from 'lodash-es';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';

import { KeyValueEditor } from '@viaa/avo2-components';

import { Translation, TranslationsState } from '../translations.types';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { AvoOrHetArchief, UserProps } from '~modules/shared/types';
import { Config, ToastType } from '~core/config';
import { TranslationsService } from '../translations.service';
import { TranslationsOverviewRef } from '../translations.const';

const TranslationsOverview = forwardRef<TranslationsOverviewRef | undefined, UserProps>(
	(_props, ref) => {
		const [initialTranslations, setInitialTranslations] = useState<Translation[]>([]);
		const [translations, setTranslations] = useState<Translation[]>([]);
		const keyPrefix =
			Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.avo
				? 'translations-'
				: 'TRANSLATIONS_';

		const convertTranslationsToData = useCallback(
			(translations: TranslationsState[]): Translation[] => {
				// convert translations to state format
				return flatten(
					translations.map((context: TranslationsState) => {
						// convert object-based translations to array-based translations
						const translationsArray: Translation[] = Object.entries(get(context, 'value'));

						// add context to translations id
						return translationsArray.map(
							(item: Translation): Translation => [
								`${get(context, 'name').replace(keyPrefix, '')}/${item[0]}`,
								item[1],
							]
						);
					})
				);
			},
			[keyPrefix]
		);

		const getTranslations = useCallback(async () => {
			try {
				const translationRows = convertTranslationsToData(
					await TranslationsService.fetchTranslations()
				);
				setInitialTranslations(translationRows);
				setTranslations(translationRows);
			} catch (err) {
				console.error(new CustomError('Failed to fetch translations', err));
				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t('Error'),
					description: Config.getConfig().services.i18n.t(
						'admin/translations/views/translations-overview___het-ophalen-van-de-vertalingen-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			}
		}, [convertTranslationsToData]);

		useEffect(() => {
			getTranslations();
		}, [getTranslations]);

		/**
		 * Ref
		 */
		// Pass functions to parent component
		useImperativeHandle(ref, () => ({
			onSave: onSaveTranslations,
		}));

		const onChangeTranslations = (updatedTranslations: Translation[]) => {
			setTranslations(updatedTranslations);
		};

		const onSaveTranslations = async () => {
			// convert translations to db format and save translations
			const promises: any = [];

			const freshTranslations = convertTranslationsToData(
				await TranslationsService.fetchTranslations()
			);

			const updatedTranslations = freshTranslations.map(
				(freshTranslation: Translation): [string, string] => {
					const initialTranslation = initialTranslations.find(
						(trans) => trans[0] === freshTranslation[0]
					);
					const currentTranslation = translations.find(
						(trans) => trans[0] === freshTranslation[0]
					);

					if (isNil(currentTranslation)) {
						// This translation has been added to the database but didn't exist yet when the page was loaded
						return freshTranslation;
					}

					if (
						!isNil(initialTranslation) &&
						!isNil(currentTranslation) &&
						initialTranslation[1] !== currentTranslation[1]
					) {
						// This translation has changed since the page was loaded
						return currentTranslation;
					}

					// This translation has not changed, we write the fresh value from the database back to the database
					return freshTranslation;
				}
			);

			convertDataToTranslations(updatedTranslations).forEach((context: any) => {
				promises.push(TranslationsService.updateTranslations(context.name, context));
			});

			try {
				await Promise.all(promises);

				await getTranslations();

				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t('Success'),
					description: Config.getConfig().services.i18n.t(
						'admin/translations/views/translations-overview___de-vertalingen-zijn-opgeslagen'
					),
					type: ToastType.SUCCESS,
				});
			} catch (err) {
				console.error(new CustomError('Failed to save translations', err));
				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t('Error'),
					description: Config.getConfig().services.i18n.t(
						'admin/translations/views/translations-overview___het-opslaan-van-de-vertalingen-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			}
		};

		const splitOnFirstSlash = (text: string): string[] => {
			const firstSlashIndex = text.indexOf('/');
			return [text.substring(0, firstSlashIndex), text.substring(firstSlashIndex + 1)];
		};

		const convertDataToTranslations = (data: Translation[]) => {
			const translationsPerContext = groupBy(data, (dataItem) => {
				return splitOnFirstSlash(dataItem[0])[0];
			});

			return map(translationsPerContext, (translations: Translation, context: string) => ({
				name: `${keyPrefix}${context}`,
				value: fromPairs(
					translations.map((translation) => [
						splitOnFirstSlash(translation[0])[1],
						translation[1],
					])
				),
			}));
		};

		return translations.length ? (<KeyValueEditor
			initialData={initialTranslations}
			data={translations}
			onChange={onChangeTranslations}
		/>) : null;
	}
);

export default TranslationsOverview;
