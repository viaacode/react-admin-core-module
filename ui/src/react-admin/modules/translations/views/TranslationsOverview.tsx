/** biome-ignore-all lint/nursery/noNestedComponentDefinitions: Cell isn't a component but a property with capital letter */
import type { RichEditorState } from '@meemoo/react-components';
import { Button, PaginationBar, RichTextEditor, Table, TextInput } from '@meemoo/react-components';
import { Spacer } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { sortBy } from 'es-toolkit';
import { reverse } from 'es-toolkit/compat';
import type { FunctionComponent, KeyboardEvent, ReactElement, ReactNode } from 'react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import type { Row, TableOptions } from 'react-table';
import { ToastType } from '~core/config/config.types';
import { useGetAllTranslations } from '~modules/translations/hooks/use-get-all-translations';
import {
	RICH_TEXT_EDITOR_OPTIONS,
	TRANSLATIONS_PER_PAGE,
} from '~modules/translations/translations.const';
import { Locale, ValueType } from '~modules/translations/translations.core.types';
import type {
	MultiLanguageTranslationEntry,
	TranslationsOverviewProps,
} from '~modules/translations/translations.types';
import Html from '~shared/components/Html/Html';
import { Icon } from '~shared/components/Icon/Icon';
import { Loader } from '~shared/components/Loader/Loader';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { sortingIcons } from '~shared/components/Table/Table.const';
import { GET_LANGUAGE_NAMES } from '~shared/consts/language-names';
import { CustomError } from '~shared/helpers/custom-error';
import { SanitizePreset } from '~shared/helpers/sanitize/presets/index';
import { showToast } from '~shared/helpers/show-toast';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import type { TranslationEntry } from '../../../../../scripts/translation.types';
import { getFullKey } from '../helpers/get-full-key';
import { useGetAllLanguages } from '../hooks/use-get-all-languages';
import { TranslationsService } from '../translations.service';
import './TranslationsOverview.scss';

type OrderProp = `value_${Locale}` | 'id';

export const TranslationsOverview: FunctionComponent<TranslationsOverviewProps> = ({
	className,
	renderPopup,
}) => {
	const {
		data: allTranslationEntries,
		refetch: refetchTranslations,
		isLoading: isLoadingTranslations,
	} = useGetAllTranslations();

	const { data: allLanguages } = useGetAllLanguages();

	// To simplify working with multi-language translations, we convert the format of the server to

	const [filteredAndPaginatedTranslations, setFilteredAndPaginatedTranslations] = useState<
		MultiLanguageTranslationEntry[] | null
	>(null);
	const [filteredTranslationsCount, setFilteredTranslationsCount] = useState<number>(0);
	const [activeTranslationEntry, setActiveTranslationEntry] =
		useState<MultiLanguageTranslationEntry | null>(null);
	const [activeTranslationLanguage, setActiveTranslationLanguage] = useState<Locale>(Locale.Nl);
	const [activeTranslationEditorState, setActiveTranslationEditorState] =
		useState<RichEditorState | null>(null);
	const [activeTranslationTextValue, setActiveTranslationTextValue] = useState<string | null>(null);

	const [search, setSearch] = useState<string>('');
	const [page, setPage] = useState<number>(0);
	const [orderProp, setOrderProp] = useState<OrderProp | undefined>(undefined);
	const [orderDirection, setOrderDirection] = useState<Avo.Search.OrderDirection>(
		Avo.Search.OrderDirection.ASC
	);

	const pageCount: number = Math.ceil(filteredTranslationsCount / TRANSLATIONS_PER_PAGE);

	const updateFilteredTranslations = useCallback(() => {
		if (!allTranslationEntries) {
			return;
		}
		const filteredTranslations = allTranslationEntries.filter(
			(translationEntry) =>
				// Check key for search term
				getFullKey(translationEntry).toLowerCase().includes(search.toLowerCase()) ||
				// Check each language value for the search term
				Object.values(translationEntry.values).find((value) =>
					value.toLowerCase().includes(search.toLowerCase())
				)
		);
		setFilteredTranslationsCount(filteredTranslations.length);

		let sortedTranslations: MultiLanguageTranslationEntry[] = sortBy(filteredTranslations, [
			(translationEntry: MultiLanguageTranslationEntry) => {
				if (orderProp === 'id') {
					return getFullKey(translationEntry);
				}
				if (orderProp) {
					const languageCode = orderProp.split('_')[1] as Locale;
					return translationEntry.values[languageCode];
				}
				return undefined;
			},
		]);
		if (orderDirection === Avo.Search.OrderDirection.DESC) {
			sortedTranslations = reverse(sortedTranslations);
		}
		const paginatedTranslations: MultiLanguageTranslationEntry[] = sortedTranslations.slice(
			page * TRANSLATIONS_PER_PAGE,
			Math.min(sortedTranslations?.length || 0, (page + 1) * TRANSLATIONS_PER_PAGE)
		);
		setFilteredAndPaginatedTranslations(paginatedTranslations);
	}, [allTranslationEntries, orderProp, orderDirection, page, search]);

	useEffect(() => {
		refetchTranslations();
	}, [refetchTranslations]);

	useEffect(() => {
		updateFilteredTranslations();
	}, [updateFilteredTranslations]);

	const saveActiveTranslation = async () => {
		try {
			if (!activeTranslationEntry) {
				throw new Error('Active translation is not defined, failed to save translation');
			}

			let value =
				activeTranslationEntry.value_type === ValueType.TEXT
					? activeTranslationTextValue || ''
					: activeTranslationEditorState?.toHTML() || '';

			// Simplify value if only wrapped with <p></p> tag and otherwise no html
			if (
				activeTranslationEntry.value_type === ValueType.HTML &&
				value.startsWith('<p>') &&
				value.endsWith('</p>')
			) {
				const innerValue = value.substring('<p>'.length, value.length - '</p>'.length);
				if (!innerValue.includes('<')) {
					// Html value doesn't contain any html or new lines => only save inner text
					value = innerValue;
				}
			}

			await TranslationsService.updateTranslation(
				activeTranslationEntry.component,
				activeTranslationEntry.location,
				activeTranslationEntry.key,
				activeTranslationLanguage,
				value
			);

			await refetchTranslations();

			setActiveTranslationEntry(null);
			setActiveTranslationTextValue(null);
			setActiveTranslationEditorState(null);

			showToast({
				title: tText('modules/translations/views/translations-overview___success'),
				description: tText(
					'modules/translations/views/translations-overview-v-2___de-vertaling-is-opgeslagen'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(new CustomError('Failed to save translation', err));
			showToast({
				title: tText('modules/translations/views/translations-overview___error'),
				description: tText(
					'modules/translations/views/translations-overview-v-2___het-opslaan-van-de-vertaling-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const handlePageChange = (newPageZeroBased: number) => {
		setPage(newPageZeroBased);
	};

	const sortFilters = useMemo(() => {
		return [
			{
				id: orderProp,
				desc: orderDirection !== Avo.Search.OrderDirection.ASC,
			},
		];
	}, [orderProp, orderDirection]);

	const handleSortChange = useCallback(
		(
			newOrderProp: string | undefined,
			newOrderDirection: Avo.Search.OrderDirection | undefined
		) => {
			if (newOrderProp !== orderProp || newOrderDirection !== orderDirection) {
				setOrderProp(newOrderProp as OrderProp | undefined);
				setOrderDirection(newOrderDirection || Avo.Search.OrderDirection.ASC);
				setPage(0);
			}
		},
		// Fix ARC-964: If filters.page is included, the pagination breaks (on pagechange the pagenumber resets to 1 again)
		[orderProp, orderDirection]
	);

	const handleEditButtonClicked = (
		translationEntry: MultiLanguageTranslationEntry,
		languageCode: Locale
	) => {
		setActiveTranslationEntry(translationEntry);
		setActiveTranslationTextValue(translationEntry.values[languageCode]);
		setActiveTranslationLanguage(languageCode);
	};

	const getPagination = () => {
		return (
			<Spacer margin="top-large">
				<PaginationBar
					startItem={(page || 0) * TRANSLATIONS_PER_PAGE}
					itemsPerPage={TRANSLATIONS_PER_PAGE}
					totalItems={pageCount * TRANSLATIONS_PER_PAGE}
					onPageChange={handlePageChange}
					firstLabel={tText('modules/translations/views/translations-overview___eerste')}
					firstIcon={<Icon name="anglesLeft" />}
					previousLabel={tText('shared/components/filter-table/filter-table___vorige')}
					previousIcon={<Icon name="angleLeft" />}
					nextLabel={tText('shared/components/filter-table/filter-table___volgende')}
					nextIcon={<Icon name="angleRight" />}
					lastLabel={tText('modules/translations/views/translations-overview___laatste')}
					lastIcon={<Icon name="anglesRight" />}
					backToTopLabel={tText('shared/components/filter-table/filter-table___terug-naar-boven')}
					backToTopIcon={<Icon name="angleUp" />}
					labelBetweenPageStartAndEnd={tText(
						'modules/shared/components/filter-table/filter-table___label-between-start-and-end-page-in-pagination-bar'
					)}
					labelBetweenPageEndAndTotal={tText(
						'modules/shared/components/filter-table/filter-table___label-between-end-page-and-total-in-pagination-bar'
					)}
					showBackToTop={true}
					showFirstAndLastButtons={true}
					onScrollToTop={() => {
						const scrollable = document.querySelector('.m-admin-layout-content.c-scrollable');
						scrollable?.scrollTo(0, 0);
					}}
				/>
			</Spacer>
		);
	};

	const translationTableColumns = [
		{
			id: 'key',
			Header: tHtml('modules/translations/views/translations-overview-v-2___id'),
			canSort: true,
			accessorFn: (translationEntry: TranslationEntry) => getFullKey(translationEntry),
			Cell: ({ row }: { row: Row<TranslationEntry> }): ReactElement => {
				const translationEntry: TranslationEntry = row.original;
				return (
					<>
						<div>
							<strong>{translationEntry.key}</strong>
						</div>
						<div className="u-text-muted">
							{`${translationEntry.component}/${translationEntry.location}`}
						</div>
					</>
				);
			},
		},
		...(allLanguages || []).map((languageInfo) => {
			return {
				id: `value_${languageInfo.languageCode}`,
				Header: GET_LANGUAGE_NAMES()[languageInfo.languageCode],
				canSort: true,
				accessorFn: (translationEntry: MultiLanguageTranslationEntry) =>
					translationEntry.values[languageInfo.languageCode],
				Cell: ({ row }: { row: Row<MultiLanguageTranslationEntry> }): ReactElement => {
					const translationEntry = row.original;
					const value = translationEntry.values[languageInfo.languageCode as Locale];

					return (
						<button
							type="button"
							className="c-translation-overview__edit-button"
							onClick={() => {
								handleEditButtonClicked(translationEntry, languageInfo.languageCode as Locale);
							}}
							onKeyUp={(evt: KeyboardEvent) => {
								if (evt.key === 'Enter') {
									handleEditButtonClicked(translationEntry, languageInfo.languageCode as Locale);
								}
							}}
						>
							{translationEntry.value_type === ValueType.HTML && (
								<Html
									content={value}
									sanitizePreset={SanitizePreset.link}
									className="c-content"
								></Html>
							)}
							{translationEntry.value_type === ValueType.TEXT && <span>{value}</span>}
						</button>
					);
				},
			};
		}),
	];

	const renderTranslationsTable = (): ReactNode => {
		if (!filteredAndPaginatedTranslations) {
			return <Loader />;
		}
		if (!filteredAndPaginatedTranslations.length) {
			return (
				<span className="c-translations-content__no-results">
					{tHtml(
						'modules/translations/views/translations-overview-v-2___er-zijn-geen-vertalingen-gevonden'
					)}
				</span>
			);
		}
		return (
			<>
				<Table
					options={
						{
							columns: translationTableColumns,
							data: filteredAndPaginatedTranslations,
							initialState: {
								pageSize: TRANSLATIONS_PER_PAGE,
								sortBy: sortFilters,
							},
							// biome-ignore lint/suspicious/noExplicitAny: todo
						} as TableOptions<any>
					}
					onSortChange={handleSortChange}
					sortingIcons={sortingIcons}
					pagination={getPagination}
				/>
			</>
		);
	};

	const renderPopupBody = () => {
		if (!activeTranslationEntry) {
			return null;
		}
		return (
			<>
				<CopyToClipboard
					text={getFullKey(activeTranslationEntry)}
					onCopy={() =>
						showToast({
							title: tText('modules/translations/views/translations-overview-v-2___gekopieerd'),
							description: tText(
								'modules/translations/views/translations-overview-v-2___de-vertaalsleutel-is-naar-het-klembord-gekopieerd'
							),
							type: ToastType.SUCCESS,
						})
					}
				>
					<Button variants={['block', 'text']} className="c-button--copy-to-clipboard">
						<div>
							<strong>{activeTranslationEntry.key}</strong>
						</div>
						<div className="u-text-muted">
							{`${activeTranslationEntry.component}/${activeTranslationEntry.location}`}
						</div>
					</Button>
				</CopyToClipboard>
				{activeTranslationEntry.value_type === ValueType.HTML && (
					<RichTextEditor
						onChange={setActiveTranslationEditorState}
						state={activeTranslationEditorState || undefined}
						initialHtml={activeTranslationEntry.values[activeTranslationLanguage]}
						controls={RICH_TEXT_EDITOR_OPTIONS}
					></RichTextEditor>
				)}
				{activeTranslationEntry.value_type === ValueType.TEXT && (
					<textarea
						className="c-translation-overview__textarea"
						value={activeTranslationTextValue || undefined}
						onChange={(evt) => setActiveTranslationTextValue(evt.target.value)}
					></textarea>
				)}
			</>
		);
	};

	if (isLoadingTranslations) {
		return <CenteredSpinner />;
	}
	return (
		<div className={className}>
			<TextInput
				type="search"
				aria-label={tText('modules/translations/views/translations-overview___zoekveld-aria-label')}
				iconEnd={<Icon name="filter" />}
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
					setPage(0);
				}}
				placeholder={tText(
					'modules/translations/views/translations-overview-v-2___zoek-op-id-of-waarde'
				)}
			></TextInput>
			{renderTranslationsTable()}
			{renderPopup({
				title: tText('modules/translations/views/translations-overview-v-2___vertaling-aanpassen'),
				body: renderPopupBody(),
				isOpen: !!activeTranslationEntry,
				onSave: saveActiveTranslation,
				onClose: () => {
					setActiveTranslationEntry(null);
					setActiveTranslationTextValue(null);
					setActiveTranslationEditorState(null);
				},
			})}
		</div>
	);
};
