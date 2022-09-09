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

import { TranslationsOverviewV2Props, TranslationV2 } from '../translations.types';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { OrderDirection } from '~modules/shared/types';
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
import { Icon } from '~modules/shared/components';
import { useQueryParams } from 'use-query-params';
import {
	ITEMS_PER_PAGE,
	RICH_TEXT_EDITOR_OPTIONS,
	TRANSLATIONS_QUERY_PARAM_CONFIG,
} from '~modules/translations/translations.const';
import { sortingIcons } from '~modules/shared/components/Table/Table.const';
import { Row, TableOptions } from 'react-table';
import Loader from '../../shared/components/Loader/Loader';
import {
	convertFromDatabaseToList,
	convertFromListToDatabase,
} from '~modules/translations/helpers/database-conversions';
import Html from '~modules/shared/components/Html/Html';

export const TranslationsOverviewV2: FunctionComponent<TranslationsOverviewV2Props> = ({
	className,
	renderPopup,
}) => {
	const [translations, setTranslations] = useState<TranslationV2[] | null>(null);
	const [filteredAndPaginatedTranslations, setFilteredAndPaginatedTranslations] = useState<
		TranslationV2[] | null
	>(null);
	const [filteredTranslationsCount, setFilteredTranslationsCount] = useState<number>(0);
	const [activeTranslation, setActiveTranslation] = useState<TranslationV2 | null>(null);
	const [activeTranslationEditorState, setActiveTranslationEditorState] =
		useState<RichEditorState | null>(null);

	const [filters, setFilters] = useQueryParams(TRANSLATIONS_QUERY_PARAM_CONFIG);

	const pageCount: number = Math.ceil(filteredTranslationsCount / ITEMS_PER_PAGE);

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
			(filters.page - 1) * ITEMS_PER_PAGE,
			Math.min(translations?.length || 0, filters.page * ITEMS_PER_PAGE)
		);
		setFilteredAndPaginatedTranslations(paginatedTranslations);
	}, [translations, filters, setFilteredTranslationsCount, setFilteredAndPaginatedTranslations]);

	const getTranslations = useCallback(async () => {
		try {
			const translationRows = convertFromDatabaseToList(
				await TranslationsService.fetchTranslations()
			);
			setTranslations(translationRows);
		} catch (err) {
			console.error(new CustomError('Failed to fetch translations', err));
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.t(
					'modules/translations/views/translations-overview___error'
				),
				description: AdminConfigManager.getConfig().services.i18n.t(
					'admin/translations/views/translations-overview___het-ophalen-van-de-vertalingen-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	}, [setTranslations]);

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
			const freshTranslations = convertFromDatabaseToList(
				await TranslationsService.fetchTranslations()
			);

			// Find the current translations
			const freshTranslation = freshTranslations.find(
				(trans) =>
					trans.context === activeTranslation.context &&
					trans.key === activeTranslation.key
			);
			if (!freshTranslation) {
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: AdminConfigManager.getConfig().services.i18n.t(
						'modules/translations/views/translations-overview___error'
					),
					description: AdminConfigManager.getConfig().services.i18n.t(
						'Deze vertaling kan niet langer gevonden worden in de database. Gelieve de pagina te herladen.'
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

			// Only update the translations in the context that was changed
			await TranslationsService.updateTranslations(
				activeTranslation.context,
				dbTranslationContext
			);

			await getTranslations();

			setActiveTranslation(null);
			setActiveTranslationEditorState(null);

			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.t(
					'modules/translations/views/translations-overview___success'
				),
				description: AdminConfigManager.getConfig().services.i18n.t(
					'De vertaling is opgeslagen'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(new CustomError('Failed to save translation', err));
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.t(
					'modules/translations/views/translations-overview___error'
				),
				description: AdminConfigManager.getConfig().services.i18n.t(
					'Het opslaan van de vertaling is mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const handleRowClick = (_event: MouseEvent<any, any>, translationRow: Row<TranslationV2>) => {
		setActiveTranslation(translationRow.original);
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
		(rules) => {
			const orderProp = rules[0]?.id || undefined;
			const orderDirection = rules[0]?.desc ? OrderDirection.desc : OrderDirection.asc;

			if (filters.orderProp !== orderProp || filters.orderDirection !== orderDirection) {
				setFilters({
					...filters,
					orderProp,
					orderDirection,
					page: 1,
				});
			}
		},
		[filters, setFilters]
	);

	const renderTranslationsTable = (): ReactNode => {
		if (!filteredAndPaginatedTranslations) {
			return <Loader />;
		}
		if (!filteredAndPaginatedTranslations.length) {
			return (
				<>
					{AdminConfigManager.getConfig().services.i18n.t(
						'Er zijn geen vertalingen gevonden'
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
									Header: AdminConfigManager.getConfig().services.i18n.t('id'),
									accessor: 'key',
									Cell: ({ row }: { row: Row<TranslationV2> }) => {
										const parts = row.original.label?.split('___');
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
									Header: AdminConfigManager.getConfig().services.i18n.t(
										'Waarde'
									),
									accessor: 'value',
									Cell: ({ row }: { row: Row<TranslationV2> }) => {
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
								pageSize: ITEMS_PER_PAGE,
								sortBy: sortFilters,
							},
						} as TableOptions<any>
					}
					onSortChange={handleSortChange}
					sortingIcons={sortingIcons}
					onRowClick={handleRowClick}
					pagination={() => {
						return (
							<Pagination
								buttons={{
									next: (
										<Button
											className="u-pl-24:sm u-pl-8"
											disabled={filters.page === pageCount}
											variants={['text', 'neutral']}
											label={AdminConfigManager.getConfig().services.i18n.t(
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
											label={AdminConfigManager.getConfig().services.i18n.t(
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
					}}
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
				<div>
					<strong>{activeTranslation.key.split('___')[1]}</strong>
				</div>
				<div className="u-text-muted">{activeTranslation.key.split('___')[0]}</div>
				<RichTextEditor
					onChange={setActiveTranslationEditorState}
					state={activeTranslationEditorState || undefined}
					initialHtml={activeTranslation.value}
					controls={RICH_TEXT_EDITOR_OPTIONS}
				></RichTextEditor>
			</>
		);
	};

	return (
		<div className={className}>
			<TextInput
				type="search"
				iconEnd={<Icon name="filter" />}
				value={filters.search}
				onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
				placeholder={AdminConfigManager.getConfig().services.i18n.t('Zoek op id of waarde')}
			></TextInput>
			{renderTranslationsTable()}
			{renderPopup({
				title: AdminConfigManager.getConfig().services.i18n.t('Vertaling aanpassen'),
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
