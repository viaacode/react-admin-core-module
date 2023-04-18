import { Button, Spacer } from '@viaa/avo2-components';
import classnames from 'classnames';
import React, { FunctionComponent } from 'react';
import { BlockImageGridProps, GridItem } from '~content-blocks/BlockImageGrid/BlockImageGrid.types';
import { defaultRenderLinkFunction } from '~shared/helpers/link';

import './BlockImageGrid.scss';

export const BlockImageGrid: FunctionComponent<BlockImageGridProps> = ({
	elements = [],
	imageWidth = 200,
	imageHeight = 200,
	itemWidth = 200,
	fill = 'cover',
	align = 'center',
	textAlign = 'center',
	textSize = 15,
	textMargin = 0,
	textWeight = 500,
	textColor = '#2B414F',
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
							<p>{element.textAbove}</p>
						</Spacer>
					</div>
				)}
				<div
					className="c-block-grid__image"
					style={{
						width: `${imageWidth}px`,
						height: `${imageHeight}px`,
						backgroundImage: `url(${element.source})`,
						backgroundSize: fill,
					}}
				/>
				<div
					className="c-block-grid__text-wrapper"
					style={{
						color: textColor,
					}}
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
			className={classnames(
				'c-block-grid',
				`text-align-${textAlign}`,
				`item-align-${align}`,
				className
			)}
		>
			{elements.map((element, index) => (
				<div
					key={`block-grid-${element?.action?.value || element.title || null}${index}`}
					className={classnames('c-block-grid__item')}
					style={{
						width: `${itemWidth}px`,
						margin: `${Math.round(verticalMargin / 2)}px ${Math.round(
							horizontalMargin / 2
						)}px`,
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
