import { FlowPlayer, FlowPlayerProps } from '@meemoo/react-components';
import {
	Column,
	Container,
	convertToHtml,
	DefaultProps,
	ExpandableContainer,
	Grid,
	Spacer,
} from '@viaa/avo2-components';
import React, { FunctionComponent } from 'react';

export interface BlockVideoTitleTextButtonProps extends DefaultProps {
	flowPlayerProps: FlowPlayerProps;
	title?: string;
	titleLink?: string;
	text?: string;
	collapsedHeight?: number;
	showCopyright?: boolean;
}

export const BlockVideoTitleTextButton: FunctionComponent<BlockVideoTitleTextButtonProps> = ({
	className,
	flowPlayerProps,
	title,
	titleLink,
	text = '',
	collapsedHeight = 220,
}) => {
	return (
		<Container className={className} mode="horizontal">
			<Spacer>
				<Grid>
					<Column size="2-6">
						<div className="u-aspect-ratio-16-9">
							<FlowPlayer {...flowPlayerProps} />
						</div>
					</Column>
					<Column size="2-6">
						<div className="c-content">
							<ExpandableContainer collapsedHeight={collapsedHeight}>
								{title && (
									<h2>
										<a
											href={titleLink}
											style={{ color: 'black', textDecoration: 'none' }}
										>
											{title}
										</a>
									</h2>
								)}
								{text && (
									<p dangerouslySetInnerHTML={{ __html: convertToHtml(text) }} />
								)}
							</ExpandableContainer>
						</div>
					</Column>
				</Grid>
			</Spacer>
		</Container>
	);
};
