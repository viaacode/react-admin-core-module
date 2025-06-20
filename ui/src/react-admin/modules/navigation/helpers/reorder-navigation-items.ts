import type { NavigationItem } from "~modules/navigation/navigation.types";

export const reindexNavigationItems = (
	items: NavigationItem[],
): NavigationItem[] =>
	items.map((item, index) => {
		item.position = index;
		// Remove properties that we don't need for save
		// biome-ignore lint/suspicious/noExplicitAny: todo
		delete (item as any).__typename;

		return item;
	});
