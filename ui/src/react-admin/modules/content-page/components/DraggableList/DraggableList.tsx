import clsx from 'clsx';
import { findIndex } from 'es-toolkit/compat';
import type { FunctionComponent, ReactNode } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import type { DraggableItem } from './DraggableList.types';

import './DraggableList.scss';
import type { IconName } from '@viaa/avo2-components';
import { Icon } from '@viaa/avo2-components';
import { blockHasErrors } from '~modules/content-page/helpers/block-has-errors';

// TODO replace this with a generic T type
// biome-ignore lint/suspicious/noExplicitAny: todo
export type DraggableItemData = any & { id: string };

export interface DraggableListProps {
	items: DraggableItemData[];
	renderItem: (itemData: DraggableItemData, index: number) => ReactNode;
	onListChange: (updatedList: DraggableItemData[]) => void;
	onDragStarting: () => void;
	generateKey: (itemData: DraggableItemData) => string;
	highlightedItemIndex: number | null;
	setHighlightedItemIndex: (index: number | null) => void;
}

const DraggableList: FunctionComponent<DraggableListProps> = ({
	items,
	renderItem,
	onListChange,
	onDragStarting,
	generateKey,
	highlightedItemIndex,
	setHighlightedItemIndex,
}) => {
	const [currentlyBeingDragged, setCurrentlyBeingDragged] = useState<
		// biome-ignore lint/suspicious/noExplicitAny: todo
		any | null
	>(null);

	// Used to keep track of items during a drag operation
	const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([]);

	const resetDraggableItems = useCallback(() => {
		setDraggableItems(
			items.map((itemData: DraggableItemData, index: number) => ({
				data: itemData,
				index,
				isTargetGhost: false,
				isBeingDragged: false,
				isEndGhost: false,
			}))
		);
	}, [items]);

	useEffect(() => {
		resetDraggableItems();
	}, [resetDraggableItems]);

	const resetDraggingState = () => {
		setCurrentlyBeingDragged(null);
		resetDraggableItems();
	};

	// biome-ignore lint/suspicious/noExplicitAny: todo
	const onDragStart = (e: any, index: number) => {
		onDragStarting();
		setCurrentlyBeingDragged(draggableItems[index]);

		draggableItems[index].isBeingDragged = true;

		setDraggableItems([
			...draggableItems,
			{
				data: null,
				index: draggableItems.length,
				isBeingDragged: false,
				isTargetGhost: false,
				isEndGhost: true,
			},
		]);

		// Drag animation/metadata
		if (e.dataTransfer && e.target) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', e.target);
			e.dataTransfer.setDragImage(e.target, -0, -0);
		}
	};

	// biome-ignore lint/suspicious/noExplicitAny: todo
	const onDragOver = (evt: any, draggedOverIndex: number) => {
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'move';

		const ghostIndex = findIndex(draggableItems, (item) => item.isTargetGhost || false);
		if (
			currentlyBeingDragged &&
			draggableItems &&
			!draggableItems[draggedOverIndex].isTargetGhost &&
			ghostIndex + 1 !== draggedOverIndex
		) {
			// Update list of items
			const updatedList = [...draggableItems.filter((item) => !item.isTargetGhost)];
			updatedList.splice(draggedOverIndex, 0, {
				isBeingDragged: false,
				data: null,
				index: draggedOverIndex,
				isTargetGhost: true,
				isEndGhost: false,
			});

			// Return updated list
			return setDraggableItems(updatedList);
		}
	};

	const onDragEnd = () => {
		if (!draggableItems) {
			resetDraggingState();
			return;
		}

		const ghostIndex = findIndex(draggableItems, (item) => item.isTargetGhost || false);
		const startIndex = findIndex(draggableItems, (item) => item.isBeingDragged || false);

		const updatedList = draggableItems.filter((item) => !item.isEndGhost);

		if (ghostIndex !== -1) {
			// replace ghost with dragged item
			updatedList[ghostIndex] = updatedList[startIndex];

			// Remove the dragged item from its original location
			updatedList.splice(startIndex, 1);

			const movedItemIndex = findIndex(updatedList, (item) => item.isBeingDragged);

			onListChange(updatedList.map((item) => item.data));
			setHighlightedItemIndex(movedItemIndex);
		}
		resetDraggingState();
	};

	const handleRenderItem = (item: DraggableItem, index: number): ReactNode => {
		if (item.isTargetGhost) {
			return (
				<div
					className="c-draggable-list__item--target-ghost"
					key={'draggable-list__item--target-ghost'}
				></div>
			);
		} else if (item.isEndGhost) {
			return (
				<div
					className="c-draggable-list__item--end-ghost"
					key={'draggable-list__item--end-ghost'}
					onDragOver={(evt) => onDragOver(evt, index)}
				></div>
			);
		} else {
			return (
				<div
					className={clsx('c-draggable-list__item', {
						'c-draggable-list__item--is-being-dragged': item.isBeingDragged,
						'c-draggable-list__item--highlighted': index === highlightedItemIndex,
						'c-draggable-list__item--error': blockHasErrors(item.data.errors),
					})}
					onDragOver={(evt) => onDragOver(evt, index)}
					onDragEnd={onDragEnd}
					onDragStart={(e) => onDragStart(e, index)}
					draggable
					key={`draggable-list__item-${generateKey(item.data)}`}
				>
					<div className="c-draggable-list__item__content">
						<div className="o-flex u-flex-align--center">
							<div className="c-draggable-list__item__drag-handle">
								<Icon name={'menu' as IconName} />
							</div>
							{renderItem(item.data, item.index)}
						</div>
					</div>
				</div>
			);
		}
	};

	// biome-ignore lint/suspicious/noExplicitAny: todo
	const handleDragOverContainer = (evt: any) => {
		evt.preventDefault();
		evt.dataTransfer.dropEffect = 'move';
	};

	return (
		<div className={clsx('c-draggable-list')} onDragOver={handleDragOverContainer}>
			{(draggableItems || []).map((item, index) => handleRenderItem(item, index))}
		</div>
	);
};

export default DraggableList;
