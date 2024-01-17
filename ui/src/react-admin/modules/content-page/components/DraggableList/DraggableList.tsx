import { Icon, IconName } from '@viaa/avo2-components';
import classNames from 'classnames';
import React, { FunctionComponent, ReactNode, useState } from 'react';

import './DraggableList.scss';

export interface DraggableListProps {
	items: (any & { index: number })[];
	renderItem: (item: any) => ReactNode;
	onListChange: (updatedList: JSX.Element[]) => void;
	generateKey?: (item: any) => string;
}

const DraggableList: FunctionComponent<DraggableListProps> = ({
	items,
	renderItem,
	onListChange,
	generateKey = () => 'id',
}) => {
	const [currentlyBeingDragged, setCurrentlyBeingDragged] = useState<any | null>(null);

	const onDragStart = (e: any, index: number) => {
		setCurrentlyBeingDragged(items[index]);

		// Drag animation/metadata
		if (e.dataTransfer && e.target) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/html', e.target);
			e.dataTransfer.setDragImage(e.target, 20, 20);
		}
	};

	const onDragOver = (draggedOverIndex: number) => {
		if (currentlyBeingDragged && currentlyBeingDragged !== items[draggedOverIndex]) {
			// Update list of items
			const updatedList = items.filter(
				(item) => generateKey(item) !== generateKey(currentlyBeingDragged)
			);
			updatedList.splice(draggedOverIndex, 0, currentlyBeingDragged);

			// Return updated list
			return onListChange(updatedList);
		}
	};

	const onDragEnd = () => {
		setCurrentlyBeingDragged(null);
	};

	return (
		<div
			className={classNames(
				'c-draggable-list c-table-view',
				{ 'draggable-container--is-dragging': currentlyBeingDragged },
				{ 'draggable-container--over': currentlyBeingDragged }
			)}
		>
			{items.map((item, index) => (
				<div
					className={classNames(
						'c-table-view__item',
						'c-table-view__item--type-action',
						{
							'draggable-source--is-dragging': item === currentlyBeingDragged,
						},
						{ 'draggable--over': item === currentlyBeingDragged }
					)}
					onDragOver={() => onDragOver(index)}
					onDragEnd={onDragEnd}
					onDragStart={(e) => onDragStart(e, index)}
					draggable
					key={`draggable-item-${generateKey(item)}`}
				>
					<div className="o-grid-col-flex">
						<div className="o-flex">{renderItem(item)}</div>
					</div>
					<div className="o-grid-col-static">
						<div className="u-opacity-50">
							<Icon name={IconName.menu} />
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default DraggableList;
