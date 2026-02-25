import { asyncNoop } from 'es-toolkit';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import type { NavigateFunction } from '~core/config';
import { Link } from '~shared/components/Link';
import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { useLocation } from '~shared/hooks/useLocation.ts';
import { getAdminCoreConfig, setAdminCoreConfig } from './shared/helpers/admin-core-config';

import '@viaa/avo2-components/styles.css';
import '@meemoo/react-components/styles.css';
import './shared/styles/demo-app-styles.scss';
import './react-admin/modules/shared/styles/main.scss';
import './App.scss';

function App() {
	const [isAdminCoreConfigLoaded, setIsAdminCoreConfigLoaded] = useState(false);
	const navigateFunc = useNavigate();
	const location = useLocation();

	/**
	 * Set admin core config
	 */
	useEffect(() => {
		setAdminCoreConfig(navigateFunc as NavigateFunction);
		setIsAdminCoreConfigLoaded(true);
	}, [navigateFunc]);

	const renderNavigationBar = () => {
		if (location?.pathname.startsWith('/admin')) {
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
