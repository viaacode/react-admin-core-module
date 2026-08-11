import type { HeadingTypeOption } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import type { PickerItem } from '~modules/shared/types/content-picker';

/**
 * The object types that can appear in the grid. Drives which type-icon is shown in the
 * title bar, and whether the audio "waveform" fallback is rendered instead of a thumbnail.
 */
export enum ObjectsGridItemType {
	Video = 'video',
	Audio = 'audio',
	Newspaper = 'newspaper',
	Image = 'image',
}

/**
 * A single IE-object as rendered in the grid.
 *
 * NOTE (backend contract): this is the normalised shape the component renders. The raw
 * search response is mapped to this in `BlockObjectsGrid.service.ts`. If the search proxy
 * returns different field names, adjust the mapping there — the component only depends on
 * this interface.
 */
export interface ObjectsGridItem {
	// pid / fragmentId, used for the detail-page link and as the React key.
	schemaIdentifier: string;
	// Object title, shown in the title bar.
	name: string;
	// Provider / maintainer name, shown in the title bar.
	maintainerName?: string;
	// Object type, drives the type-icon. Falls back to a generic icon when unknown.
	type?: ObjectsGridItemType;
	// Thumbnail (video / newspaper / image). Absent for audio → waveform fallback is shown.
	thumbnailUrl?: string;
}

/**
 * A single configured "fixed position": a pinned ie-object shown before the query results.
 * `mediaItem.value` holds the object's schemaIdentifier (pid / fragmentId).
 */
export interface ObjectsGridFixedPosition {
	mediaItem: PickerItem;
}

export interface BlockObjectsGridProps extends DefaultComponentProps {
	// Optional heading shown above the grid.
	title?: string;
	titleType?: HeadingTypeOption;
	// Raw hetarchief.be search URL that fills the grid, e.g.
	// https://hetarchief.be/zoeken?aanbieders=OR-...&page=1
	searchQuery: string;
	// 0..3 fixed positions, always shown first (as landscape tiles on rows 1-2).
	elements?: ObjectsGridFixedPosition[];
	// Block-wide background color (from the block-level "Blok-opties").
	backgroundColor?: string;
}
