import { equals } from 'ramda';
import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import Core from '../../core';
import { ModuleRouteConfig } from '../../core/routes';

const useModuleRoutes = (modulesLoading = true): [ModuleRouteConfig[]] => {
	const [routes, setRoutes] = useState<ModuleRouteConfig[]>([]);

	useEffect(() => {
		if (modulesLoading) {
			return;
		}

		const destroyed$: Subject<boolean> = new Subject<boolean>();
		Core.routes.routesChanges.pipe(takeUntil(destroyed$)).subscribe((newRoutes) => {
			if (equals(routes, newRoutes) || !newRoutes) {
				return;
			}

			setRoutes(newRoutes);
		});

		return () => {
			destroyed$.next(true);
			destroyed$.complete();
		};

		// Run effect only once when modules are done loading.
		// Otherwise the subscription will be set multiple times.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modulesLoading]);

	return [routes];
};

export default useModuleRoutes;
