import type { IconName } from '@viaa/avo2-components';
import { AvoContentPageType, type AvoSearchOrderDirection } from '@viaa/avo2-types';
import { compact, isNil, isString, sortBy } from 'es-toolkit';
import { type FunctionComponent, useCallback, useEffect } from 'react';
import type { LabelObj } from '~content-blocks/BlockPageOverview/BlockPageOverview.types';
import { ContentItemStyle } from '~content-blocks/BlockPageOverview/BlockPageOverview.types';
import { AdminConfigManager } from '~core/config/config.class';
import { BlockPageOverview } from '~modules/content-page/components/blocks/BlockPageOverview/BlockPageOverview';
import type { PageOverviewWrapperProps } from '~modules/content-page/components/blocks/BlockPageOverview/BlockPageOverview.types';
import { GET_DARK_BACKGROUND_COLOR_OPTIONS } from '~modules/content-page/const/get-color-options';
import { useGetContentPageByLanguageAndPath } from '~modules/content-page/hooks/use-get-content-page-by-language-and-path';
import { useGetContentPageLabelsByTypeAndIds } from '~modules/content-page/hooks/use-get-content-page-labels-by-type-and-ids';
import { useGetContentPageLabelsByTypeAndLabels } from '~modules/content-page/hooks/use-get-content-page-labels-by-type-and-labels';
import { useGetContentPagesForPageOverviewBlock } from '~modules/content-page/hooks/use-get-content-pages-for-page-overview-block';
import type { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { Locale } from '~modules/translations/translations.core.types';
import { ErrorView } from '~shared/components/error/ErrorView';
import { navigateFunc } from '~shared/helpers/navigate-fnc';
import {
	CheckboxListParam,
	NumberParam,
	StringParam,
} from '~shared/helpers/routing/query-string-converters';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { useDebounce } from '~shared/hooks/useDebounce';

export const BlockPageOverviewWrapper: FunctionComponent<PageOverviewWrapperProps> = ({
	contentTypeAndTabs = {
		selectedContentType: AvoContentPageType.PROJECT,
		selectedLabels: null,
	},
	tabStyle = 'MENU_BAR',
	allowMultiple = false,
	centerHeader = false,
	itemStyle = ContentItemStyle.NEWS_LIST,
	itemAlignment = 'left',
	imageItemAlignment = 'center',
	showSectionTitle = true,
	showTitle = true,
	showDescription = true,
	showDate = false,
	buttonLabel = tText(
		'admin/content-block/components/page-overview-wrapper/page-overview-wrapper___lees-meer'
	),
	buttonAltTitle = '',
	itemsPerPage = 20,
	sortOrder = 'published_at__desc',
	headerBackgroundColor,
	renderLink,
}) => {
	const getQueryParams = useCallback(() => {
		const queryParams = new URLSearchParams(location.search);
		return {
			page: NumberParam.decode(queryParams.get('page') || undefined),
			item: StringParam.decode(queryParams.get('item') || undefined),
			label: CheckboxListParam.decode(queryParams.get('label') || undefined),
		};
	}, []);
	const setQueryParam = (url: URL, name: string, value: string) => {
		if (value) {
			url.searchParams.set(name, value);
		} else {
			url.searchParams.delete(name);
		}
	};
	const setQueryParams = async (newParams: { page?: number; item?: string; label?: string[] }) => {
		const url = new URL(window.location.href);
		if (Object.keys(newParams).includes('page')) {
			setQueryParam(url, 'page', NumberParam.encode(newParams.page) as string);
		}
		if (newParams.item) {
			setQueryParam(url, 'item', StringParam.encode(newParams.item) as string);
		}
		if (newParams.label) {
			setQueryParam(url, 'label', CheckboxListParam.encode(newParams.label) as string);
		}
		await navigateFunc(url.toString(), { replace: true });
	};

	const debouncedItemsPerPage = useDebounce(itemsPerPage || 1000, 200); // Default to 1000 if itemsPerPage is zero

	const getSelectedLabelIds = (): number[] | string[] => {
		if (!contentTypeAndTabs.selectedLabels) {
			return [];
		}
		if (
			typeof contentTypeAndTabs.selectedLabels[0] === 'number' ||
			isString(contentTypeAndTabs.selectedLabels[0])
		) {
			// new format where we save the ids of the labels instead of the full label object
			// https://meemoo.atlassian.net/browse/AVO-1410
			// biome-ignore lint/suspicious/noExplicitAny: todo
			return compact((contentTypeAndTabs.selectedLabels || []) as any[]);
		}
		// Old format where we save the whole label object
		// TODO deprecated remove when all content pages with type overview have been resaved
		return compact(
			((contentTypeAndTabs.selectedLabels || []) as unknown as LabelObj[]).map((label) => label.id)
		);
	};

	const { data: labelObjs, isFetching: isLoadingLabelObjs } = useGetContentPageLabelsByTypeAndIds(
		{
			selectedContentType: contentTypeAndTabs.selectedContentType,
			getSelectedLabelIds: getSelectedLabelIds(),
		},
		{
			enabled: (contentTypeAndTabs?.selectedLabels?.length || 0) > 0,
		}
	);

	const { data: selectedTabObjects, isFetching: isLoadingSelectedTabObjects } =
		useGetContentPageLabelsByTypeAndLabels({
			selectedContentType: contentTypeAndTabs.selectedContentType,
			queryLabels: getQueryParams().label || [],
		});

	const { data: focusedPage, isFetching: isLoadingFocusedPage } =
		useGetContentPageByLanguageAndPath(
			AdminConfigManager.getConfig().locale || Locale.Nl,
			getQueryParams().item as string,
			{
				enabled: !!getQueryParams().item,
			}
		);

	const {
		data: pagesAndLabels,
		isFetching: isLoadingPagesAndLabels,
		error: errorPagesAndLabels,
		isInitialLoading,
	} = useGetContentPagesForPageOverviewBlock({
		withBlocks:
			itemStyle === ContentItemStyle.ACCORDION ||
			itemStyle === ContentItemStyle.ACCORDION_TWO_LEVELS,
		contentType: contentTypeAndTabs.selectedContentType,
		labelIds: getSelectedLabelIds(),
		selectedLabelIds: selectedTabObjects?.length
			? selectedTabObjects.map((tab) => tab.id)
			: getSelectedLabelIds(),
		orderProp: sortOrder.split('__')[0],
		orderDirection: sortOrder.split('__').pop() as AvoSearchOrderDirection,
		offset:
			itemStyle === ContentItemStyle.ACCORDION_TWO_LEVELS
				? 0
				: (getQueryParams().page || 0) * debouncedItemsPerPage,
		limit: itemStyle === ContentItemStyle.ACCORDION_TWO_LEVELS ? 500 : debouncedItemsPerPage,
	});

	const pages = pagesAndLabels?.items;
	const pageCount = pagesAndLabels?.pages;
	const labelPageCounts = pagesAndLabels?.labelCounts;

	useEffect(() => {
		if (!isInitialLoading) {
			if (isNil(getQueryParams().label) && isNil(getQueryParams().item)) {
				return;
			}

			const selector =
				!isNil(getQueryParams().label) && !isNil(getQueryParams().item)
					? '.c-content-page-overview-block__accordion--first-level:not(.c-accordion--closed) .c-content-page-overview-block__accordion--second-level:not(.c-accordion--closed)'
					: '.c-content-page-overview-block__accordion--first-level:not(.c-accordion--closed)';

			setTimeout(() => {
				const $el = document.querySelector(selector);
				$el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
			}, 100);
		}
		// We only want to trigger a scroll down when the page loads, not when the query params change when a user clicks another page
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInitialLoading, getQueryParams]);

	// ARC-1877: fix queryparams state on initial load was an old value (or undefined)
	// biome-ignore lint/correctness/useExhaustiveDependencies: only execute on initial load
	useEffect(() => {
		// https://meemoo.atlassian.net/browse/AVO-3438
		setQueryParams({
			label: getQueryParams().label || undefined,
		});
	}, []);

	const handleCurrentPageChanged = (pageIndex: number) => {
		setQueryParams({
			page: pageIndex,
			item: undefined,
		});
	};

	const handleSelectedTabsChanged = (tabs: LabelObj[]) => {
		setQueryParams({
			label: tabs.map((tab) => tab.label),
			page: undefined,
			item: undefined,
		});
	};

	const handleFocusedPageChanged = (newFocusedPage: ContentPageInfo | null) => {
		// https://meemoo.atlassian.net/browse/AVO-3438
		setQueryParams({
			page: undefined,
			item: newFocusedPage?.path || undefined,
		});
	};

	const getLabelsWithContent = () => {
		const labelsWithAtLeastOnePage = (labelObjs || []).filter(
			(labelObj: LabelObj) => (labelPageCounts?.[labelObj.id] || 0) > 0
		);
		// Sort labels in the order they were entered in the admin-core content page editor:
		// https://meemoo.atlassian.net/browse/ARC-1443?focusedCommentId=40802
		const labelIds = (contentTypeAndTabs.selectedLabels || []).map((labelId) => String(labelId));
		return sortBy(labelsWithAtLeastOnePage, [(labelObj) => labelIds.indexOf(String(labelObj.id))]);
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
				currentPage={getQueryParams().page || 0}
				onCurrentPageChanged={handleCurrentPageChanged}
				pageCount={pageCount || 1}
				pages={pages ?? []}
				tabStyle={tabStyle}
				itemStyle={itemStyle}
				itemAlignment={itemAlignment || 'left'}
				imageItemAlignment={imageItemAlignment || 'center'}
				allowMultiple={allowMultiple}
				centerHeader={centerHeader}
				showSectionTitle={showSectionTitle}
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
					// AVO specific link to the news page
					// This doesn't exist in hetarchief
					if (!AdminConfigManager.hasAdminRoute('NEWS')) {
						return null;
					}
					let newsLink = AdminConfigManager.getAdminRoute('NEWS');
					if (!newsLink.startsWith('/') && !newsLink.includes('//')) {
						newsLink = `/${newsLink}`;
					}
					return `${newsLink}?label=${encodeURIComponent(label)}`;
				}}
				renderLink={renderLink}
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
				message={tHtml(
					'react-admin/modules/content-page/components/blocks/block-page-overview/block-page-overview___error'
				)}
				locationId="block-page-overview-wrapper__error"
			>
				<p>
					{tHtml(
						'admin/content-block/components/page-overview-wrapper/page-overview-wrapper___het-ophalen-van-de-paginas-is-mislukt'
					)}
				</p>
			</ErrorView>
		);
	}
	return renderPageOverviewBlock();
};
