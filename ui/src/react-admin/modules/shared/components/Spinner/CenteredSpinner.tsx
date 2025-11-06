import { Container, Flex } from '@viaa/avo2-components';
import type { FC } from 'react';
import React from 'react';
import { Loader } from '../Loader/Loader.js';

export const CenteredSpinner: FC = () => {
	return (
		<Container mode="vertical">
			<Flex orientation="horizontal" center>
				<Loader />
			</Flex>
		</Container>
	);
};
