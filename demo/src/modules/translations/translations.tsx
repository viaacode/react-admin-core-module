import { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { TRANSLATIONS_PATH } from '~modules/translations/translations.const';
import { TranslationsOverviewPage } from './TranslationsOverviewPage';
import { TranslationsOverviewPageV2 } from './TranslationsOverviewPageV2';

export const renderAdminTranslationsRoutes = (): ReactNode[] => [
	<Route
		key={TRANSLATIONS_PATH.TRANSLATIONS}
		render={() => <TranslationsOverviewPage />}
		exact
		path={TRANSLATIONS_PATH.TRANSLATIONS}
	/>,
	<Route
		key={TRANSLATIONS_PATH.TRANSLATIONS_V2}
		render={() => <TranslationsOverviewPageV2 />}
		exact
		path={TRANSLATIONS_PATH.TRANSLATIONS_V2}
	/>,
];
