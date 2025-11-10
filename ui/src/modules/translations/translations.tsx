import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { TRANSLATIONS_PATH } from '~modules/translations/translations.const.js';
import { TranslationsOverviewPage } from './TranslationsOverviewPage.js';

export const renderAdminTranslationsRoutes = (): ReactNode[] => [
	<Route
		path={TRANSLATIONS_PATH.TRANSLATIONS}
		Component={TranslationsOverviewPage}
		key={TRANSLATIONS_PATH.TRANSLATIONS}
	/>,
];
