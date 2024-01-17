export interface DraggableItem {
	// Info needed to render the item from json data to a ReactNode
	data: any;

	// Index in the list of items
	index: number;

	// Set to true for the element that is currently being dragged
	isBeingDragged: boolean;

	// Set to true for a "fake" item that indicated where the current drop location of the drag action is
	isTargetGhost: boolean;

	// Set to true for a "fake" item that is added to the end, so we can move items to the last position (before the fake isEndGhost item)
	isEndGhost: boolean;
}
