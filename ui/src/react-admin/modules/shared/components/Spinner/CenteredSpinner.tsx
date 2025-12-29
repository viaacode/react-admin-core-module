import { Container, Flex } from '@viaa/avo2-components';
import type { FC } from 'react';
import React from 'react';
import { Loading } from '../Loading/Loading';

interface CenteredSpinnerProps {
	locationId: string;
}

export const CenteredSpinner: FC<CenteredSpinnerProps> = ({ locationId }) => {
	return (
		<Container mode="vertical">
			<Flex orientation="horizontal" center>
				<Loading locationId={locationId} />
			</Flex>
		</Container>
	);
};
