import React from 'react';
import { Permission } from '~modules/user/user.types';
import { Idp } from '~modules/user/user.types';
import { ContentPageOverview } from './react-admin/modules/content-page/pages';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { Route } from 'react-router-dom';

import './react-admin/modules/shared/styles/main.scss';

const queryClient = new QueryClient();

const mockUser = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	permissions: [Permission.EDIT_ANY_CONTENT_PAGES],
};

function App() {
	// const [routes] = useModuleRoutes(false);

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<QueryParamProvider ReactRouterRoute={Route}>
					<div className="App">
						react admin demo app
						{/*<Switch>*/}
						{/*{routes?.length > 0 && AdminCore.routes.render(routes)}*/}
						<ContentPageOverview user={mockUser} />
						{/*</Switch>*/}
					</div>
				</QueryParamProvider>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;

