import { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { TRANSLATIONS_PATH } from '~modules/translations/translations.const';
import { TranslationsOverview } from '~modules/translations/views';
import { CommonUser } from '~modules/user/user.types';


export const renderAdminTranslationsRoutes = (user: CommonUser): ReactNode[] => [
	<Route
		key={TRANSLATIONS_PATH.TRANSLATIONS}
		render={() => <TranslationsOverview user={user} /> }
		exact
		path={TRANSLATIONS_PATH.TRANSLATIONS}
	/>,
];
