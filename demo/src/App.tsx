import React from 'react';
import { AdminCore } from './react-admin';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Switch } from 'react-router-dom';
import { NavigationOverview } from './react-admin/modules/navigation/pages';

const queryClient = new QueryClient();

function App() {
	// const [routes] = useModuleRoutes(false);

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<div className="App">
					react admin demo app
					{/*<Switch>*/}
					{/*{routes?.length > 0 && AdminCore.routes.render(routes)}*/}
					<NavigationOverview />
					{/*</Switch>*/}
				</div>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;

