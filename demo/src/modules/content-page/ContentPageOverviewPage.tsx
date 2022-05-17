import { Button, Flex } from '@viaa/avo2-components';
import { ContentPageOverview } from '~modules/content-page';
import { FC } from 'react';
import { CommonUser } from '~modules/user/user.types';

export const ContentPageOverviewPage: FC<{ user: CommonUser }> = ({ user }) => {
	return (
		<>
			<Flex>
				<h1>Content pages</h1>
				<a href="/beheer/content/maak">
					<Button type="primary">Nieuwe pagina</Button>
				</a>
			</Flex>
			<ContentPageOverview user={user} />
		</>
	);
};
