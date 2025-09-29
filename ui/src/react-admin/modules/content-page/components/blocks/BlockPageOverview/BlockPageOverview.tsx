import {
	Accordion,
	AspectRatioWrapper,
	Button,
	type ButtonAction,
	Column,
	Container,
	convertToHtml,
	type DefaultProps,
	Flex,
	Grid,
	IconName,
	type RenderLinkFunction,
	Spacer,
	Tabs,
	TagList,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import { findIndex, flatten, uniqBy } from 'lodash-es';
import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import { BlockImageGrid } from '~content-blocks/BlockImageGrid';
import type { GridItem } from '~content-blocks/BlockImageGrid/BlockImageGrid.types';
import { ContentPageRenderer } from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
import type { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { defaultRenderLinkFunction } from '~shared/helpers/link';
import { BlockHeading } from '../BlockHeading/BlockHeading';
import type { ContentTabStyle, LabelObj } from './BlockPageOverview.types';
import { ContentItemStyle } from './BlockPageOverview.types';

import './BlockPageOverview.scss';
import { PaginationBar } from '@meemoo/react-components';
import type { AlignOption } from '~modules/content-page/types/content-block.types';
import { ITEMS_PER_PAGE } from '~modules/item/items.consts';
import { ErrorView } from '~shared/components/error';
import Html from '~shared/components/Html/Html';
import { GET_DEFAULT_PAGINATION_BAR_PROPS } from '~shared/components/PaginationBar/PaginationBar.consts';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';

export interface BlockPageOverviewProps extends DefaultProps {
	tabs?: { label: string; id: number }[];
	darkTabs?: boolean;
	tabStyle?: ContentTabStyle;
	allowMultiple?: boolean;
	centerHeader?: boolean;
	itemStyle?: ContentItemStyle;
	itemAlignment?: AlignOption;
	imageItemAlignment?: AlignOption;
	showSectionTitle?: boolean;
	showTitle?: boolean;
	showDescription?: boolean;
	showDate?: boolean;
	dateString?: string;
	buttonLabel?: string;
	buttonAltTitle?: string;
	allLabel?: string;
	noLabel?: string;
	selectedTabs: LabelObj[];
	onSelectedTabsChanged: (selectedTabs: LabelObj[]) => void;
	currentPage: number;
	onCurrentPageChanged: (newPage: number) => void;
	pageCount: number;
	pages: ContentPageInfo[];
	focusedPage: ContentPageInfo | null; // Shown at the top with an expanded accordion
	onFocusedPageChanged: (newFocusedPage: ContentPageInfo | null) => void;
	getLabelLink?: (label: string) => string | null;
	renderLink?: RenderLinkFunction;
	commonUser?: Avo.User.CommonUser;
	isLoadingLabelObjs: boolean;
	isLoadingSelectedTabObjects: boolean;
	isLoadingFocusedPage: boolean;
	isLoadingPagesAndLabels: boolean;
}

export const BlockPageOverview: FunctionComponent<BlockPageOverviewProps> = ({
	tabs = [],
	darkTabs = false,
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
	dateString = 'Geplaatst %label% op %date%',
	buttonLabel = 'Lees meer',
	buttonAltTitle = '',
	allLabel = 'alle',
	noLabel = 'Overige',
	selectedTabs,
	onSelectedTabsChanged,
	currentPage = 0,
	onCurrentPageChanged,
	pageCount,
	pages = [],
	focusedPage,
	onFocusedPageChanged,
	getLabelLink,
	renderLink = defaultRenderLinkFunction,
	commonUser,
	isLoadingPagesAndLabels,
}) => {
	const allLabelObj = { label: allLabel, id: -2 };
	const noLabelObj = { label: noLabel, id: -2 };

	const handleTabClick = (tab: LabelObj | undefined) => {
		if (!tab || tab.id === allLabelObj.id) {
			// Click on all selected tabs => clear other filters automatically
			// Empty selected tabs signifies to the outsides: show all items / do not apply any label filters
			onSelectedTabsChanged([]);
			return;
		}

		let newSelectedTabs: LabelObj[];
		if (allowMultiple) {
			const indexOf = findIndex(selectedTabs, { id: tab.id });
			if (indexOf !== -1) {
				// already in the selected tabs => remove the tab
				const newTabs = [...selectedTabs];
				newTabs.splice(indexOf, 1);
				newSelectedTabs = newTabs;
			} else {
				// add the tab
				newSelectedTabs = [...selectedTabs, tab];
			}
		} else {
			// Replace the current selected tab
			newSelectedTabs = [tab];
		}

		// Empty selected tabs signifies to the outsides: show all items / do not apply any label filters
		onSelectedTabsChanged(newSelectedTabs.filter((tab) => tab.id !== allLabelObj.id));
	};

	// biome-ignore lint/suspicious/noExplicitAny: todo
	const renderLabel = (labelObj: any) => {
		const labelLink = getLabelLink?.(labelObj.label);
		if (labelLink) {
			return `<a href="${labelLink}" class="c-content-page__label c-content-page__label--link">${labelObj.label}</a>`;
		}
		return `<span class="c-content-page__label">${labelObj.label}</span>`;
	};

	const renderLabels = (page: ContentPageInfo) => {
		if (!page.labels || !page.labels.length) {
			return '';
		}
		return ` in ${page.labels
			.map((labelObj, index) => {
				if (index === page.labels.length - 1) {
					return renderLabel(labelObj);
				}
				if (index === page.labels.length - 2) {
					return `${renderLabel(labelObj)} en `;
				}
				return `${renderLabel(labelObj)}, `;
			})
			.join('')}`;
	};

	const formatDateString = (dateString: string, page: ContentPageInfo): string => {
		return dateString
			.replace('%label%', renderLabels(page))
			.replace(
				'%date%',
				format(parseISO(page.publishedAt || page.publishAt || page.createdAt), 'd MMMM yyyy')
			);
	};

	const getDescription = (page: ContentPageInfo) => {
		return showDescription && page.description ? (
			<Html content={page.description} sanitizePreset={SanitizePreset.full} type="div" />
		) : undefined;
	};

	const renderText = (text: string | ReactNode, className?: string) => {
		if (text) {
			if (typeof text === 'string') {
				return (
					<Html
						content={convertToHtml(text as string)}
						sanitizePreset={SanitizePreset.full}
						className={className}
					/>
				);
			}
			return text;
		}
		return null;
	};

	const renderGrid = (pages: ContentPageInfo[]): ReactNode => {
		return (
			<BlockImageGrid
				elements={pages.map(
					(page: ContentPageInfo): GridItem => ({
						title: showTitle ? page.title : undefined,
						text: getDescription(page),
						source: page.thumbnailPath as string, // TODO handle undefined thumbnails
						action: { type: 'CONTENT_PAGE', value: page.path as string },
					})
				)}
				itemWidth="30.7rem"
				imageHeight="17.2rem"
				imageWidth="100%"
				renderLink={renderLink}
				fill="cover"
				textAlign="left"
				align={itemAlignment}
				imageItemAlignment={imageItemAlignment}
			/>
		);
	};

	const renderPages = () => {
		if (itemStyle === ContentItemStyle.NEWS_LIST || itemStyle === ContentItemStyle.PROJECT_LIST) {
			return pages.map((page) => {
				return (
					<Container
						className={clsx(
							'c-block-image-title-text-button',
							itemStyle === ContentItemStyle.NEWS_LIST && 'c-page-overview-news-list',
							itemStyle === ContentItemStyle.PROJECT_LIST && 'c-page-overview-project-list'
						)}
						mode="vertical"
						key={`content-block-page-${page.id}`}
					>
						<Container mode="horizontal">
							<Grid>
								<Column size={itemStyle === ContentItemStyle.NEWS_LIST ? '2-5' : '2-4'}>
									<Spacer margin="bottom-large">
										<AspectRatioWrapper
											style={{
												backgroundImage: `url(${page.thumbnailPath})`,
											}}
											aspect={itemStyle === ContentItemStyle.NEWS_LIST ? 1.78 : 2.5} // 500 x 280 or 528 x 211
										/>
									</Spacer>
								</Column>
								<Column size="2-7">
									<div className="c-content">
										{showTitle &&
											renderLink(
												{
													type: 'CONTENT_PAGE',
													value: page.path,
												} as ButtonAction,
												itemStyle === ContentItemStyle.NEWS_LIST ? (
													<h3>{page.title}</h3>
												) : (
													<h2>{page.title}</h2>
												),
												page.title
											)}
										{showDate && renderText(formatDateString(dateString, page), 'a-subtitle')}
										{
											<div className="a-content-page__description">
												{renderText(getDescription(page))}
											</div>
										}
										{buttonLabel && (
											<Spacer margin="top">
												{renderLink(
													{
														type: 'CONTENT_PAGE',
														value: page.path,
													} as ButtonAction,
													<Button label={buttonLabel} type="tertiary" />,
													buttonLabel,
													buttonAltTitle || buttonLabel
												)}
											</Spacer>
										)}
									</div>
								</Column>
							</Grid>
						</Container>
					</Container>
				);
			});
		}
		if (itemStyle === ContentItemStyle.GRID) {
			const uniqueLabels: LabelObj[] = uniqBy(
				flatten(pages.map((page): LabelObj[] => page.labels)),
				'id'
			);
			const pagesByLabel: { [labelId: number]: ContentPageInfo[] } = Object.fromEntries(
				uniqueLabels.map((labelObj: LabelObj): [number, ContentPageInfo[]] => {
					return [
						labelObj.id,
						pages.filter((page) =>
							page.labels.map((pageLabelObj) => pageLabelObj.id).includes(labelObj.id)
						),
					];
				})
			);
			// Put the pages that do not have a label under their own category
			pagesByLabel[noLabelObj.id] = pages.filter((page) => !page.labels || !page.labels.length);
			const showAllLabels = selectedTabs.length === 0 || selectedTabs[0].id === allLabelObj.id;
			const labelsToShow: LabelObj[] = showAllLabels ? [...uniqueLabels, noLabelObj] : selectedTabs;

			if (showSectionTitle) {
				// Render each page under their label section (can have duplicates)
				return labelsToShow.map((labelObj) => {
					if (!(pagesByLabel[labelObj.id] || []).length) {
						return null;
					}
					return (
						<Spacer margin="top-extra-large" key={`block-page-label-${labelObj.id}`}>
							{showSectionTitle && (showAllLabels || allowMultiple) && !!(tabs || []).length && (
								<Spacer margin="left-small">
									<BlockHeading type={'h2'}>{labelObj.label}</BlockHeading>
								</Spacer>
							)}
							{renderGrid(pagesByLabel[labelObj.id])}
						</Spacer>
					);
				});
			} else {
				// Render all pages in a grid without section titles (unique pages only)
				let pagesToShow = labelsToShow.flatMap((labelObj) => {
					if (!(pagesByLabel[labelObj.id] || []).length) {
						return [];
					}
					return pagesByLabel[labelObj.id];
				});
				pagesToShow = uniqBy(pagesToShow, (page) => page.id);
				return renderGrid(pagesToShow);
			}
		}
		if (itemStyle === ContentItemStyle.ACCORDION) {
			// Ensure the focused page is not loaded twice on the same pagination page (ACCORDION)
			const allPages: ContentPageInfo[] = focusedPage
				? [focusedPage, ...pages.filter((page) => page.id !== focusedPage.id)]
				: pages;
			return (
				<Spacer margin="top-large">
					{allPages.map((page) => {
						return (
							<Accordion
								title={page.title}
								isOpen={page.id === focusedPage?.id}
								key={`block-page-${page.id}`}
							>
								<ContentPageRenderer
									contentPageInfo={page}
									commonUser={commonUser}
									renderNoAccessError={() => (
										<ErrorView
											icon={IconName.clock}
											actionButtons={['helpdesk']}
											message={'deze-pagina-is-enkel-voor-gebruikers-met-andere-rechten'}
										/>
									)}
								/>
							</Accordion>
						);
					})}
				</Spacer>
			);
		}
		if (itemStyle === ContentItemStyle.ACCORDION_TWO_LEVELS) {
			//ACCORDION_TWO_LEVELS does not have pagination, so we don't need to load the focused page first
			const allPages = pages;
			return (
				<Spacer margin="top-large">
					{tabs.map((tab) => {
						return (
							<Accordion
								title={tab.label}
								isOpen={tab.id === selectedTabs?.[0]?.id}
								onToggle={() => {
									if (tab.id === selectedTabs?.[0]?.id) {
										// currently opened => close the clicked accordion
										onSelectedTabsChanged([]);
									} else {
										// currently closed => open the clicked accordion
										onSelectedTabsChanged([tab]);
									}
								}}
								key={`page-overview--tab-${tab.id}`}
								className="c-content-page-overview-block__accordion--first-level"
							>
								{isLoadingPagesAndLabels ? (
									<CenteredSpinner />
								) : (
									allPages.map((page) => {
										return (
											<Accordion
												title={page.title}
												isOpen={page.id === focusedPage?.id}
												onToggle={() => {
													if (page.id === focusedPage?.id) {
														// currently opened => close the clicked accordion
														onFocusedPageChanged?.(null);
													} else {
														// currently closed => open the clicked accordion
														onFocusedPageChanged(page);
													}
												}}
												key={`page-overview--page-${page.id}`}
												className="c-content-page-overview-block__accordion--second-level"
											>
												<ContentPageRenderer
													contentPageInfo={page}
													commonUser={commonUser}
													renderNoAccessError={() => (
														<ErrorView
															icon={IconName.clock}
															actionButtons={['helpdesk']}
															message={'deze-pagina-is-enkel-voor-gebruikers-met-andere-rechten'}
														/>
													)}
												/>
											</Accordion>
										);
									})
								)}
							</Accordion>
						);
					})}
				</Spacer>
			);
		}
	};

	const renderHeader = () => {
		// if only one tab, only show the content of that one tab, don't show the header
		if (tabs.length > 1) {
			// Add "all" option to the front
			const extendedTabs = [allLabelObj, ...tabs];
			let extendedSelectedTabs: LabelObj[] = selectedTabs;
			if (!extendedSelectedTabs || !extendedSelectedTabs.length) {
				// Select the "all" option if no tabs are selected
				extendedSelectedTabs = [extendedTabs[0]];
			}
			if (itemStyle === ContentItemStyle.ACCORDION_TWO_LEVELS) {
				return null;
			}
			if (tabStyle === 'ROUNDED_BADGES') {
				return (
					<Flex center={centerHeader} className="c-content-page-overview-block__header">
						<Spacer margin={['left', 'bottom', 'right']}>
							<TagList
								tags={extendedTabs.map((tab) => ({
									id: tab.id,
									label: tab.label,
									active: !!extendedSelectedTabs.find((extendedTab) => extendedTab.id === tab.id),
								}))}
								swatches={false}
								selectable
								onTagClicked={(tagId: string | number) =>
									handleTabClick(tabs.find((tab) => tab.id === tagId))
								}
							/>
						</Spacer>
					</Flex>
				);
			}
			if (tabStyle === 'MENU_BAR') {
				return (
					<Flex center={centerHeader} className="c-content-page-overview-block__header">
						<Spacer margin={['left', 'bottom', 'right']}>
							<Tabs
								tabs={extendedTabs.map((tab) => ({
									id: tab.id,
									label: tab.label,
									active: !!extendedSelectedTabs.find((extendedTab) => extendedTab.id === tab.id),
								}))}
								dark={darkTabs}
								onClick={(tabId) => handleTabClick(tabs.find((tab) => tab.id === tabId))}
							/>
						</Spacer>
					</Flex>
				);
			}
		} else {
			return null;
		}
	};

	return (
		<div className="c-content-page-overview-block">
			{renderHeader()}
			{renderPages()}
			{pageCount > 1 && (
				<Spacer margin="top">
					<PaginationBar
						{...GET_DEFAULT_PAGINATION_BAR_PROPS()}
						startItem={currentPage * ITEMS_PER_PAGE}
						itemsPerPage={ITEMS_PER_PAGE}
						totalItems={pageCount * ITEMS_PER_PAGE}
						onPageChange={onCurrentPageChanged}
						showBackToTop={false}
						showProgress={false}
					/>
				</Spacer>
			)}
		</div>
	);
};
