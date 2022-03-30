import { useModuleRoutes, AdminCore, useNavigation } from '@meemoo/react-admin';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Switch } from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
	const [routes] = useModuleRoutes(false);
	const [loadingNavItems, navItems] = useNavigation(routes);

	console.log(loadingNavItems, navItems);


	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter >
				<div className="App">
					<Switch>
						{routes?.length > 0 && AdminCore.routes.render(routes)}
					</Switch>
				</div>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
