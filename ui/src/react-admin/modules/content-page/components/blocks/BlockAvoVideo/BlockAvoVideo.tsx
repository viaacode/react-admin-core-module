import type { FlowPlayerProps } from '@meemoo/react-components';
import { FlowPlayer } from '@meemoo/react-components';
import type { DefaultProps } from '@viaa/avo2-components';
import { Container } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React from 'react';

export interface BlockAvoVideoProps extends DefaultProps {
	flowPlayerProps: FlowPlayerProps;
}

export const BlockAvoVideo: FunctionComponent<BlockAvoVideoProps> = ({
	className,
	flowPlayerProps,
}) => {
	return (
		<Container className={className} mode="vertical">
			<div className="u-aspect-ratio-16-9">
				<FlowPlayer {...flowPlayerProps} />
			</div>
		</Container>
	);
};
