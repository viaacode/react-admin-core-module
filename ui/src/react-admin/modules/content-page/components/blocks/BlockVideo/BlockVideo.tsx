import { FlowPlayer, FlowPlayerProps } from '@meemoo/react-components';
import { Container, DefaultProps } from '@viaa/avo2-components';
import React, { FunctionComponent } from 'react';

export interface BlockVideoProps extends DefaultProps {
	flowPlayerProps: FlowPlayerProps;
}

export const BlockVideo: FunctionComponent<BlockVideoProps> = ({ className, flowPlayerProps }) => {
	return (
		<Container className={className} mode="vertical">
			<div className="u-aspect-ratio-16-9">
				<FlowPlayer {...flowPlayerProps} />
			</div>
		</Container>
	);
};
