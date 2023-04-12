import { Container, Flex } from '@viaa/avo2-components';
import React, { FC } from 'react';
import Loader from '../Loader/Loader';

export const CenteredSpinner: FC = () => {
	return (
		<Container mode="vertical">
			<Flex orientation="horizontal" center>
				<Loader />
			</Flex>
		</Container>
	);
};
