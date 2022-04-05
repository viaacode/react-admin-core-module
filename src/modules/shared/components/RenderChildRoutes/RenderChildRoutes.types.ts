import { ModuleRouteConfig } from '~core/routes';

export interface RenderChildRoutesProps {
	routes?: ModuleRouteConfig[];
	guardsMeta?: Record<string, unknown>;
	extraOptions?: Record<string, unknown>;
}
