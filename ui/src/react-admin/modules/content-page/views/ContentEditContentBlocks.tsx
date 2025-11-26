import { IconName, Navbar, Select } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import { isNil } from 'es-toolkit';
import type { FunctionComponent, ReactNode } from 'react';
import React, { useCallback, useState } from 'react';
import { HorizontalPageSplit } from 'react-page-split';
import ContentBlockForm from '~modules/content-page/components/ContentBlockForm/ContentBlockForm';
import { ContentPageRenderer } from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
import type { DraggableItemData } from '~modules/content-page/components/DraggableList/DraggableList';
import DraggableList from '~modules/content-page/components/DraggableList/DraggableList';
import { CONTENT_BLOCK_CONFIG_MAP } from '~modules/content-page/const/content-block-config-map';
import { GET_CONTENT_BLOCK_TYPE_OPTIONS } from '~modules/content-page/const/get-content-block-type-options';
import type { ContentEditAction } from '~modules/content-page/helpers/content-edit.reducer';
import type {
	ContentBlockErrors,
	ContentBlockStateOption,
	ContentBlockStateType,
	ContentBlockType,
} from '~modules/content-page/types/content-block.types';
import {
	type BlockClickHandler,
	BlockClickType,
	ContentEditActionType,
	type ContentPageInfo,
} from '~modules/content-page/types/content-pages.types';
import { ContentEditActionType } from '~modules/content-page/types/content-pages.types';
import { ErrorView } from '~shared/components/error/ErrorView';
import { Sidebar } from '~shared/components/Sidebar/Sidebar';
import { createKey } from '~shared/helpers/create-key';
import { isAvo } from '~shared/helpers/is-avo';
import { tText } from '~shared/helpers/translation-functions';
import './ContentEditContentBlocks.scss';

interface ContentEditContentBlocksProps {
	contentPageInfo: Partial<ContentPageInfo>;
	hasSubmitted: boolean;
	changeContentPageState: (action: ContentEditAction) => void;
	onRemove: (configIndex: number) => void;
	onSave: (
		index: number,
		formGroupType: ContentBlockStateType,
		formGroupState: ContentBlockStateOption,
		stateIndex?: number
	) => void;
	addComponentToState: (index: number, blockType: ContentBlockType) => void;
	removeComponentFromState: (index: number, stateIndex: number) => void;
	commonUser: Avo.User.CommonUser;
}

const ContentEditContentBlocks: FunctionComponent<ContentEditContentBlocksProps> = ({
	contentPageInfo,
	hasSubmitted,
	changeContentPageState,
	onRemove,
	onSave,
	addComponentToState,
	removeComponentFromState,
	commonUser,
}) => {
	const _contentBlockIds = (contentPageInfo.content_blocks || []).map((item) => item.id);

	// Hooks
	// This is the block that is being edited with the form sidebar accordion opened up
	const [activeBlockPosition, setActiveBlockPosition] = useState<number | null>(null);

	// This is the collapsed accordion that is highlighted by a blue border
	const [highlightedBlockIndex, setHighlightedBlockIndex] = useState<number | null>(null);

	// Methods
	const handleAddContentBlock = (configType: ContentBlockType) => {
		const newBlockIndex = (contentPageInfo.content_blocks || []).length;
		const newConfig = CONTENT_BLOCK_CONFIG_MAP[configType](newBlockIndex);

		newConfig.id = Date.now() + newBlockIndex;
		newConfig.unsaved = true;

		// Update content block configs
		changeContentPageState({
			type: ContentEditActionType.ADD_CONTENT_BLOCK_CONFIG,
			payload: newConfig,
		});

		// Scroll preview and sidebar to the bottom
		focusBlock(newConfig.position, BlockClickType.PREVIEW);
		focusBlock(newConfig.position, BlockClickType.SIDEBAR);
	};

	const handleReorderContentBlock = useCallback(
		(configIndex: number, indexUpdate: number) => {
			// Close accordions
			setActiveBlockPosition(null);
			// Trigger reorder
			changeContentPageState({
				type: ContentEditActionType.REORDER_CONTENT_BLOCK_CONFIG,
				payload: { configIndex, indexUpdate },
			});
		},
		[changeContentPageState]
	);

	/**
	 * @param position
	 * @param type
	 */
	const scrollToBlockPosition: BlockClickHandler = useCallback(
		(position: number, type: BlockClickType) => {
			const blockElem = document.querySelector(`.content-block-${type}-${position}`);

			const sidebarScrollable = document.querySelector(
				'.m-edit-content-blocks .react-page-split__divider + .react-page-split__panel'
			);
			const previewScrollable = document.querySelector('.c-content-edit-view__preview');

			const scrollable = type === BlockClickType.SIDEBAR ? sidebarScrollable : previewScrollable;
			if (!blockElem || !scrollable) {
				return;
			}
			const blockElemTop = blockElem.getBoundingClientRect().top;
			const scrollableTop = scrollable.getBoundingClientRect().top;
			const scrollTop = scrollable.scrollTop;
			const scrollMargin = type === BlockClickType.SIDEBAR ? 18 : 0;
			const desiredScrollPosition = Math.round(
				Math.max(blockElemTop - (scrollableTop - scrollTop) - scrollMargin, 0)
			);
			scrollable.scroll({
				left: 0,
				top: desiredScrollPosition,
				behavior: 'smooth',
			});
		},
		[]
	);

	const toggleActiveBlock = useCallback(
		(position: number, onlyOpen: boolean) => {
			if (position === activeBlockPosition && !onlyOpen) {
				setActiveBlockPosition(null);
				setTimeout(() => {
					setHighlightedBlockIndex(null);
				}, 1000);
			} else {
				setActiveBlockPosition(position);
			}
		},
		[activeBlockPosition]
	);

	const focusBlock: BlockClickHandler = useCallback(
		(position: number, type: BlockClickType) => {
			toggleActiveBlock(position, type === BlockClickType.PREVIEW);
			setHighlightedBlockIndex(position);
			const inverseType =
				type === BlockClickType.PREVIEW ? BlockClickType.SIDEBAR : BlockClickType.PREVIEW;
			setTimeout(() => {
				scrollToBlockPosition(position, inverseType);
			}, 0);
		},
		[toggleActiveBlock, scrollToBlockPosition]
	);

	const renderBlockForm = useCallback(
		(itemData: DraggableItemData, index: number): ReactNode => {
			return (
				<div
					className={clsx(
						'content-block-sidebar-item',
						`content-block-sidebar-${itemData.position}`,
						{
							'content-block-sidebar-item--highlighted': index === highlightedBlockIndex,
						}
					)}
					key={createKey('form', index)}
				>
					<ContentBlockForm
						config={itemData}
						blockIndex={index}
						isAccordionOpen={itemData.position === activeBlockPosition}
						length={(contentPageInfo.content_blocks || []).length}
						hasSubmitted={hasSubmitted}
						toggleIsAccordionOpen={() => {
							focusBlock(itemData.position, BlockClickType.SIDEBAR);
						}}
						onChange={(
							formGroupType: ContentBlockStateType,
							// biome-ignore lint/suspicious/noExplicitAny: todo
							input: any,
							stateIndex?: number
						) => {
							onSave(index, formGroupType, input, stateIndex);
						}}
						addComponentToState={() => addComponentToState(index, itemData.type)}
						removeComponentFromState={(stateIndex: number) =>
							removeComponentFromState(index, stateIndex)
						}
						onError={(configIndex: number, errors: ContentBlockErrors) =>
							changeContentPageState({
								type: ContentEditActionType.SET_CONTENT_BLOCK_ERROR,
								payload: { configIndex, errors },
							})
						}
						onRemove={onRemove}
						onReorder={handleReorderContentBlock}
					/>
				</div>
			);
		},
		[
			activeBlockPosition,
			addComponentToState,
			changeContentPageState,
			contentPageInfo.content_blocks,
			focusBlock,
			handleReorderContentBlock,
			hasSubmitted,
			highlightedBlockIndex,
			onRemove,
			onSave,
			removeComponentFromState,
		]
	);

	const generateKeyForBlock = useCallback((itemData: DraggableItemData): string => {
		if (!itemData.id) {
			throw new Error(`Block has no id: ${itemData}`);
		}
		return itemData.id;
	}, []);

	const handleDragStarting = useCallback(() => {
		setActiveBlockPosition(null);
	}, []);

	const handleUpdateDraggableList = useCallback(
		(updatedList: DraggableItemData[]) => {
			changeContentPageState({
				type: ContentEditActionType.SET_CONTENT_PAGE_PROP,
				payload: {
					propName: 'content_blocks',
					propValue: updatedList.map((blockConfig, index) => {
						return {
							...blockConfig,
							position: index,
						};
					}),
				},
			});
		},
		[changeContentPageState]
	);

	// Render
	const renderedContentBlockForms = useCallback(
		() => {
			if (isNil(activeBlockPosition)) {
				// No block accordions are expanded, so we can enable drag and drop
				return (
					<DraggableList
						items={contentPageInfo.content_blocks || []}
						renderItem={renderBlockForm}
						generateKey={generateKeyForBlock}
						onDragStarting={handleDragStarting}
						onListChange={handleUpdateDraggableList}
						highlightedItemIndex={highlightedBlockIndex}
						setHighlightedItemIndex={(index) => {
							setHighlightedBlockIndex(index);
							setTimeout(() => {
								setHighlightedBlockIndex(null);
							}, 1000);
						}}
					></DraggableList>
				);
			} else {
				// A block is expanded, so we disable drag and drop
				return (
					<div className="content-block-sidebar__items-non-draggable">
						{(contentPageInfo.content_blocks || []).map(renderBlockForm)}
					</div>
				);
			}
		},
		// Only do change detection on the ids of the blocks, not the content
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			handleUpdateDraggableList,
			highlightedBlockIndex,
			renderBlockForm,
			activeBlockPosition,
			contentPageInfo.content_blocks,
			generateKeyForBlock,
			handleDragStarting,
		]
	);

	return (
		<HorizontalPageSplit
			className="m-resizable-panels m-edit-content-blocks"
			widths={['60%', '40%']}
		>
			<div className="c-content-edit-view__preview">
				<ContentPageRenderer
					contentPageInfo={contentPageInfo}
					onBlockClicked={focusBlock}
					activeBlockPosition={activeBlockPosition}
					commonUser={commonUser}
					renderFakeTitle={contentPageInfo.contentType === 'FAQ_ITEM' && isAvo()}
					renderNoAccessError={() => (
						<ErrorView
							icon={IconName.clock}
							actionButtons={['helpdesk']}
							message={'deze-pagina-is-enkel-voor-gebruikers-met-andere-rechten'}
						/>
					)}
				/>
			</div>

			<Sidebar className="c-content-edit-view__sidebar" light>
				<Navbar background="alt">
					<Select
						options={GET_CONTENT_BLOCK_TYPE_OPTIONS()}
						onChange={(value) => handleAddContentBlock(value as ContentBlockType)}
						placeholder={tText(
							'admin/content/views/content-edit-content-blocks___voeg-een-content-blok-toe'
						)}
						// biome-ignore lint/suspicious/noExplicitAny: todo
						value={null as any}
					/>
				</Navbar>
				<div className="c-scrollable">{renderedContentBlockForms()}</div>
			</Sidebar>
		</HorizontalPageSplit>
	);
};

export default ContentEditContentBlocks;
