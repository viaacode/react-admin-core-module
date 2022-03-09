import { useModuleRoutes, AdminCore } from '@meemoo/react-admin';
import { BrowserRouter, Switch } from 'react-router-dom';

AdminCore.routes.register({
	path: '/users',
	component: () => <h1>Users</h1>
});

function App() {
	const [routes] = useModuleRoutes(false);
	console.log(routes);

	return (
		<BrowserRouter>
			<div className="App">
				<Switch>
					{routes && AdminCore.routes.render(routes)}
				</Switch>
			</div>
		</BrowserRouter>
	);
}

export default App;
