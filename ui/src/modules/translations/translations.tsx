import type { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { TRANSLATIONS_PATH } from '~modules/translations/translations.const';
import { TranslationsOverviewPage } from './TranslationsOverviewPage';

export const renderAdminTranslationsRoutes = (): ReactNode[] => [
	<Route
		key={TRANSLATIONS_PATH.TRANSLATIONS}
		render={() => <TranslationsOverviewPage />}
		exact
		path={TRANSLATIONS_PATH.TRANSLATIONS}
	/>,
];
