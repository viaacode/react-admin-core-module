import { IPagination } from '@studiohyperdrive/pagination';
import {
	BlockPageOverview,
	ContentItemStyle,
	ContentTabStyle,
	LabelObj,
	PageInfo,
	RenderLinkFunction,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { cloneDeep, compact, get, isNumber } from 'lodash-es';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { NumberParam, QueryParamConfig, StringParam, useQueryParams } from 'use-query-params';

import { PageOverviewOrderOptions } from '../../../const/content-block.common.consts';
import { GET_DARK_BACKGROUND_COLOR_OPTIONS } from '../../../const/content-block.common.consts';
import { ContentPageService } from '../../../services/content-page.service';
import { Color } from '../../../types/content-block.types';
import type { ContentPageInfo } from '~modules/content-page';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { ContentPageLabelService } from '~modules/content-page-labels/content-page-label.service';
import { ContentTypeAndLabelsValue } from '~modules/shared/components/ContentTypeAndLabelsPicker/ContentTypeAndLabelsPicker';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { ROUTE_PARTS } from '~modules/shared/consts/routes';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { CheckboxListParam } from '~modules/shared/helpers/query-string-converters';
import { useDebounce } from '~modules/shared/hooks/useDebounce';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

export interface ContentPageOverviewParams {
	withBlock: boolean;
	contentType: string;
	// Visible tabs in the page overview component for which we should fetch item counts
	labelIds: number[];
	// Selected tabs for which we should fetch content page items
	selectedLabelIds: number[];
	orderProp?: string;
	orderDirection?: 'asc' | 'desc';
	page: number;
	size: number;
}

interface PageOverviewWrapperProps {
	contentTypeAndTabs: ContentTypeAndLabelsValue;
	tabStyle?: ContentTabStyle;
	allowMultiple?: boolean;
	centerHeader?: boolean;
	itemStyle?: ContentItemStyle;
	showTitle?: boolean;
	showDescription?: boolean;
	showDate?: boolean;
	buttonLabel?: string;
	buttonAltTitle?: string;
	itemsPerPage?: number;
	sortOrder?: PageOverviewOrderOptions;
	headerBackgroundColor: Color;
	renderLink: RenderLinkFunction;
}

const PageOverviewWrapper: FunctionComponent<PageOverviewWrapperProps> = ({
	contentTypeAndTabs = {
		selectedContentType: 'PROJECT',
		selectedLabels: null,
	},
	tabStyle = 'MENU_BAR',
	allowMultiple = false,
	centerHeader = false,
	itemStyle = 'NEWS_LIST',
	showTitle = true,
	showDescription = true,
	showDate = false,
	buttonLabel = AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/components/page-overview-wrapper/page-overview-wrapper___lees-meer'
	),
	buttonAltTitle = '',
	itemsPerPage = 20,
	sortOrder = 'published_at__desc',
	headerBackgroundColor,
	renderLink,
}) => {
	const { tHtml, tText } = useTranslation();

	const queryParamConfig: { [queryParamId: string]: QueryParamConfig<any> } = {
		page: NumberParam,
		item: StringParam,
		label: CheckboxListParam,
	};
	const [labelObjs, setLabelObjs] = useState<LabelObj[]>([]);
	const [queryParamsState, setQueryParamsState] = useQueryParams(queryParamConfig);
	const [pages, setPages] = useState<ContentPageInfo[] | null>(null);
	const [pageCount, setPageCount] = useState<number | null>(null);
	const [labelPageCounts, setLabelPageCounts] = useState<{ [id: number]: number } | null>(null);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [selectedTabObjects, setSelectedTabObjects] = useState<LabelObj[]>([]);
	const [focusedPage, setFocusedPage] = useState<ContentPageInfo | null>(null);

	const debouncedItemsPerPage = useDebounce(itemsPerPage || 1000, 200); // Default to 1000 if itemsPerPage is zero

	const getSelectedLabelIds = (): number[] => {
		if (!contentTypeAndTabs.selectedLabels) {
			return [];
		}
		if (isNumber(contentTypeAndTabs.selectedLabels[0])) {
			// new format where we save the ids of the labels instead of the full label object
			// https://meemoo.atlassian.net/browse/AVO-1410
			return compact(contentTypeAndTabs.selectedLabels || []);
		}
		// Old format where we save the whole label object
		// TODO deprecated remove when all content pages with type overview have been resaved
		return compact(
			((contentTypeAndTabs.selectedLabels || []) as unknown as LabelObj[]).map(
				(label) => label.id
			)
		);
	};

	const fetchPages = useCallback(async () => {
		try {
			if (contentTypeAndTabs.selectedLabels && contentTypeAndTabs.selectedLabels.length) {
				setLabelObjs(
					await ContentPageLabelService.getContentPageLabelsByTypeAndIds(
						contentTypeAndTabs.selectedContentType,
						getSelectedLabelIds()
					)
				);
			}

			// Map labels in query params to label objects
			let selectedTabs: LabelObj[] = [];
			if (queryParamsState.label) {
				const queryLabels = queryParamsState.label || [];
				if (queryLabels.length) {
					selectedTabs =
						await ContentPageLabelService.getContentPageLabelsByTypeAndLabels(
							contentTypeAndTabs.selectedContentType,
							queryLabels
						);
					setSelectedTabObjects(selectedTabs);
				} else {
					selectedTabs = [];
					setSelectedTabObjects([]);
				}
			}

			let tempFocusedPage: PageInfo | undefined;
			if (queryParamsState.item) {
				const contentPage = await ContentPageService.getContentPageByPath(
					queryParamsState.item
				);
				if (contentPage) {
					setFocusedPage(contentPage);
				} else {
					console.error(
						new CustomError(
							'Failed to find content page by path to set it as the expanded item for the page overview wrapper component',
							null,
							{
								contentPage,
								path: queryParamsState.item,
							}
						)
					);

					AdminConfigManager.getConfig().services.toastService.showToast({
						title: AdminConfigManager.getConfig().services.i18n.tText(
							'modules/admin/content-page/components/wrappers/page-overview-wrapper/page-overview-wrapper___error'
						),
						description: AdminConfigManager.getConfig().services.i18n.tText(
							'admin/content-block/components/wrappers/page-overview-wrapper/page-overview-wrapper___het-opgegeven-item-kon-niet-worden-gevonden'
						),
						type: ToastType.ERROR,
					});
				}
			}

			const response: IPagination<ContentPageInfo> & { labelCounts: Record<string, number> } =
				await ContentPageService.getContentPages({
					withBlock: itemStyle === 'ACCORDION',
					contentType: contentTypeAndTabs.selectedContentType,
					labelIds: getSelectedLabelIds(),
					selectedLabelIds:
						selectedTabs && selectedTabs.length
							? selectedTabs.map((tab) => tab.id)
							: getSelectedLabelIds(),
					orderProp: sortOrder.split('__')[0],
					orderDirection: sortOrder.split('__').pop() as Avo.Search.OrderDirection,
					page: queryParamsState.page,
					size: debouncedItemsPerPage,
				});

			// Set the pages on the state after removing the page that will be shown at the top (?item=/path)
			setPages(response.items.filter((page) => page.id !== get(tempFocusedPage, 'id')));
			setPageCount(response.pages);
			setLabelPageCounts(response.labelCounts);
		} catch (err) {
			console.error(
				new CustomError('Failed to fetch pages', err, {
					query: 'GET_CONTENT_PAGES',
					variables: {
						page: queryParamsState.page,
						size: debouncedItemsPerPage,
					},
				})
			);
			setLoadingInfo({
				state: 'error',
				message: tHtml(
					'admin/content-block/components/page-overview-wrapper/page-overview-wrapper___het-ophalen-van-de-paginas-is-mislukt'
				),
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		itemStyle,
		queryParamsState,
		debouncedItemsPerPage,
		setPages,
		setPageCount,
		sortOrder,
		contentTypeAndTabs.selectedContentType,
		// Deep compare by value and not by ref
		// https://github.com/facebook/react/issues/14476#issuecomment-471199055
		// eslint-disable-next-line react-hooks/exhaustive-deps
		JSON.stringify(contentTypeAndTabs.selectedLabels),
		tHtml,
	]);

	useEffect(() => {
		fetchPages();
	}, [fetchPages]);

	useEffect(() => {
		if (pages && pageCount) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [pages, pageCount]);

	const handleCurrentPageChanged = (pageIndex: number) => {
		setQueryParamsState((oldQueryParamState) => {
			return {
				...cloneDeep(oldQueryParamState),
				page: pageIndex,
				item: undefined,
			};
		});
		setFocusedPage(null);
	};

	const handleSelectedTabsChanged = (tabs: LabelObj[]) => {
		setQueryParamsState((oldQueryParamState) => {
			return {
				...cloneDeep(oldQueryParamState),
				label: tabs.map((tab) => tab.label),
				page: 0,
				item: undefined,
			};
		});
	};

	const getLabelsWithContent = () => {
		return (labelObjs || []).filter(
			(labelObj: LabelObj) => (labelPageCounts || {})[labelObj.id] > 0
		);
	};

	/**
	 * @deprecated TODO replace PageInfo with ContentPageInfo in avo2-components so the same interface is used for admin-core-ui, avo2-client and avo2-components and all mapping is handled in the backend (admin-core-api)
	 * @param contentPage
	 */
	const convertToPageOverviewContentPage = (contentPage: ContentPageInfo): PageInfo => {
		return {
			id: contentPage.id,
			title: contentPage.title,
			description: contentPage.description,
			blocks: contentPage.content_blocks,
			path: contentPage.path as string,
			content_width: contentPage.contentWidth as Avo.ContentPage.Width,
			labels: contentPage.labels,
			created_at: contentPage.createdAt,
			thumbnail_path: contentPage.thumbnailPath as string,
		};
	};

	const renderPageOverviewBlock = () => {
		return (
			<BlockPageOverview
				tabs={getLabelsWithContent()}
				darkTabs={
					!!headerBackgroundColor &&
					GET_DARK_BACKGROUND_COLOR_OPTIONS().includes(headerBackgroundColor)
				}
				selectedTabs={selectedTabObjects}
				onSelectedTabsChanged={handleSelectedTabsChanged}
				currentPage={queryParamsState.page}
				onCurrentPageChanged={handleCurrentPageChanged}
				pageCount={pageCount || 1}
				pages={(pages || []).map(convertToPageOverviewContentPage)}
				tabStyle={tabStyle}
				itemStyle={itemStyle}
				allowMultiple={allowMultiple}
				centerHeader={centerHeader}
				showTitle={showTitle}
				showDescription={showDescription}
				showDate={showDate}
				dateString={tText(
					'admin/content-block/components/page-overview-wrapper/page-overview-wrapper___geplaatst-label-op-date'
				)}
				allLabel={tText(
					'admin/content-block/components/page-overview-wrapper/page-overview-wrapper___alle'
				)}
				noLabel={tText(
					'admin/content-block/components/page-overview-wrapper/page-overview-wrapper___overige'
				)}
				buttonLabel={buttonLabel}
				buttonAltTitle={buttonAltTitle}
				focusedPage={focusedPage ? convertToPageOverviewContentPage(focusedPage) : null}
				getLabelLink={(label: string) => {
					return `/${ROUTE_PARTS.news}?label=${encodeURIComponent(label)}`;
				}}
				renderLink={renderLink}
			/>
		);
	};

	return (
		<LoadingErrorLoadedComponent
			loadingInfo={loadingInfo}
			dataObject={pages}
			render={renderPageOverviewBlock}
		/>
	);
};

export default PageOverviewWrapper;
