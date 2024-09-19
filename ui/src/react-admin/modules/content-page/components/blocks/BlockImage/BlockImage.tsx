import type { AlignOptions, ButtonAction, ButtonType, DefaultProps } from '@viaa/avo2-components';
import { Button, Container, Image } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { CSSProperties, FunctionComponent } from 'react';
import React from 'react';
import type { AlignOption } from '~modules/content-page/types/content-block.types';

import './BlockImage.scss';
import SmartLink, { generateSmartLink } from '~shared/components/SmartLink/SmartLink';

export interface BlockImageProps extends DefaultProps {
	imageSource: string;
	imageDescription?: string;
	imageAction?: ButtonAction;
	imageAlt?: string;
	title?: string;
	text?: string;
	width?: 'page-header' | 'full-width' | string;
	align?: AlignOptions;
	buttonAction?: ButtonAction;
	buttonAlt?: string;
	buttonLabel?: string;
	buttonType?: ButtonType;
	buttonAlign?: AlignOption;
}

export const BlockImage: FunctionComponent<BlockImageProps> = ({
	className,
	imageSource,
	imageDescription = '',
	imageAction,
	imageAlt,
	title = '',
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
	if (width === 'page-header') {
		style.paddingTop = `${100 * (521 / 1920)}%`;
		style.width = '100%';
		style.backgroundImage = `url('${imageSource}')`;
	} else if (width === 'full-width') {
		style.width = '100%';
	} else {
		style.width = width;
	}

	const renderImageContent = () => {
		return (
			<>
				{width !== 'page-header' && (
					<Image
						src={imageSource}
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
			style={style as any}
		>
			<div className="o-block-image__wrapper">
				{/* image itself with or without link */}
				{!!imageAction && (
					<SmartLink action={imageAction} title={imageAlt}>
						{renderImageContent()}
					</SmartLink>
				)}
				{!imageAction && renderImageContent()}
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
			{(!!title || !!text) && (
				<div className="a-block-image__annotation">
					{title && <h3>&#169; {title}</h3>}
					{text && <p className="a-block-image__text">{text}</p>}
				</div>
			)}
		</Container>
	);
};
