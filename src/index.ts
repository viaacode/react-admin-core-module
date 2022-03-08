import { default as AdminCore } from './core';
import { NAVIGATION_ROUTES_CONFIG } from './modules/navigation';

AdminCore.routes.initialize([NAVIGATION_ROUTES_CONFIG]);

export { AdminCore };

export * from './hooks';
