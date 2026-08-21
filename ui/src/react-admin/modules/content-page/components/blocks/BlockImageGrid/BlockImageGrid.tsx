import { Button, Spacer } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';
import type {
	BlockImageGridProps,
	GridItem,
} from '~content-blocks/BlockImageGrid/BlockImageGrid.types';
import { ContentPageLabelChip } from '~shared/components/ContentPageLabelChip/ContentPageLabelChip';
import { defaultRenderLinkFunction } from '~shared/helpers/routing/link';

import './BlockImageGrid.scss';
import { CopyrightAttribution } from '~shared/components/CopyrightAttribution';

export const BlockImageGrid: FunctionComponent<BlockImageGridProps> = ({
	elements = [],
	imageWidth = '20rem',
	imageHeight = '20rem',
	itemWidth = '20rem',
	fill = 'cover',
	align = 'center',
	imageItemAlignment = 'center',
	textAlign = 'center',
	textSize = 15,
	textMargin = 0,
	textWeight = 500,
	textColor,
	horizontalMargin = 10,
	verticalMargin = 10,
	className,
	renderLink = defaultRenderLinkFunction,
}) => {
	const renderGridImage = (element: GridItem) => {
		return (
			<>
				{element.textAbove && (
					<div className="c-block-grid__text-wrapper">
						<Spacer margin="bottom-small">
							<p className="u-background-text-primary">{element.textAbove}</p>
						</Spacer>
					</div>
				)}
				<div
					className="c-block-grid__image"
					style={{
						width: imageWidth,
						height: imageHeight,
						backgroundImage: `url(${element.source})`,
						backgroundSize: fill,
						backgroundPosition: imageItemAlignment || 'center',
					}}
				>
					{!!element.imageLabel && (
						<ContentPageLabelChip
							className="c-block-grid__image-label"
							label={element.imageLabel.text}
							color={element.imageLabel.color}
						/>
					)}
				</div>
				<CopyrightAttribution
					title={element.copyrightTitle}
					text={element.copyrightText}
					showIcon={element.copyrightIconVisible}
				/>
				<div
					className={clsx('c-block-grid__text-wrapper', {
						'u-background-text-primary': !textColor,
					})}
					style={textColor ? { color: textColor } : undefined}
				>
					{!!element.title && (
						<Spacer margin="top-small">
							<h3
								style={{
									fontSize: `${textSize}px`,
									margin: `${textMargin}px 0`,
									fontWeight: textWeight,
								}}
							>
								<strong>{element.title}</strong>
							</h3>
						</Spacer>
					)}
					{!!element.text && (
						<Spacer margin="top-small">
							<p>{element.text}</p>
						</Spacer>
					)}
					{!!element.buttonLabel && (
						<Spacer margin="top-small" className="c-block-grid__button-spacer">
							{renderLink(
								element.action,
								<Button
									label={element.buttonLabel}
									type={element.buttonType}
									title={element.buttonTitle}
									ariaLabel={element.buttonLabel || element.buttonTitle}
								/>,
								element.buttonLabel,
								element.buttonAltTitle || element.buttonLabel
							)}
						</Spacer>
					)}
				</div>
			</>
		);
	};

	return (
		<div
			className={clsx('c-block-grid', `text-align-${textAlign}`, `item-align-${align}`, className)}
		>
			{elements.map((element, index) => (
				<div
					key={`block-grid-${element?.action?.value || element.title || null}${index}`}
					className={clsx('c-block-grid__item')}
					style={{
						width: itemWidth,
						margin: `${Math.round(verticalMargin / 2)}px ${Math.round(horizontalMargin / 2)}px`,
					}}
				>
					{renderLink(
						element.action,
						renderGridImage(element),
						element.title || element.buttonTitle || element.titleAbove
					)}
				</div>
			))}
		</div>
	);
};
