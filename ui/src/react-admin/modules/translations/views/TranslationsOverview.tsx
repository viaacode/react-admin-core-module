import {
	Button,
	Pagination,
	RichEditorState,
	RichTextEditor,
	Table,
	TextInput,
} from '@meemoo/react-components';
import { Pagination as PaginationAvo } from '@viaa/avo2-components';
import { orderBy } from 'lodash-es';
import React, {
	FunctionComponent,
	MouseEvent,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Row, TableOptions } from 'react-table';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { useGetAllTranslations } from '~modules/translations/hooks/use-get-all-translations';
import {
	RICH_TEXT_EDITOR_OPTIONS,
	TRANSLATIONS_PER_PAGE,
} from '~modules/translations/translations.const';
import { LanguageCode, ValueType } from '~modules/translations/translations.core.types';
import {
	MultiLanguageTranslationEntry,
	type TranslationsOverviewProps,
} from '~modules/translations/translations.types';
import { Icon } from '~shared/components';
import Html from '~shared/components/Html/Html';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { sortingIcons } from '~shared/components/Table/Table.const';
import { CustomError } from '~shared/helpers/custom-error';
import { isAvo } from '~shared/helpers/is-avo';
import { useTranslation } from '~shared/hooks/useTranslation';
import { OrderDirection } from '~shared/types';
import Loader from '../../shared/components/Loader/Loader';
import { TranslationsService } from '../translations.service';
import { getFullKey } from '../helpers/get-full-key';
import { useGetAllLanguages } from '../hooks/use-get-all-languages';

import './TranslationsOverview.scss';

const TranslationsOverview: FunctionComponent<TranslationsOverviewProps> = ({
	className,
	renderPopup,
}) => {
	const { tHtml, tText } = useTranslation();

	const {
		data: allTranslationEntries,
		refetch: refetchTranslations,
		isLoading: isLoadingTranslations,
	} = useGetAllTranslations();

	const { data: allLanguages } = useGetAllLanguages();

	// To simplify working with multi language translations, we convert the format of the server to

	const [filteredAndPaginatedTranslations, setFilteredAndPaginatedTranslations] = useState<
		MultiLanguageTranslationEntry[] | null
	>(null);
	const [filteredTranslationsCount, setFilteredTranslationsCount] = useState<number>(0);
	const [activeTranslationEntry, setActiveTranslationEntry] =
		useState<MultiLanguageTranslationEntry | null>(null);
	const [activeTranslationLanguage, setActiveTranslationLanguage] = useState<LanguageCode>(
		LanguageCode.NL
	);
	const [activeTranslationEditorState, setActiveTranslationEditorState] =
		useState<RichEditorState | null>(null);
	const [activeTranslationTextValue, setActiveTranslationTextValue] = useState<string | null>(
		null
	);

	const [search, setSearch] = useState<string>('');
	const [page, setPage] = useState<number>(1);
	const [orderProp, setOrderProp] = useState<string | undefined>(undefined);
	const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.asc);

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

		const orderedTranslations: MultiLanguageTranslationEntry[] = orderBy(
			filteredTranslations,
			[orderProp],
			[orderDirection as OrderDirection]
		);
		const paginatedTranslations: MultiLanguageTranslationEntry[] = orderedTranslations.slice(
			(page - 1) * TRANSLATIONS_PER_PAGE,
			Math.min(orderedTranslations?.length || 0, page * TRANSLATIONS_PER_PAGE)
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

			await TranslationsService.updateTranslation(
				activeTranslationEntry.component,
				activeTranslationEntry.location,
				activeTranslationEntry.key,
				activeTranslationLanguage,
				activeTranslationTextValue || activeTranslationEditorState?.toHTML() || ''
			);

			await refetchTranslations();

			setActiveTranslationEntry(null);
			setActiveTranslationTextValue(null);
			setActiveTranslationEditorState(null);

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('modules/translations/views/translations-overview___success'),
				description: tText(
					'modules/translations/views/translations-overview-v-2___de-vertaling-is-opgeslagen'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(new CustomError('Failed to save translation', err));
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('modules/translations/views/translations-overview___error'),
				description: tText(
					'modules/translations/views/translations-overview-v-2___het-opslaan-van-de-vertaling-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const handlePageChange = (newPageZeroBased: number) => {
		setPage(newPageZeroBased + 1);
	};

	const sortFilters = useMemo(() => {
		return [
			{
				id: orderProp,
				desc: orderDirection !== OrderDirection.asc,
			},
		];
	}, [orderProp, orderDirection]);

	const handleSortChange = useCallback(
		(newOrderProp: string | undefined, newOrderDirection: OrderDirection | undefined) => {
			if (newOrderProp !== orderProp || newOrderDirection !== orderDirection) {
				setOrderProp(newOrderProp);
				setOrderDirection(newOrderDirection || OrderDirection.asc);
				setPage(1);
			}
		},
		// Fix ARC-964: If filters.page is included, the pagination breaks (on pagechange the pagenumber resets to 1 again)
		[orderProp, orderDirection]
	);

	const handleEditButtonClicked = (
		translationEntry: MultiLanguageTranslationEntry,
		languageCode: LanguageCode
	) => {
		setActiveTranslationEntry(translationEntry);
		setActiveTranslationLanguage(languageCode);
	};

	const getPagination = () => {
		if (!isAvo()) {
			return (
				<Pagination
					buttons={{
						next: (
							<Button
								className="u-pl-24:sm u-pl-8"
								disabled={page === pageCount}
								variants={['text', 'neutral']}
								label={tHtml(
									'modules/shared/components/pagination-bar/pagination-bar___volgende'
								)}
								iconEnd={<Icon name="angleRight" />}
							/>
						),
						previous: (
							<Button
								className="u-pr-24:sm u-pr-8"
								disabled={page === 1}
								variants={['text', 'neutral']}
								label={tHtml(
									'modules/shared/components/pagination-bar/pagination-bar___vorige'
								)}
								iconStart={<Icon name="angleLeft" />}
							/>
						),
					}}
					showFirstLastNumbers
					onPageChange={handlePageChange}
					currentPage={page - 1}
					pageCount={pageCount}
				/>
			);
		} else {
			return (
				<PaginationAvo
					pageCount={pageCount}
					onPageChange={handlePageChange}
					currentPage={page - 1}
				/>
			);
		}
	};

	const translationTableColumns = [
		{
			id: 'key',
			Header: tHtml('modules/translations/views/translations-overview-v-2___id'),
			Cell: ({ row }: { row: Row<MultiLanguageTranslationEntry> }) => {
				const translationEntry: MultiLanguageTranslationEntry = row.original;
				return (
					<>
						<div>
							<strong>{translationEntry.key}</strong>
						</div>
						<div className="u-text-muted">
							{translationEntry.component + '/' + translationEntry.location}
						</div>
					</>
				);
			},
		},
		...(allLanguages || []).map((languageInfo) => {
			return {
				id: 'value_' + languageInfo.languageCode,
				Header: languageInfo.languageLabel,
				Cell: ({ row }: { row: Row<MultiLanguageTranslationEntry> }) => {
					const translationEntry = row.original;
					const value =
						translationEntry.values[languageInfo.languageCode as LanguageCode];

					return (
						<button
							className="c-translation-overview__edit-button"
							onClick={() => {
								handleEditButtonClicked(
									translationEntry,
									languageInfo.languageCode as LanguageCode
								);
							}}
						>
							{translationEntry.value_type === ValueType.HTML && (
								<Html content={value} className="c-content"></Html>
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
						AdminConfigManager.getConfig().services.toastService.showToast({
							title: tText(
								'modules/translations/views/translations-overview-v-2___gekopieerd'
							),
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
							{activeTranslationEntry.component +
								'/' +
								activeTranslationEntry.location}
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
						value={activeTranslationEntry.values[activeTranslationLanguage]}
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
				iconEnd={<Icon name="filter" />}
				value={search}
				onChange={(e) => {
					setSearch(e.target.value);
					setPage(1);
				}}
				placeholder={tText(
					'modules/translations/views/translations-overview-v-2___zoek-op-id-of-waarde'
				)}
			></TextInput>
			{renderTranslationsTable()}
			{renderPopup({
				title: tText(
					'modules/translations/views/translations-overview-v-2___vertaling-aanpassen'
				),
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

export default TranslationsOverview as FunctionComponent<TranslationsOverviewProps>;
