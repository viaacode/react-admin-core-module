import type { FC } from 'react';
import React from 'react';
import { AdminConfigManager } from '~core/config/config.class.js';
import type { LinkInfo } from '~core/config/config.types.js';

export const Link: FC<LinkInfo> = (props) => {
	const AdminCoreConfigLink = AdminConfigManager.getConfig().services.router.Link;
	return <AdminCoreConfigLink {...props} />;
};
