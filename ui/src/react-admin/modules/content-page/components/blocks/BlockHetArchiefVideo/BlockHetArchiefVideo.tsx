import type { DefaultProps } from '@viaa/avo2-components';
import { Container } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React from 'react';
import { FlowPlayerWrapper } from '~shared/components/FlowPlayerWrapper/FlowPlayerWrapper';
import type { FlowPlayerWrapperProps } from '~shared/components/FlowPlayerWrapper/FlowPlayerWrapper.types';

export interface BlockHetArchiefVideoProps extends DefaultProps {
	flowPlayerWrapperProps: FlowPlayerWrapperProps;
}

export const BlockHetArchiefVideo: FunctionComponent<BlockHetArchiefVideoProps> = ({
	className,
	flowPlayerWrapperProps,
}) => {
	return (
		<Container className={className} mode="vertical">
			<div className="u-aspect-ratio-16-9">
				<FlowPlayerWrapper {...flowPlayerWrapperProps} />
			</div>
		</Container>
	);
};
