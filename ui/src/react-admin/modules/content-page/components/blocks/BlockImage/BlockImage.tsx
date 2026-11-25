import type { AlignOptions, ButtonAction, ButtonType, DefaultProps } from '@viaa/avo2-components';
import { Button, Container } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { CSSProperties, FunctionComponent } from 'react';
import React from 'react';
import type { AlignOption } from '~modules/content-page/types/content-block.types';
import { CopyrightAttribution } from '~shared/components/CopyrightAttribution';
import { OptimizedImage } from '~shared/components/OptimizedImage/OptimizedImage';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink';
import {
	getBackgroundImage,
	getMediaImageDisplayWidth,
	SCREEN_IMAGE_WIDTH,
} from '~shared/helpers/images';

import './BlockImage.scss';

export interface BlockImageProps extends DefaultProps {
	imageSource: string;
	imageDescription?: string;
	imageAction?: ButtonAction;
	imageAlt?: string;
	title?: string;
	copyrightIconVisible?: boolean;
	text?: string;
	width?: 'page-header' | 'full-width' | string;
	align?: AlignOptions;
	buttonAction?: ButtonAction;
	buttonAlt?: string;
	buttonLabel?: string;
	buttonType?: ButtonType;
	buttonAlign?: AlignOption;
}

/**
 * Width (css px) the image is shown at, and the sizes attribute for widths that scale with the
 * viewport. Fixed widths ('700px', ...) are shown at that width.
 */
function getImageDisplayWidth(width: string): { displayWidth: number; sizes?: string } {
	if (width === 'page-header' || width === 'full-width') {
		return { displayWidth: SCREEN_IMAGE_WIDTH, sizes: '100vw' };
	}
	return getMediaImageDisplayWidth(width);
}

export const BlockImage: FunctionComponent<BlockImageProps> = ({
	className,
	imageSource,
	imageDescription = '',
	imageAction,
	imageAlt,
	title = '',
	copyrightIconVisible = false,
	text = '',
	width = '100%',
	align = 'center',
	buttonAlign,
	buttonAction,
	buttonAlt,
	buttonLabel,
	buttonType,
}) => {
	const style: CSSProperties = {};
	const { displayWidth, sizes } = getImageDisplayWidth(width);
	if (width === 'page-header') {
		style.paddingTop = `${100 * (521 / 1920)}%`;
		style.width = '100%';
		style.backgroundImage = getBackgroundImage(imageSource, displayWidth);
	} else if (width === 'full-width') {
		style.width = '100%';
	} else {
		style.width = width;
	}

	const renderImageContent = () => {
		return (
			<>
				{width !== 'page-header' && (
					<OptimizedImage
						src={imageSource}
						displayWidth={displayWidth}
						sizes={sizes}
						alt={imageAlt || imageDescription || title || text}
						wide
					/>
				)}
			</>
		);
	};

	return (
		<Container
			className={clsx(
				className,
				'o-block-image',
				`o-block-image__${align}`,
				`o-block-image__${width}`,
				{
					'o-block-image__page-header-image': width === 'page-header',
				}
			)}
			style={style as CSSProperties}
		>
			<div className="o-block-image__wrapper">
				{/* image itself with or without link */}
				{generateSmartLink(imageAction, renderImageContent(), imageAlt)}
				{/* button on top of image */}
				{buttonAction &&
					generateSmartLink(
						buttonAction,
						<Button label={buttonLabel} type={buttonType} />,
						buttonAlt || buttonLabel,
						clsx('o-block-image__button', {
							[`o-block-image__button--${buttonAlign}`]: !!buttonAlign,
						})
					)}
			</div>

			{/* image author attribution */}
			<CopyrightAttribution
				title={title}
				text={text}
				showIcon={copyrightIconVisible}
				className="a-block-image__annotation"
			/>
		</Container>
	);
};
