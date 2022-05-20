import { Button, Flex } from '@viaa/avo2-components';
import { ContentPageOverview } from '~modules/content-page';
import { FC } from 'react';
import { ROUTE_PARTS } from '~modules/shared/consts/routes';

export const ContentPageOverviewPage: FC = () => {
	return (
		<>
			<Flex>
				<h1>Content pages</h1>
				<a href={`/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/${ROUTE_PARTS.create}`}>
					<Button type="primary">Nieuwe pagina</Button>
				</a>
			</Flex>
			<ContentPageOverview />
		</>
	);
};
