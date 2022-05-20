import { ROUTE_PARTS } from "~modules/shared/consts/routes";

export const TRANSLATIONS_PATH = {
	TRANSLATIONS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.translations}`,
};

export interface TranslationsOverviewRef {
	onSave: () => void;
}
