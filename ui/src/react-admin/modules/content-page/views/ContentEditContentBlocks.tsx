import type { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import { get } from 'lodash-es';
import React, { FunctionComponent, ReactNode, RefObject, useRef, useState } from 'react';

import { Navbar, Select } from '@viaa/avo2-components';
import { HorizontalPageSplit } from 'react-page-split';

import ContentPageRenderer from '~modules/content-page/components/ContentPageRenderer/ContentPageRenderer';
import DraggableList, {
	DraggableItemData,
} from '~modules/content-page/components/DraggableList/DraggableList';
import { GET_CONTENT_BLOCK_TYPE_OPTIONS } from '~modules/content-page/const/get-content-block-type-options';
import { CONTENT_BLOCK_CONFIG_MAP } from '~modules/content-page/const/content-block-config-map';
import { ContentEditAction } from '~modules/content-page/helpers/content-edit.reducer';
import {
	ContentBlockErrors,
	ContentBlockStateOption,
	ContentBlockStateType,
	ContentBlockType,
} from '~modules/content-page/types/content-block.types';
import {
	BlockClickHandler,
	ContentEditActionType,
	ContentPageInfo,
} from '~modules/content-page/types/content-pages.types';
import { Sidebar } from '~shared/components/Sidebar/Sidebar';
import { createKey } from '~shared/helpers/create-key';
import { useTranslation } from '~shared/hooks/useTranslation';
import ContentBlockForm from '~modules/content-page/components/ContentBlockForm/ContentBlockForm';

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
	const { tText } = useTranslation();

	// Hooks
	// This is the block that is being edited with the form sidebar accordion opened up
	const [activeBlockPosition, setActiveBlockPosition] = useState<number | null>(null);

	// This is the collapsed accordion that is highlighted by a blue border
	const [highlightedBlockIndex, setHighlightedBlockIndex] = useState<number | null>(null);

	const previewScrollable: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
	const sidebarScrollable: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

	// Methods
	const handleAddContentBlock = (configType: ContentBlockType) => {
		const newConfig = CONTENT_BLOCK_CONFIG_MAP[configType](
			(contentPageInfo.content_blocks || []).length
		);

		// Update content block configs
		changeContentPageState({
			type: ContentEditActionType.ADD_CONTENT_BLOCK_CONFIG,
			payload: newConfig,
		});

		// Scroll preview and sidebar to the bottom
		focusBlock(newConfig.position, 'preview');
		focusBlock(newConfig.position, 'sidebar');
	};

	const handleReorderContentBlock = (configIndex: number, indexUpdate: number) => {
		// Close accordions
		setActiveBlockPosition(null);
		// Trigger reorder
		changeContentPageState({
			type: ContentEditActionType.REORDER_CONTENT_BLOCK_CONFIG,
			payload: { configIndex, indexUpdate },
		});
	};

	/**
	 * https://imgur.com/a/E7TxvUN
	 * @param position
	 * @param type
	 */
	const scrollToBlockPosition: BlockClickHandler = (
		position: number,
		type: 'preview' | 'sidebar'
	) => {
		const blockElem = document.querySelector(`.content-block-${type}-${position}`);
		const scrollable = get(
			type === 'sidebar' ? sidebarScrollable : previewScrollable,
			'current'
		);
		if (!blockElem || !scrollable) {
			return;
		}
		const blockElemTop = blockElem.getBoundingClientRect().top;
		const scrollableTop = scrollable.getBoundingClientRect().top;
		const scrollTop = scrollable.scrollTop;
		const scrollMargin = type === 'sidebar' ? 18 : 0;
		const desiredScrollPosition = Math.max(
			blockElemTop - (scrollableTop - scrollTop) - scrollMargin,
			0
		);
		scrollable.scroll({ left: 0, top: desiredScrollPosition, behavior: 'smooth' });
	};

	const focusBlock: BlockClickHandler = (position: number, type: 'preview' | 'sidebar') => {
		toggleActiveBlock(position, type === 'preview');
		setHighlightedBlockIndex(position);
		const inverseType = type === 'preview' ? 'sidebar' : 'preview';
		setTimeout(() => {
			scrollToBlockPosition(position, inverseType);
		}, 0);
	};

	const toggleActiveBlock = (position: number, onlyOpen: boolean) => {
		if (position === activeBlockPosition && !onlyOpen) {
			setActiveBlockPosition(null);
			setTimeout(() => {
				setHighlightedBlockIndex(null);
			}, 1000);
		} else {
			setActiveBlockPosition(position);
		}
	};

	const renderBlockForm = (itemData: DraggableItemData, index: number): ReactNode => {
		return (
			<div
				className={clsx(
					'content-block-sidebar-item',
					`content-block-sidebar-${itemData.position}`,
					{ [`content-block-sidebar-item--highlighted`]: index === highlightedBlockIndex }
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
						focusBlock(itemData.position, 'sidebar');
					}}
					onChange={(
						formGroupType: ContentBlockStateType,
						input: any,
						stateIndex?: number
					) => onSave(index, formGroupType, input, stateIndex)}
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
	};

	const generateKeyForBlock = (itemData: DraggableItemData) => {
		return itemData.id;
	};

	const handleDragStarting = () => {
		setActiveBlockPosition(null);
	};

	const handleUpdateDraggableList = (updatedList: DraggableItemData[]) => {
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
	};

	// Render
	const renderContentBlockForms = () => {
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
	};

	return (
		<HorizontalPageSplit
			className="m-resizable-panels m-edit-content-blocks"
			widths={['60%', '40%']}
		>
			<div className="c-content-edit-view__preview" ref={previewScrollable}>
				<ContentPageRenderer
					contentPageInfo={contentPageInfo}
					onBlockClicked={focusBlock}
					activeBlockPosition={activeBlockPosition}
					commonUser={commonUser}
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
						value={null as any}
					/>
				</Navbar>
				<div className="c-scrollable" ref={sidebarScrollable}>
					{renderContentBlockForms()}
				</div>
			</Sidebar>
		</HorizontalPageSplit>
	);
};

export default ContentEditContentBlocks;
