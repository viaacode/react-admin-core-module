import type { FC } from 'react';
import React from 'react';

import type { LinkInfo } from '~core/config';
import { AdminConfigManager } from '~core/config';

const Link: FC<LinkInfo> = (props) => {
	const AdminCoreConfigLink = AdminConfigManager.getConfig().services.router.Link;
	return <AdminCoreConfigLink {...props} />;
};

export default Link;
