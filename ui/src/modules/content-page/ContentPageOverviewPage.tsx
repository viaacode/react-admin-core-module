import { Button, Flex } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { FC } from 'react';
import { AdminConfigManager } from '~core/config';

import ContentPageOverview from '~modules/content-page/views/ContentPageOverview';

export const ContentPageOverviewPage: FC<{ commonUser?: Avo.User.CommonUser }> = ({
	commonUser,
}) => {
	return (
		<>
			<Flex>
				<h1>Content pages</h1>
				<a href={AdminConfigManager.getAdminRoute('CONTENT_PAGE_CREATE')}>
					<Button type="primary">Nieuwe pagina</Button>
				</a>
			</Flex>
			<ContentPageOverview commonUser={commonUser} />
		</>
	);
};
