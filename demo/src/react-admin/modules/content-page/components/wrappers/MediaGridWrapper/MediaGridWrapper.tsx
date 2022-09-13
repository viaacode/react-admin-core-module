import {
	BlockMediaGrid,
	ButtonAction,
	MediaListItem,
	Modal,
	ModalBody,
	RenderLinkFunction,
} from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { get, isEmpty, isNil } from 'lodash-es';
import React, { FunctionComponent, ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
	MediaGridBlockComponentState,
	MediaGridBlockState,
} from '~modules/content-page/types/content-block.types';

import { ResolvedItemOrCollection } from './MediaGridWrapper.types';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { parseIntOrDefault } from '~modules/shared/helpers/parsers/number';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { ContentTypeString, toEnglishContentType } from '~modules/collection/collection.types';
import { formatDate } from '~modules/shared/helpers/formatters/date';
import ItemVideoDescription from '~modules/shared/components/ItemVideoDescription/ItemVideoDescription';
import { APP_PATH } from '~modules/shared/consts/routes.consts';
import { isMobileWidth } from '~modules/shared/helpers/media-query';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { buildLink } from '~modules/shared/helpers/link';
import { AdminConfigManager } from '~core/config';
import { defaultRenderBookmarkButton } from '~modules/shared/helpers/default-render-bookmark-button';
import { ToastType } from '~core/config/config.types';

interface MediaGridWrapperProps extends MediaGridBlockState {
	searchQuery?: ButtonAction;
	searchQueryLimit: string;
	elements: { mediaItem: ButtonAction }[];
	results: ResolvedItemOrCollection[];
	renderLink: RenderLinkFunction;
	buttonAltTitle?: string;
	ctaButtonAltTitle?: string;
	user: Avo.User.User;
}

const MediaGridWrapper: FunctionComponent<MediaGridWrapperProps & RouteComponentProps> = ({
	title,
	buttonLabel,
	buttonAltTitle,
	buttonAction,
	ctaTitle,
	ctaTitleColor,
	ctaTitleSize,
	ctaContent,
	ctaContentColor,
	ctaButtonLabel,
	ctaButtonAltTitle,
	ctaButtonType,
	ctaButtonIcon,
	ctaBackgroundColor,
	ctaBackgroundImage,
	ctaWidth,
	openMediaInModal = false,
	ctaButtonAction,
	searchQuery,
	searchQueryLimit,
	elements,
	results,
	user,
	renderLink,
}) => {
	const [t] = useTranslation();

	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [resolvedResults, setResolvedResults] = useState<ResolvedItemOrCollection[] | null>(null);
	const [activeItem, setActiveItem] = useState<(Avo.Item.Item & ResolvedItemOrCollection) | null>(
		null
	);
	const [activeItemBookmarkStatus, setActiveItemBookmarkStatus] = useState<boolean | null>(null);

	// cache search results
	const [lastSearchQuery, setLastSearchQuery] = useState<string | null>(null);
	const [lastSearchQueryLimit, setLastSearchQueryLimit] = useState<number | null>(null);

	const resolveMediaResults = useCallback(async () => {
		try {
			if (results && results.length) {
				// Results are filled in, we can render the block
				setResolvedResults(results);
				return;
			}
			if (results && elements && !elements.length) {
				// Results is empty, but elements is also empty, so we don't need to render anything
				setResolvedResults(results);
				return;
			}
			if (user) {
				// If we are logged in and get no results, but we do get elements, then the block is loaded in preview mode,
				// and we should resolve the results ourselves using a separate route on the server
				const searchQueryLimitNumber =
					parseIntOrDefault<undefined>(searchQueryLimit, undefined) || 8;
				const searchQueryValue: string | null =
					(get(searchQuery, 'value') as string | undefined) || null;

				if (
					(elements && elements.length && isNil(searchQueryValue)) ||
					searchQueryValue !== lastSearchQuery ||
					searchQueryLimitNumber > (lastSearchQueryLimit || 0)
				) {
					// Only fetch items from the server if
					// - the manually selected elements changed without a search query being set or
					// - the search query changed or
					// - if the number of items increased
					setLastSearchQuery(searchQueryValue || null);
					setLastSearchQueryLimit(searchQueryLimitNumber);
					const searchResults = await ContentPageService.resolveMediaItems(
						searchQueryValue,
						searchQueryLimitNumber,
						elements.filter((element) => !isEmpty(element) && element.mediaItem)
					);

					setResolvedResults((r) => {
						if (
							!isNil(searchQueryValue) &&
							r &&
							r.length &&
							searchResults.length !== (searchQueryLimitNumber || 8)
						) {
							// older request that we should ignore
							return r;
						}
						return searchResults;
					});
				} else if (
					searchQueryValue === lastSearchQuery ||
					searchQueryLimitNumber < (lastSearchQueryLimit || 0)
				) {
					// If the next query requests less items, we can resolve it without going to the server
					// by just trimming the items in the cache
					setResolvedResults((r) => (r || []).slice(0, searchQueryLimitNumber));
					setLastSearchQueryLimit(searchQueryLimitNumber);
				}
			}
		} catch (err) {
			setLoadingInfo({
				state: 'error',
				message: t(
					'admin/content-block/components/wrappers/media-grid-wrapper/media-grid-wrapper___het-laden-van-deze-media-tegel-grid-is-mislukt'
				),
				actionButtons: [],
			});
		}
	}, [
		results,
		elements,
		user,
		searchQuery,
		searchQueryLimit,
		lastSearchQuery,
		lastSearchQueryLimit,
		setResolvedResults,
		setLoadingInfo,
		t,
	]);

	useEffect(() => {
		resolveMediaResults();
	}, [resolveMediaResults]);

	useEffect(() => {
		if (resolvedResults) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [resolvedResults]);

	const mapCollectionOrItemData = (
		itemOrCollection: ResolvedItemOrCollection,
		index: number
	): MediaListItem => {
		const itemLabel = get(itemOrCollection, 'type.label', 'item');
		const isItem =
			itemLabel === ContentTypeString.video || itemLabel === ContentTypeString.audio;
		const isCollection = itemLabel === ContentTypeString.collection;
		const itemDuration = get(itemOrCollection, 'duration', 0);
		const collectionItems = get(
			itemOrCollection,
			'collection_fragments_aggregate.aggregate.count',
			0
		); // TODO add fragment count to elasticsearch index
		const viewCount = get(itemOrCollection, 'view_counts_aggregate.aggregate.sum.count', 0);

		const element: MediaGridBlockComponentState = (elements || [])[index] || ({} as any);

		return {
			category: isItem
				? itemLabel
				: isCollection
				? toEnglishContentType(ContentTypeString.collection)
				: toEnglishContentType(ContentTypeString.bundle),
			metadata: [
				{ icon: 'eye', label: String(viewCount || 0) },
				{ label: formatDate(itemOrCollection?.created_at) },
			],
			buttonLabel: element.buttonLabel,
			buttonAltTitle: element.buttonAltTitle,
			buttonType: element.buttonType,
			buttonIcon: element.buttonIcon,
			itemAction:
				element.mediaItem ||
				({
					type: isItem ? 'ITEM' : isCollection ? 'COLLECTION' : 'BUNDLE',
					value: itemOrCollection?.external_id || itemOrCollection?.id,
					target: get(searchQuery, 'target') || '_self',
				} as ButtonAction),
			buttonAction: element.buttonAction,
			title: itemOrCollection?.title || '',
			description: itemOrCollection?.description || '',
			issued: get(itemOrCollection, 'issued') || '',
			organisation: itemOrCollection?.organisation || '',
			thumbnail: {
				label: itemLabel,
				meta: isItem
					? itemDuration
					: `${collectionItems} ${isCollection ? 'items' : 'collecties'}`,
				src: itemOrCollection?.thumbnail_path || '',
			},
			src: itemOrCollection?.src,
			item_collaterals: get(itemOrCollection, 'item_collaterals', null),
		} as any;
	};

	const fetchActiveItemBookmarkStatus = useCallback(async () => {
		if (!user || !user.profile || !activeItem) {
			return;
		}
		const statuses =
			await AdminConfigManager.getConfig().services.bookmarksViewsPlaysService.getBookmarkStatuses(
				user.profile.id,
				[
					{
						type: 'item',
						uuid: activeItem.uid,
					},
				]
			);
		setActiveItemBookmarkStatus(statuses['item'][activeItem.uid]);
	}, [activeItem?.external_id]);

	useEffect(() => {
		fetchActiveItemBookmarkStatus();
	}, [fetchActiveItemBookmarkStatus]);

	const toggleBookmark = async () => {
		if (!user || !activeItem || isNil(activeItemBookmarkStatus)) {
			return;
		}
		try {
			await AdminConfigManager.getConfig().services.bookmarksViewsPlaysService.toggleBookmark(
				activeItem.uid,
				user,
				'item',
				activeItemBookmarkStatus
			);

			setActiveItemBookmarkStatus(!activeItemBookmarkStatus);
			AdminConfigManager.getConfig().services.toastService.showToast({
				type: ToastType.SUCCESS,
				title: AdminConfigManager.getConfig().services.i18n.t('Error'),
				description: activeItemBookmarkStatus
					? t('collection/views/collection-detail___de-bladwijzer-is-verwijderd')
					: t('collection/views/collection-detail___de-bladwijzer-is-aangemaakt'),
			});
		} catch (err) {
			console.error(
				new CustomError('Failed to toggle bookmark', err, {
					user,
					itemId: activeItem.uid,
					type: 'item',
					activeItemBookmarkStatus,
				})
			);
			AdminConfigManager.getConfig().services.toastService.showToast({
				type: ToastType.ERROR,
				title: AdminConfigManager.getConfig().services.i18n.t('Error'),
				description: activeItemBookmarkStatus
					? AdminConfigManager.getConfig().services.i18n.t(
							'item/views/item-detail___het-verwijderen-van-de-bladwijzer-is-mislukt'
					  )
					: AdminConfigManager.getConfig().services.i18n.t(
							'item/views/item-detail___het-aanmaken-van-de-bladwijzer-is-mislukt'
					  ),
			});
		}
	};

	const handleItemClicked = (item: MediaListItem) => {
		const activeItem =
			(resolvedResults || []).find(
				(result) => result.external_id === item.itemAction.value
			) || null;
		setActiveItem(activeItem as Avo.Item.Item);
	};

	const renderBookmarkButton = (): ReactNode => {
		if (!user || isNil(activeItemBookmarkStatus)) {
			return null;
		}
		return defaultRenderBookmarkButton({
			active: activeItemBookmarkStatus,
			ariaLabel: t('item/views/item___toggle-bladwijzer'),
			title: t('item/views/item___toggle-bladwijzer'),
			onClick: toggleBookmark,
		});
	};

	const openInModal = (mediaListItem: MediaListItem): boolean => {
		return openMediaInModal && get(mediaListItem, 'itemAction.type') === 'ITEM';
	};

	const renderMediaCardWrapper = (mediaCard: ReactNode, item: MediaListItem) => {
		if (openInModal(item)) {
			return <a onClick={() => handleItemClicked(item)}>{mediaCard}</a>;
		}
		return renderLink(item.itemAction, mediaCard, item.buttonAltTitle || item.title);
	};

	// Render
	const renderMediaGridBlock = () => {
		const elements = (resolvedResults || []).map(mapCollectionOrItemData);
		return (
			<>
				<BlockMediaGrid
					title={title}
					buttonLabel={buttonLabel}
					buttonAltTitle={buttonAltTitle}
					buttonAction={buttonAction || searchQuery}
					ctaTitle={ctaTitle}
					ctaTitleColor={ctaTitleColor}
					ctaTitleSize={ctaTitleSize}
					ctaContent={ctaContent}
					ctaContentColor={ctaContentColor}
					ctaButtonLabel={ctaButtonLabel}
					ctaButtonAltTitle={ctaButtonAltTitle}
					ctaButtonType={ctaButtonType}
					ctaButtonIcon={ctaButtonIcon}
					ctaBackgroundColor={ctaBackgroundColor}
					ctaBackgroundImage={ctaBackgroundImage}
					ctaWidth={ctaWidth}
					ctaButtonAction={ctaButtonAction}
					fullWidth={isMobileWidth()}
					elements={elements}
					renderLink={renderLink}
					renderMediaCardWrapper={renderMediaCardWrapper}
				/>
				<Modal
					isOpen={!!activeItem && !!activeItem.src}
					onClose={() => {
						setActiveItem(null);
						setActiveItemBookmarkStatus(null);
					}}
					scrollable
					size="medium"
				>
					<ModalBody>
						{!!activeItem && !!activeItem.src && (
							<ItemVideoDescription
								src={activeItem.src}
								poster={get(activeItem, 'thumbnail.src')}
								itemMetaData={activeItem as unknown as Avo.Item.Item}
								verticalLayout
								showTitle
								titleLink={buildLink(APP_PATH.ITEM_DETAIL.route, {
									id: activeItem.external_id,
								})}
								collapseDescription={false}
								renderButtons={renderBookmarkButton}
							/>
						)}
					</ModalBody>
				</Modal>
			</>
		);
	};

	return (
		<LoadingErrorLoadedComponent
			loadingInfo={loadingInfo}
			dataObject={resolvedResults}
			render={renderMediaGridBlock}
		/>
	);
};

export default withRouter(MediaGridWrapper);
