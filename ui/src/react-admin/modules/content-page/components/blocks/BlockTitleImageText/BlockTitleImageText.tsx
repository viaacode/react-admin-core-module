import type { DefaultProps } from '@viaa/avo2-components';
import { Container, convertToHtml, Spacer } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React from 'react';
import Html from '~shared/components/Html/Html';
import { OptimizedImage } from '~shared/components/OptimizedImage/OptimizedImage';
import { getImageSizesUpTo } from '~shared/helpers/images';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';

export interface BlockTitleImageTextProps extends DefaultProps {
	title?: string;
	imageSource?: string;
	imageDescription?: string;
	text?: string;
}

// The small container is 56rem wide
const IMAGE_DISPLAY_WIDTH = 560;

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
				{imageSource && (
					<OptimizedImage
						src={imageSource}
						displayWidth={IMAGE_DISPLAY_WIDTH}
						sizes={getImageSizesUpTo(IMAGE_DISPLAY_WIDTH)}
						alt={imageDescription}
						wide={true}
					/>
				)}
				{text && (
					<Spacer margin="top">
						{/* Inline links follow the link colour of the block's background colour.
						    https://meemoo.atlassian.net/browse/ARC-3848 */}
						<Html
							content={convertToHtml(text)}
							sanitizePreset={SanitizePreset.full}
							className="u-background-text-links"
						/>
					</Spacer>
				)}
			</Container>
		</Spacer>
	);
};
