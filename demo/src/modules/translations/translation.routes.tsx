import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { ROUTE_PARTS } from '~modules/shared/consts/routes';

import { CommonUser } from '~modules/user/user.types';
import { TranslationsOverview } from '~modules/translations/pages';

export const TRANSLATION_PATH = {
	TRANSLATIONS_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.translations}`,
};

export const renderAdminTranslationRoutes = (user: CommonUser): ReactNode[] => {
	return [
		<Route
			key={TRANSLATION_PATH.TRANSLATIONS_OVERVIEW}
			render={() => <TranslationsOverview />}
			exact
			path={TRANSLATION_PATH.TRANSLATIONS_OVERVIEW}
		/>,
	];
};
