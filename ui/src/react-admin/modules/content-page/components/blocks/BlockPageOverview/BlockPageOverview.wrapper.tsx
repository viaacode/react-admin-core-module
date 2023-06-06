import { IconName } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { cloneDeep, compact, isNil, isNumber, isString, sortBy } from 'lodash-es';
import { FunctionComponent, useEffect } from 'react';
import { NumberParam, QueryParamConfig, StringParam, useQueryParams } from 'use-query-params';
import {
	ContentItemStyle,
	LabelObj,
} from '~content-blocks/BlockPageOverview/BlockPageOverview.types';

import { AdminConfigManager } from '~core/config';
import {
	BlockPageOverview,
	PageOverviewWrapperProps,
} from '~modules/content-page/components/blocks';
import { GET_DARK_BACKGROUND_COLOR_OPTIONS } from '~modules/content-page/const/get-color-options';
import { useGetContentPageByPath } from '~modules/content-page/hooks/use-get-content-page-by-path';
import { useGetContentPageLabelsByTypeAndIds } from '~modules/content-page/hooks/use-get-content-page-labels-by-type-and-ids';
import { useGetContentPageLabelsByTypeAndLabels } from '~modules/content-page/hooks/use-get-content-page-labels-by-type-and-labels';
import { useGetContentPagesOverview } from '~modules/content-page/hooks/use-get-content-pages-overview';
import { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { ErrorView } from '~shared/components/error';
import { CheckboxListParam } from '~shared/helpers/query-string-converters';
import { useDebounce } from '~shared/hooks/useDebounce';
import { useTranslation } from '~shared/hooks/useTranslation';

export const BlockPageOverviewWrapper: FunctionComponent<PageOverviewWrapperProps> = ({
	contentTypeAndTabs = {
		selectedContentType: 'PROJECT',
		selectedLabels: null,
	},
	tabStyle = 'MENU_BAR',
	allowMultiple = false,
	centerHeader = false,
	itemStyle = ContentItemStyle.NEWS_LIST,
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
	commonUser,
}) => {
	const { tText } = useTranslation();

	const queryParamConfig: { [queryParamId: string]: QueryParamConfig<any> } = {
		page: NumberParam,
		item: StringParam,
		label: CheckboxListParam,
	};
	const [queryParamsState, setQueryParamsState] = useQueryParams(queryParamConfig);

	const debouncedItemsPerPage = useDebounce(itemsPerPage || 1000, 200); // Default to 1000 if itemsPerPage is zero

	const getSelectedLabelIds = (): number[] | string[] => {
		if (!contentTypeAndTabs.selectedLabels) {
			return [];
		}
		if (
			isNumber(contentTypeAndTabs.selectedLabels[0]) ||
			isString(contentTypeAndTabs.selectedLabels[0])
		) {
			// new format where we save the ids of the labels instead of the full label object
			// https://meemoo.atlassian.net/browse/AVO-1410
			return compact((contentTypeAndTabs.selectedLabels || []) as any[]);
		}
		// Old format where we save the whole label object
		// TODO deprecated remove when all content pages with type overview have been resaved
		return compact(
			((contentTypeAndTabs.selectedLabels || []) as unknown as LabelObj[]).map(
				(label) => label.id
			)
		);
	};

	const { data: labelObjs, isFetching: isLoadingLabelObjs } = useGetContentPageLabelsByTypeAndIds(
		{
			selectedContentType: contentTypeAndTabs.selectedContentType,
			getSelectedLabelIds: getSelectedLabelIds(),
		},
		{ enabled: (contentTypeAndTabs?.selectedLabels?.length || 0) > 0, keepPreviousData: true }
	);

	const { data: selectedTabObjects, isFetching: isLoadingSelectedTabObjects } =
		useGetContentPageLabelsByTypeAndLabels(
			{
				selectedContentType: contentTypeAndTabs.selectedContentType,
				queryLabels: queryParamsState.label || [],
			},
			{ keepPreviousData: true }
		);

	const { data: focusedPage, isFetching: isLoadingFocusedPage } = useGetContentPageByPath(
		queryParamsState.item,
		{ keepPreviousData: true }
	);

	const {
		data: pagesAndLabels,
		isFetching: isLoadingPagesAndLabels,
		error: errorPagesAndLabels,
		isInitialLoading,
	} = useGetContentPagesOverview(
		{
			withBlocks:
				itemStyle === ContentItemStyle.ACCORDION ||
				itemStyle === ContentItemStyle.ACCORDION_TWO_LEVELS,
			contentType: contentTypeAndTabs.selectedContentType,
			labelIds: getSelectedLabelIds(),
			selectedLabelIds:
				selectedTabObjects && selectedTabObjects.length
					? selectedTabObjects.map((tab) => tab.id)
					: getSelectedLabelIds(),
			orderProp: sortOrder.split('__')[0],
			orderDirection: sortOrder.split('__').pop() as Avo.Search.OrderDirection,
			offset:
				itemStyle === ContentItemStyle.ACCORDION_TWO_LEVELS
					? 0
					: queryParamsState.page * debouncedItemsPerPage,
			limit:
				itemStyle === ContentItemStyle.ACCORDION_TWO_LEVELS ? 500 : debouncedItemsPerPage,
		},
		{ keepPreviousData: true }
	);

	const pages = pagesAndLabels?.items;
	const pageCount = pagesAndLabels?.pages;
	const labelPageCounts = pagesAndLabels?.labelCounts;

	useEffect(() => {
		if (!isInitialLoading) {
			const { label, item } = queryParamsState;

			if (isNil(label) && isNil(item)) {
				return;
			}

			const selector =
				!isNil(label) && !isNil(item)
					? '.c-content-page-overview-block__accordion--first-level:not(.c-accordion--closed) .c-content-page-overview-block__accordion--second-level:not(.c-accordion--closed)'
					: '.c-content-page-overview-block__accordion--first-level:not(.c-accordion--closed)';

			setTimeout(() => {
				const $el = document.querySelector(selector);
				$el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
			}, 100);
		}
		// We only want to trigger a scroll down when the page loads, not when the query params change when a user clicks another page
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInitialLoading]);

	const handleCurrentPageChanged = (pageIndex: number) => {
		setQueryParamsState((oldQueryParamState) => {
			return {
				...cloneDeep(oldQueryParamState),
				page: pageIndex,
				item: undefined,
			};
		});
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

	const handleFocusedPageChanged = (newFocusedPage: ContentPageInfo | null) => {
		setQueryParamsState((oldQueryParamState) => {
			return {
				...cloneDeep(oldQueryParamState),
				page: 0,
				item: newFocusedPage?.path,
			};
		});
	};

	const getLabelsWithContent = () => {
		const labelsWithAtLeastOnePage = (labelObjs || []).filter(
			(labelObj: LabelObj) => (labelPageCounts || {})[labelObj.id] > 0
		);
		// Sort labels in the order they were entered in the admin-core content page editor:
		// https://meemoo.atlassian.net/browse/ARC-1443?focusedCommentId=40802
		const labelIds = (contentTypeAndTabs.selectedLabels || []).map((labelId) =>
			String(labelId)
		);
		return sortBy(labelsWithAtLeastOnePage, (labelObj) =>
			labelIds.indexOf(String(labelObj.id))
		);
	};

	const renderPageOverviewBlock = () => {
		return (
			<BlockPageOverview
				tabs={getLabelsWithContent()}
				darkTabs={
					!!headerBackgroundColor &&
					GET_DARK_BACKGROUND_COLOR_OPTIONS().includes(headerBackgroundColor)
				}
				selectedTabs={selectedTabObjects || []}
				onSelectedTabsChanged={handleSelectedTabsChanged}
				currentPage={queryParamsState.page}
				onCurrentPageChanged={handleCurrentPageChanged}
				pageCount={pageCount || 1}
				pages={pages ?? []}
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
				focusedPage={focusedPage ?? null}
				onFocusedPageChanged={handleFocusedPageChanged}
				getLabelLink={(label: string) => {
					return `/${AdminConfigManager.getAdminRoute('NEWS')}?label=${encodeURIComponent(
						label
					)}`;
				}}
				renderLink={renderLink}
				commonUser={commonUser}
				isLoadingLabelObjs={isLoadingLabelObjs}
				isLoadingSelectedTabObjects={isLoadingSelectedTabObjects}
				isLoadingFocusedPage={isLoadingFocusedPage}
				isLoadingPagesAndLabels={isLoadingPagesAndLabels}
			/>
		);
	};

	if (errorPagesAndLabels) {
		return (
			<ErrorView
				icon={'alertTriangle' as IconName}
				message={AdminConfigManager.getConfig().services.i18n.tHtml(
					'react-admin/modules/content-page/components/blocks/block-page-overview/block-page-overview___error'
				)}
			>
				<p>
					{AdminConfigManager.getConfig().services.i18n.tHtml(
						'admin/content-block/components/page-overview-wrapper/page-overview-wrapper___het-ophalen-van-de-paginas-is-mislukt'
					)}
				</p>
			</ErrorView>
		);
	}
	return renderPageOverviewBlock();
};
