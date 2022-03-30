import { ComponentType } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { GuardedRouteProps } from 'react-router-guards';

export type { GuardFunction, PageComponent } from 'react-router-guards';

export interface RouteConfigComponentProps<
	Params extends { [K in keyof Params]?: string } = Record<string, string>
> extends RouteComponentProps<Params> {
	route: ModuleRouteConfig;
}

export interface ChildRouteConfigComponentProps<
	Params extends { [K in keyof Params]?: string } = Record<string, string>
> extends RouteComponentProps<Params> {
	route: ChildModuleRouteConfig;
}

export interface RouteNavigationConfig {
	label: string;
	order?: number;
	parentPath?: string;
	isVisible?: IsVisibleFunction[];
	params?: Record<string, string>;
}

export type RouteGuardOptions = Pick<
	GuardedRouteProps,
	'guards' | 'ignoreGlobal' | 'loading' | 'error' | 'meta'
>;

export interface BaseRouteConfig {
	key?: string;
	label?: string;
	path: string;
	routes?: ChildModuleRouteConfig[];
	exact?: boolean;
	strict?: boolean;
	redirect?: string;
	guardOptions?: RouteGuardOptions;
	navigation?: RouteNavigationConfig;
	matchOptions?: {
		exact?: boolean;
		strict?: boolean;
	};
}

export interface ModuleRouteConfig extends BaseRouteConfig {
	component: ComponentType<RouteConfigComponentProps>;
	isDefaultRoute?: boolean;
}

export interface ChildModuleRouteConfig extends BaseRouteConfig {
	component: ComponentType<ChildRouteConfigComponentProps>;
}

export type Next = () => void;

export type IsVisibleFunction = (meta: Record<string, unknown>, next: Next) => void;
