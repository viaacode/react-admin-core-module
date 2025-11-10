import { Button, Flex } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import type { FC } from 'react';
import { AdminConfigManager } from '~core/config/config.class.js';

import { ContentPageOverview } from '~modules/content-page/views/ContentPageOverview.js';

export const ContentPageOverviewPage: FC<{ commonUser?: Avo.User.CommonUser }> = ({
	commonUser,
}) => {
	return (
		<>
			<Flex>
				<h1>Content pages</h1>
				<a href={AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_CREATE')}>
					<Button type="primary">Nieuwe pagina</Button>
				</a>
			</Flex>
			<ContentPageOverview commonUser={commonUser} />
		</>
	);
};
