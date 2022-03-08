import React, { FC } from 'react';

import AdminCore from '../../../../core';

import { RenderChildRoutesProps } from './RenderChildRoutes.types';

const RenderChildRoutes: FC<RenderChildRoutesProps> = ({
	routes,
	guardsMeta = {},
	extraOptions = {},
}) => {
	return (
		<>
			{AdminCore.routes.render(
				routes?.map((route) => ({
					...route,
					guardOptions: {
						...route.guardOptions,
						meta: guardsMeta,
					},
				})),
				extraOptions
			)}
		</>
	);
};

export default RenderChildRoutes;
