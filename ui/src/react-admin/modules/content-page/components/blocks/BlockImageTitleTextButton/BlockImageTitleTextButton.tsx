import {
	Button,
	Column,
	Container,
	convertToHtml,
	DefaultProps,
	Grid,
	Image,
	Spacer,
} from '@viaa/avo2-components';
import classnames from 'classnames';
import React, { FunctionComponent, ReactNode } from 'react';

import './BlockImageTitleTextButton.scss';

export interface BlockImageTitleTextButtonProps extends DefaultProps {
	imageSource: string;
	imageDescription?: string;
	title?: ReactNode | string;
	subtitle?: ReactNode | string;
	text?: ReactNode | string;
	buttonLabel?: string;
	onClick?: () => void;
}

export const BlockImageTitleTextButton: FunctionComponent<BlockImageTitleTextButtonProps> = ({
	className,
	imageSource,
	imageDescription,
	title = '',
	subtitle = '',
	text = '',
	buttonLabel,
	onClick,
}) => {
	const renderText = (text: string | ReactNode, className?: string) => {
		if (text) {
			if (typeof text === 'string') {
				return (
					<p
						className={className}
						dangerouslySetInnerHTML={{ __html: convertToHtml(text as string) }}
					/>
				);
			}
			return text;
		}
		return null;
	};

	return (
		<Container
			className={classnames('c-block-image-title-text-button', className)}
			mode="vertical"
		>
			<Container mode="horizontal">
				<Grid>
					<Column size="2-4">
						<Image src={imageSource} alt={imageDescription} />
					</Column>
					<Column size="2-8">
						<div className="c-content">
							{title && <h2>{title}</h2>}
							{renderText(subtitle, 'a-subtitle')}
							{renderText(text)}
							{buttonLabel && (
								<Spacer margin="top">
									<Button
										label={buttonLabel}
										type="secondary"
										onClick={() => onClick && onClick()}
									/>
								</Spacer>
							)}
						</div>
					</Column>
				</Grid>
			</Container>
		</Container>
	);
};
