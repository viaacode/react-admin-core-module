import { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { TRANSLATIONS_PATH } from '~modules/translations/translations.const';
import { CommonUser } from '~modules/user/user.types';
import { TranslationsOverviewPage } from './TranslationsOverviewPage';


export const renderAdminTranslationsRoutes = (user: CommonUser): ReactNode[] => [
	<Route
		key={TRANSLATIONS_PATH.TRANSLATIONS}
		render={() => <TranslationsOverviewPage user={user} /> }
		exact
		path={TRANSLATIONS_PATH.TRANSLATIONS}
	/>,
];
