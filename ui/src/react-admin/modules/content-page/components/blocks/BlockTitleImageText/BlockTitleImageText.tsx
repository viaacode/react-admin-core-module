import type { DefaultProps } from '@viaa/avo2-components';
import { Container, convertToHtml, Image, Spacer } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React from 'react';
import Html from '~shared/components/Html/Html';

export interface BlockTitleImageTextProps extends DefaultProps {
	title?: string;
	imageSource?: string;
	imageDescription?: string;
	text?: string;
}

export const BlockTitleImageText: FunctionComponent<BlockTitleImageTextProps> = ({
	className,
	title,
	imageSource,
	imageDescription = '',
	text = '',
}) => {
	return (
		<Spacer className={className} margin="top-large">
			<Container size="small">
				{title && <h2 className="c-h2">{title}</h2>}
				{imageSource && <Image src={imageSource} alt={imageDescription} wide={true} />}
				{text && (
					<Spacer margin="top">
						<Html content={convertToHtml(text)} />
					</Spacer>
				)}
			</Container>
		</Spacer>
	);
};
