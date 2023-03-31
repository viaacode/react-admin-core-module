import React, { FC } from 'react';

import { AdminConfigManager, LinkInfo } from '~core/config';

const Link: FC<LinkInfo> = (props) => {
	const AdminCoreConfigLink = AdminConfigManager.getConfig().services.router.Link;
	return <AdminCoreConfigLink {...props} />;
};

export default Link;
