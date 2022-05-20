import { Button, Flex } from '@viaa/avo2-components';
import { ContentPageOverview } from '~modules/content-page';
import { FC } from 'react';

export const ContentPageOverviewPage: FC = () => {
	return (
		<>
			<Flex>
				<h1>Content pages</h1>
				<a href="/beheer/content/maak">
					<Button type="primary">Nieuwe pagina</Button>
				</a>
			</Flex>
			<ContentPageOverview />
		</>
	);
};
