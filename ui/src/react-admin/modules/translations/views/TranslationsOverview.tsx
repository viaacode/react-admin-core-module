import { Pagination as PaginationAvo } from '@viaa/avo2-components';
import { orderBy, snakeCase } from 'lodash-es';
import { decode as decodeHtmlEntities } from 'html-entities';
import React, {
	FunctionComponent,
	MouseEvent,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { isAvo } from '~shared/helpers/is-avo';

import {
	Translation,
	TranslationContextName,
	TranslationsOverviewProps,
} from '../translations.types';
import { CustomError } from '~shared/helpers/custom-error';
import { OrderDirection } from '~shared/types';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { TranslationsService } from '../translations.service';
import {
	Button,
	Pagination,
	RichEditorState,
	RichTextEditor,
	Table,
	TextInput,
} from '@meemoo/react-components';
import { Icon } from '~shared/components';
import { useQueryParams } from 'use-query-params';
import {
	RICH_TEXT_EDITOR_OPTIONS,
	TRANSLATIONS_PER_PAGE,
	TRANSLATIONS_QUERY_PARAM_CONFIG,
} from '~modules/translations/translations.const';
import { sortingIcons } from '~shared/components/Table/Table.const';
import { Row, TableOptions } from 'react-table';
import Loader from '../../shared/components/Loader/Loader';
import {
	convertFromDatabaseToList,
	convertFromListToDatabase,
	getKeyPrefix,
} from '~modules/translations/helpers/database-conversions';
import Html from '~shared/components/Html/Html';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from '~shared/hooks/useTranslation';

const TranslationsOverview: FunctionComponent<TranslationsOverviewProps> = ({
	className,
	renderPopup,
}) => {
	const { tHtml, tText } = useTranslation();

	const [translations, setTranslations] = useState<Translation[]>([]);

	const [filteredAndPaginatedTranslations, setFilteredAndPaginatedTranslations] = useState<
		Translation[] | null
	>(null);
	const [filteredTranslationsCount, setFilteredTranslationsCount] = useState<number>(0);
	const [activeTranslation, setActiveTranslation] = useState<Translation | null>(null);
	const [activeTranslationEditorState, setActiveTranslationEditorState] =
		useState<RichEditorState | null>(null);

	const [filters, setFilters] = useQueryParams(TRANSLATIONS_QUERY_PARAM_CONFIG);

	const pageCount: number = Math.ceil(filteredTranslationsCount / TRANSLATIONS_PER_PAGE);

	const updateFilteredTranslations = useCallback(() => {
		const filteredTranslations = (translations || []).filter(
			(translation) =>
				translation.key.toLowerCase().includes(filters.search.toLowerCase()) ||
				translation.value.toLowerCase().includes(filters.search.toLowerCase())
		);
		setFilteredTranslationsCount(filteredTranslations.length);

		const orderedTranslations = orderBy(
			filteredTranslations,
			[filters.orderProp],
			[filters.orderDirection as OrderDirection]
		);
		const paginatedTranslations = orderedTranslations.slice(
			(filters.page - 1) * TRANSLATIONS_PER_PAGE,
			Math.min(translations?.length || 0, filters.page * TRANSLATIONS_PER_PAGE)
		);
		setFilteredAndPaginatedTranslations(paginatedTranslations);
	}, [translations, filters, setFilteredTranslationsCount, setFilteredAndPaginatedTranslations]);

	const getTranslations = useCallback(async () => {
		try {
			const allTranslations = await TranslationsService.fetchTranslations();
			const translationRows = convertFromDatabaseToList(allTranslations);
			setTranslations(translationRows);
		} catch (err) {
			console.error(new CustomError('Failed to fetch translations', err));
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: tText('modules/translations/views/translations-overview___error'),
				description: tText(
					'admin/translations/views/translations-overview___het-ophalen-van-de-vertalingen-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	}, [setTranslations, tText]);

	useEffect(() => {
		getTranslations();
	}, [getTranslations]);

	useEffect(() => {
		updateFilteredTranslations();
	}, [updateFilteredTranslations]);

	const saveActiveTranslation = async () => {
		try {
			if (!activeTranslation) {
				throw new Error('Active translation is not defined, failed to save translation');
			}

			// Fetch database translations and convert to list of objects
			const allTranslations = await TranslationsService.fetchTranslations();
			const freshTranslations = convertFromDatabaseToList(allTranslations);

			// Find the current translations
			const freshTranslation = freshTranslations.find(
				(trans) =>
					trans.context === activeTranslation.context &&
					trans.key === activeTranslation.key
			);
			if (!freshTranslation) {
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: tText('modules/translations/views/translations-overview___error'),
					description: tText(
						'modules/translations/views/translations-overview-v-2___deze-vertaling-kan-niet-langer-gevonden-worden-in-de-database-gelieve-de-pagina-te-herladen'
					),
					type: ToastType.ERROR,
				});
				return;
			}

			// Update value in array
			const newTranslationValue = activeTranslationEditorState?.toHTML() || '';
			const newTranslationValueWithoutWrappingP = newTranslationValue
				.replace(/<p>/g, '')
				.replace(/<\/p>/g, '');
			if (
				newTranslationValue.length ===
				(newTranslationValueWithoutWrappingP + '<p></p>').length
			) {
				// There was only one p tag in the translation, so we can safely delete it.
				freshTranslation.value = newTranslationValueWithoutWrappingP;
			} else {
				// There are multiple p tags in the translation, so we cannot delete them
				freshTranslation.value = newTranslationValue;
			}

			// Convert array back to database format
			const dbTranslations = convertFromListToDatabase(freshTranslations);
			const dbTranslationContext = dbTranslations.find(
				(dbTrans) => dbTrans.name === activeTranslation.context
			);

			if (!dbTranslationContext?.value) {
				throw new CustomError('Failed to find translation context', null, {
					context: activeTranslation.context,
				});
			}

			// Only update the translations in the context that was changed
			await TranslationsService.updateTranslations(
				activeTranslation.context,
				dbTranslationContext?.value
			);

			await getTranslations();

			setActiveTranslation(null);
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

	const handleRowClick = (_event: MouseEvent<any, any>, translationRow: Row<Translation>) => {
		setActiveTranslation({
			...translationRow.original,
			context: snakeCase(
				translationRow.original.context
			).toUpperCase() as TranslationContextName,
		});
	};

	const handlePageChange = (newPageZeroBased: number) => {
		setFilters({
			...filters,
			page: newPageZeroBased + 1,
		});
	};

	const sortFilters = useMemo(() => {
		return [
			{
				id: filters.orderProp,
				desc: filters.orderDirection !== OrderDirection.asc,
			},
		];
	}, [filters]);

	const handleSortChange = useCallback(
		(orderProp: string | undefined, orderDirection: string | undefined) => {
			if (filters.orderProp !== orderProp || filters.orderDirection !== orderDirection) {
				setFilters({
					...filters,
					orderProp,
					orderDirection,
					page: 1,
				});
			}
		},
		// Fix ARC-964: If filters.page is included, the pagination breaks (on pagechange the pagenumber resets to 1 again)
		[filters.search, filters.orderDirection, filters.orderProp, setFilters]
	);

	const getPagination = () => {
		if (!isAvo()) {
			return (
				<Pagination
					buttons={{
						next: (
							<Button
								className="u-pl-24:sm u-pl-8"
								disabled={filters.page === pageCount}
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
								disabled={filters.page === 1}
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
					currentPage={filters.page - 1}
					pageCount={pageCount}
				/>
			);
		} else {
			return (
				<PaginationAvo
					pageCount={pageCount}
					onPageChange={handlePageChange}
					currentPage={filters.page - 1}
				/>
			);
		}
	};

	const renderTranslationsTable = (): ReactNode => {
		if (!filteredAndPaginatedTranslations) {
			return <Loader />;
		}
		if (!filteredAndPaginatedTranslations.length) {
			return (
				<>
					{tHtml(
						'modules/translations/views/translations-overview-v-2___er-zijn-geen-vertalingen-gevonden'
					)}
				</>
			);
		}
		return (
			<>
				<Table
					options={
						{
							columns: [
								{
									id: 'key',
									Header: tHtml(
										'modules/translations/views/translations-overview-v-2___id'
									),
									accessor: 'key',
									Cell: ({ row }: { row: Row<Translation> }) => {
										const parts = row.original.label?.split('___') || [];
										return (
											<>
												<div>
													<strong>{parts[1]}</strong>
												</div>
												<div className="u-text-muted">{parts[0]}</div>
											</>
										);
									},
								},
								{
									id: 'value',
									Header: tHtml(
										'modules/translations/views/translations-overview-v-2___waarde'
									),
									accessor: 'value',
									Cell: ({ row }: { row: Row<Translation> }) => {
										return (
											<Html
												content={row.original.value}
												className="c-content"
											></Html>
										);
									},
								},
								{
									Header: '',
									id: 'cp-visitors-histories-table-actions',
									Cell: () => {
										return <Icon name="edit"></Icon>;
									},
								},
							],
							data: filteredAndPaginatedTranslations,
							initialState: {
								pageSize: TRANSLATIONS_PER_PAGE,
								sortBy: sortFilters,
							},
						} as TableOptions<any>
					}
					onSortChange={handleSortChange}
					sortingIcons={sortingIcons}
					onRowClick={handleRowClick}
					pagination={getPagination}
				/>
			</>
		);
	};

	const renderPopupBody = () => {
		if (!activeTranslation) {
			return null;
		}
		return (
			<>
				<CopyToClipboard
					text={
						activeTranslation.context.replace(getKeyPrefix(), '') +
						'___' +
						activeTranslation.key
					}
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
							<strong>{activeTranslation.key.split('___')[1]}</strong>
						</div>
						<div className="u-text-muted">{activeTranslation.key.split('___')[0]}</div>
					</Button>
				</CopyToClipboard>
				<RichTextEditor
					onChange={setActiveTranslationEditorState}
					state={activeTranslationEditorState || undefined}
					initialHtml={
						activeTranslation.value.includes('<')
							? activeTranslation.value
							: decodeHtmlEntities(activeTranslation.value)
					}
					controls={RICH_TEXT_EDITOR_OPTIONS}
				></RichTextEditor>
			</>
		);
	};

	if (!translations) {
		return <CenteredSpinner />;
	}
	return (
		<div className={className}>
			<TextInput
				type="search"
				iconEnd={<Icon name="filter" />}
				value={filters.search}
				onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
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
				isOpen: !!activeTranslation,
				onSave: saveActiveTranslation,
				onClose: () => {
					setActiveTranslation(null);
					setActiveTranslationEditorState(null);
				},
			})}
		</div>
	);
};

export default TranslationsOverview as FunctionComponent<TranslationsOverviewProps>;
