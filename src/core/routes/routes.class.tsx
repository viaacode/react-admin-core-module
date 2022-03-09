import React, { ReactElement, ReactNode } from 'react';
import { generatePath, Redirect, RouteComponentProps, Switch, SwitchProps } from 'react-router-dom';
import { GuardedRoute, GuardProvider, GuardProviderProps } from 'react-router-guards';
import { Observable, ReplaySubject } from 'rxjs';

import { ModuleRouteConfig } from './routes.types';

export default class Routes {
	private registeredRoutes: ModuleRouteConfig[] = [];
	private registeredRoutesSubject: ReplaySubject<ModuleRouteConfig[]> = new ReplaySubject(1);

	public routesChanges: Observable<ModuleRouteConfig[] | null> =
		this.registeredRoutesSubject.asObservable();

	public initialize(defaultRoutes: ModuleRouteConfig[]): void {
		defaultRoutes.forEach((routesConfig) => {
			this.register(routesConfig);
		});
	}

	public register(routeConfig: ModuleRouteConfig): void {
		const defaultRouteExists = this.registeredRoutes.find(
			(route: ModuleRouteConfig) => route.isDefaultRoute
		);

		if (defaultRouteExists && routeConfig.isDefaultRoute) {
			console.warn('Default route already exists.');
		}

		const newRouteConfig = {
			...routeConfig,
			isDefaultRoute: defaultRouteExists ? false : routeConfig.isDefaultRoute,
		};

		this.registeredRoutes = [...this.registeredRoutes, newRouteConfig];

		this.registeredRoutesSubject.next(this.registeredRoutes);
	}

	public render(
		routes: ModuleRouteConfig[] | undefined,
		extraProps: { [key: string]: unknown } = {},
		switchProps: SwitchProps = {},
		guardProviderProps: GuardProviderProps = {}
	): ReactElement | null {
		const redirectRoute = routes?.find((route) => route.isDefaultRoute);

		return routes ? (
			<GuardProvider {...guardProviderProps}>
				<Switch {...switchProps}>
					{redirectRoute && <Redirect exact to={redirectRoute.path} />}
					{routes.map((route, index) => {
						return (
							<GuardedRoute
								key={route.key || index}
								path={route.path}
								strict={route.strict}
								{...route.guardOptions}
								render={(props: RouteComponentProps): ReactNode =>
									route.redirect && props.match.isExact ? (
										<>
											<Redirect
												from={route.path}
												to={generatePath(route.redirect, {
													...props.match.params,
												})}
											/>
											<route.component
												{...props}
												{...extraProps}
												route={route}
											/>
										</>
									) : (
										<route.component {...props} {...extraProps} route={route} />
									)
								}
							/>
						);
					})}
				</Switch>
			</GuardProvider>
		) : null;
	}
}
