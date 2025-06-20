import { useQuery } from "@tanstack/react-query";
import { NavigationService } from "~modules/navigation/navigation.service";
import { QUERY_KEYS } from "~shared/types";
import { reindexNavigationItems } from "../helpers/reorder-navigation-items";

export const useGetNavigationBars = () => {
	return useQuery([QUERY_KEYS.GET_NAVIGATIONS], async () => {
		const navItems = await NavigationService.fetchNavigationBars();
		reindexNavigationItems(navItems);
		return navItems;
	});
};
