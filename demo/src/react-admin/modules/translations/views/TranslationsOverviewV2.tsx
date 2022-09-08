import { orderBy } from 'lodash-es';
import React, {
	FunctionComponent,
	KeyboardEvent,
	MouseEvent,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';

import { TranslationV2 } from '../translations.types';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { OrderDirection } from '~modules/shared/types';
import { Config, ToastType } from '~core/config';
import { TranslationsService } from '../translations.service';
import {
	BlockHeading,
	ModalBody,
	ModalFooterRight,
	Toolbar,
	ToolbarLeft,
} from '@viaa/avo2-components';
import {
	Button,
	keysEnter,
	Modal,
	onKey,
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
	TRANSLATIONS_QUERY_PARAM_CONFIG,
} from '~modules/translations/translations.const';
import { sortingIcons } from '~modules/shared/components/Table/Table.const';
import { Row, TableOptions } from 'react-table';
import Loader from '../../shared/components/Loader/Loader';
import {
	convertFromDatabaseToList,
	convertFromListToDatabase,
} from '~modules/translations/helpers/database-conversions';

const TranslationsOverviewV2: FunctionComponent = () => {
	const [translations, setTranslations] = useState<TranslationV2[] | null>(null);
	const [filteredAndPaginatedTranslations, setFilteredAndPaginatedTranslations] = useState<
		TranslationV2[] | null
	>(null);
	const [filteredTranslationsCount, setFilteredTranslationsCount] = useState<number>(0);
	const [activeTranslation, setActiveTranslation] = useState<TranslationV2 | null>(null);
	const [activeTranslationEditorState, setActiveTranslationEditorState] =
		useState<RichEditorState | null>(null);

	const [filters, setFilters] = useQueryParams(TRANSLATIONS_QUERY_PARAM_CONFIG);
	const [searchTerm, setSearchTerm] = useState<string>('');

	const pageCount: number = Math.ceil(filteredTranslationsCount / ITEMS_PER_PAGE);

	const updateFilteredTranslations = useCallback(() => {
		const filteredTranslations = (translations || []).filter(
			(translation) =>
				translation.key.toLowerCase().includes(filters.search.toLowerCase()) ||
				translation.value.toLowerCase().includes(filters.search.toLowerCase())
		);
		setFilteredTranslationsCount(filteredTranslations.length);
		setFilteredAndPaginatedTranslations(
			orderBy(
				filteredTranslations.slice(
					(filters.page - 1) * ITEMS_PER_PAGE,
					Math.min(translations?.length || 0, filters.page * ITEMS_PER_PAGE)
				),
				[filters.orderProp],
				[filters.orderDirection as OrderDirection]
			)
		);
	}, [translations, filters, setFilteredTranslationsCount, setFilteredAndPaginatedTranslations]);

	const getTranslations = useCallback(async () => {
		try {
			const translationRows = convertFromDatabaseToList(
				await TranslationsService.fetchTranslations()
			);
			setTranslations(translationRows);
		} catch (err) {
			console.error(new CustomError('Failed to fetch translations', err));
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t(
					'modules/translations/views/translations-overview___error'
				),
				description: Config.getConfig().services.i18n.t(
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
		setSearchTerm(filters.search);
	}, [filters.search]);

	useEffect(() => {
		updateFilteredTranslations();
	}, [updateFilteredTranslations]);

	const saveActiveTranslation = async () => {
		try {
			if (!activeTranslation) {
				return;
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
				Config.getConfig().services.toastService.showToast({
					title: Config.getConfig().services.i18n.t(
						'modules/translations/views/translations-overview___error'
					),
					description: Config.getConfig().services.i18n.t(
						'Deze vertaling kan niet langer gevonden worden in de database. Gelieve de pagina te herladen.'
					),
					type: ToastType.ERROR,
				});
				return;
			}

			// Update value in array
			freshTranslation.value = activeTranslationEditorState?.toHTML() || '';

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

			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t(
					'modules/translations/views/translations-overview___success'
				),
				description: Config.getConfig().services.i18n.t('De vertaling is opgeslagen'),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(new CustomError('Failed to save translation', err));
			Config.getConfig().services.toastService.showToast({
				title: Config.getConfig().services.i18n.t(
					'modules/translations/views/translations-overview___error'
				),
				description: Config.getConfig().services.i18n.t(
					'Het opslaan van de vertaling is mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const handleSearchTermKeyUp = (e: KeyboardEvent) => {
		onKey(e, [...keysEnter], () => setFilters({ ...filters, search: searchTerm }));
	};

	const handleRowClick = (_event: MouseEvent<any, any>, translationRow: Row<TranslationV2>) => {
		setActiveTranslation(translationRow.original);
	};

	const handlePageChange = (newPage: number) => {
		setFilters({
			...filters,
			page: newPage,
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

			setFilters({
				...filters,
				orderProp,
				orderDirection: rules[0]
					? rules[0].desc
						? OrderDirection.desc
						: OrderDirection.asc
					: undefined,
				page: 1,
			});
		},
		[filters, setFilters]
	);

	const renderTranslationsTable = (): ReactNode => {
		if (!filteredAndPaginatedTranslations) {
			return <Loader />;
		}
		if (!filteredAndPaginatedTranslations.length) {
			return <>{Config.getConfig().services.i18n.t('Er zijn geen vertalingen gevonden')}</>;
		}

		return (
			<>
				<Table
					options={
						{
							columns: [
								{
									id: 'key',
									Header: Config.getConfig().services.i18n.t('id'),
									accessor: 'key',
									Cell: ({ row }: { row: Row<TranslationV2> }) => {
										const parts = row.original.label?.split('___');
										return (
											<>
												<div>
													<strong>{parts[0]}</strong>
												</div>
												<div>{parts[1]}</div>
											</>
										);
									},
								},
								{
									id: 'value',
									Header: Config.getConfig().services.i18n.t('Waarde'),
									accessor: 'value',
								},
								{
									Header: '',
									id: 'cp-visitors-histories-table-actions',
									Cell: ({ row }: { row: Row<TranslationV2> }) => {
										return (
											<Button
												variants={['block', 'black']}
												onClick={() => setActiveTranslation(row.original)}
												icon="edit"
												aria-label={Config.getConfig().services.i18n.t(
													'Pas deze vertaling aan: {{translationValue}}',
													{ translationValue: row.values.value }
												)}
											></Button>
										);
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
											disabled={filters.page + 1 === pageCount}
											variants={['text', 'neutral']}
											label={Config.getConfig().services.i18n.t(
												'modules/shared/components/pagination-bar/pagination-bar___volgende'
											)}
											iconEnd={<Icon name="angleRight" />}
										/>
									),
									previous: (
										<Button
											className="u-pr-24:sm u-pr-8"
											disabled={filters.page + 1 === 1}
											variants={['text', 'neutral']}
											label={Config.getConfig().services.i18n.t(
												'modules/shared/components/pagination-bar/pagination-bar___vorige'
											)}
											iconStart={<Icon name="angleLeft" />}
										/>
									),
								}}
								showFirstLastNumbers
								onPageChange={handlePageChange}
								currentPage={filters.page}
								pageCount={pageCount}
							/>
						);
					}}
				/>
			</>
		);
	};

	return (
		<>
			<Toolbar>
				<ToolbarLeft>
					<BlockHeading type="h1">
						{Config.getConfig().services.i18n.t('Vertalingen')}
					</BlockHeading>
				</ToolbarLeft>
			</Toolbar>
			<TextInput
				type="search"
				iconEnd={<Icon name="filter" />}
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				onKeyDown={handleSearchTermKeyUp}
			></TextInput>
			{renderTranslationsTable()}
			{!!activeTranslation && (
				<Modal
					isOpen={!!activeTranslation}
					title={Config.getConfig().services.i18n.t('Vertaling aanpassen')}
					onClose={() => {
						setActiveTranslation(null);
						setActiveTranslationEditorState(null);
					}}
				>
					<ModalBody>
						<div>{activeTranslation.key.split('___')[0]}</div>
						<div>
							<strong>{activeTranslation.key.split('___')[1]}</strong>
						</div>
						<RichTextEditor
							onChange={setActiveTranslationEditorState}
							state={activeTranslationEditorState || undefined}
							initialHtml={activeTranslation.value}
						></RichTextEditor>
					</ModalBody>
					<ModalFooterRight>
						<Button
							variants={['block', 'black']}
							onClick={() => saveActiveTranslation()}
							label={Config.getConfig().services.i18n.t('Bewaar wijzigingen')}
						></Button>
						<Button
							variants={['block']}
							onClick={() => {
								setActiveTranslation(null);
								setActiveTranslationEditorState(null);
							}}
							label={Config.getConfig().services.i18n.t('Annuleer')}
						></Button>
					</ModalFooterRight>
				</Modal>
			)}
		</>
	);
};

export default TranslationsOverviewV2;
