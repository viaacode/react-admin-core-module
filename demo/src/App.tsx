import React from 'react';
import { ContentPageOverview } from './react-admin/modules/content-page/pages';
import { AdminCore } from './react-admin';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Switch } from 'react-router-dom';

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
					<ContentPageOverview />
					{/*</Switch>*/}
				</div>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;

