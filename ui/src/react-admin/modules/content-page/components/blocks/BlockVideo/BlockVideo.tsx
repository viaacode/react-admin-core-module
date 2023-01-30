import { FlowPlayer, FlowPlayerProps } from '@meemoo/react-components';
import { AspectRatioWrapper, Container, DefaultProps } from '@viaa/avo2-components';
import React, { FunctionComponent } from 'react';

export interface BlockVideoProps extends DefaultProps {
	flowPlayerProps: FlowPlayerProps;
}

export const BlockVideo: FunctionComponent<BlockVideoProps> = ({ className, flowPlayerProps }) => {
	return (
		<Container className={className} mode="vertical">
			<AspectRatioWrapper aspect="16:9">
				<FlowPlayer {...flowPlayerProps} />
			</AspectRatioWrapper>
		</Container>
	);
};
