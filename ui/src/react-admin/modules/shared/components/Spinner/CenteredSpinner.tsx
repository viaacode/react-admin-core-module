import { Container, Flex, Spinner } from '@viaa/avo2-components';
import React, { FC } from 'react';

export const CenteredSpinner: FC = () => {
	return (
		<Container mode="vertical">
			<Flex orientation="horizontal" center>
				<Spinner size="large" />
			</Flex>
		</Container>
	);
};
