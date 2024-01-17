import { Icon, IconName } from '@viaa/avo2-components';
import classNames from 'classnames';
import { findIndex } from 'lodash-es';
import React, { FunctionComponent, ReactNode, useCallback, useEffect, useState } from 'react';
import { DraggableItem } from './DraggableList.types';

import './DraggableList.scss';

// TODO replace this with a generic T type
export type DraggableItemData = any;

export interface DraggableListProps {
	items: DraggableItemData[];
	renderItem: (itemData: DraggableItemData, index: number) => ReactNode;
	onListChange: (updatedList: DraggableItemData[]) => void;
	onDragStarting: () => void;
	generateKey: (itemData: DraggableItemData) => string;
}

const DraggableList: FunctionComponent<DraggableListProps> = ({
	items,
	renderItem,
	onListChange,
	onDragStarting,
	generateKey,
}) => {
	const [currentlyBeingDragged, setCurrentlyBeingDragged] = useState<any | null>(null);

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
			e.dataTransfer.setDragImage(e.target, 20, 20);
		}
	};

	const generateInternalKey = (item: DraggableItem): string => {
		if (item.isTargetGhost) {
			return 'target-ghost';
		}
		if (item.isEndGhost) {
			return 'end-ghost';
		}
		return generateKey(item.data);
	};

	const onDragOver = (draggedOverIndex: number) => {
		console.log('drag over: ' + draggedOverIndex);
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

			onListChange(updatedList.map((item) => item.data));
		}
		resetDraggingState();
	};

	const handleRenderItem = (item: DraggableItem, index: number): ReactNode => {
		if (item.isTargetGhost) {
			return <div className="c-draggable-list__item--target-ghost"></div>;
		} else if (item.isEndGhost) {
			return (
				<div
					className="c-draggable-list__item--end-ghost"
					onDragOver={() => onDragOver(index)}
				></div>
			);
		} else {
			return (
				<div
					className={classNames('c-draggable-list__item', {
						'c-draggable-list__item--is-being-dragged': item.isBeingDragged,
					})}
					onDragOver={() => onDragOver(index)}
					onDragEnd={onDragEnd}
					onDragStart={(e) => onDragStart(e, index)}
					draggable
					key={`draggable-list__item-${generateInternalKey(item)}`}
				>
					<div className="c-draggable-list__item__drag-handle">
						<Icon name={IconName.menu} />
					</div>
					<div className="c-draggable-list__item__content">
						<div className="o-flex">{renderItem(item.data, item.index)}</div>
					</div>
				</div>
			);
		}
	};

	return (
		<div className={classNames('c-draggable-list')}>
			{(draggableItems || []).map((item, index) => handleRenderItem(item, index))}
		</div>
	);
};

export default DraggableList;
