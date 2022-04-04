import { useModuleRoutes, AdminCore } from '@meemoo/react-admin';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Switch } from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
	const [routes] = useModuleRoutes(false);

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
