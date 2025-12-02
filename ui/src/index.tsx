// noinspection ES6PreferShortImport

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setDefaultOptions } from 'date-fns';
import { nlBE } from 'date-fns/locale';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from '~shared/helpers/use-query-params-ssr';
import App from './App';
import { ReactRouter7Adapter } from './shared/helpers/routes/react-router-v7-adapter-for-use-query-params';
import { initI18n } from './shared/translations/i18n';

const adminCoreApiUrl = 'http://localhost:3300';

// biome-ignore lint/suspicious/noExplicitAny: todo
declare const document: any;

// Set global locale for date-fns functions:
setDefaultOptions({ locale: nlBE });

const queryClient = new QueryClient();

function renderApp() {
	const root = createRoot(document.getElementById('root'));
	root.render(
		// Disabled strict mode because of issues with react router v5
		// https://stackoverflow.com/questions/72107964/url-change-successfully-but-components-not-rendered-in-react-v18
		// <React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<QueryParamProvider adapter={ReactRouter7Adapter}>
					<App />
				</QueryParamProvider>
			</BrowserRouter>
		</QueryClientProvider>
		// </React.StrictMode>
	);
}

async function bootstrapApp() {
	await initI18n(adminCoreApiUrl);
	renderApp();
}

bootstrapApp().catch((err) => console.error(err));

console.info(
	`
This is the demo app of the admin-core.
This code should never execute inside the clients that use the admin-core.
If you see this message in the client, the index.tsx file in the admin-core is getting bundled inside the admin-core-ui bundle.
Figure out why and make sure that doesn't happen
`
);
