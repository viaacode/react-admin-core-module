import { asyncNoop } from 'es-toolkit';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { Link } from '~shared/components/Link';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { getAdminCoreConfig, setAdminCoreConfig } from './shared/helpers/admin-core-config';
import './react-admin/modules/shared/styles/main.scss';
import './App.scss';
import type { NavigateFunction } from '~core/config';

function App() {
	const [isAdminCoreConfigLoaded, setIsAdminCoreConfigLoaded] = useState(false);
	const navigateFunc = useNavigate();

	/**
	 * Set admin core config
	 */
	useEffect(() => {
		setAdminCoreConfig(navigateFunc as NavigateFunction);
		setIsAdminCoreConfigLoaded(true);
	}, [navigateFunc]);

	const renderNavigationBar = () => {
		if (location.pathname.startsWith('/admin')) {
			return null;
		}
		return (
			<div className="admin-app__navbar">
				<h1>Navigation bar</h1>
				<Link to={getAdminCoreConfig(asyncNoop).routes.ADMIN_DASHBOARD}>beheer</Link>
			</div>
		);
	};

	const renderApp = () => {
		if (!isAdminCoreConfigLoaded) {
			return <CenteredSpinner locationId="app--loading-admin-core-config" />;
		}
		return (
			<>
				{renderNavigationBar()}
				<Outlet />
			</>
		);
	};

	return renderApp();
}

export default App;
