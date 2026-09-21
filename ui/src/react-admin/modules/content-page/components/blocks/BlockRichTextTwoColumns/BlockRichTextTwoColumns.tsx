import type {
	ButtonAction,
	ButtonProps,
	DefaultProps,
	GridSize,
	RenderLinkFunction,
} from '@viaa/avo2-components';
import { Button, Column, convertToHtml, Grid, Image, Spacer } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';
import type { RichTextButton } from '~content-blocks/BlockRichTextTwoColumns/BlockRichTextTwoColumns.types';
import type {
	AlignOption,
	RichTextColumnType,
} from '~modules/content-page/types/content-block.types';
import Html from '~shared/components/Html/Html';
import { ContentPageIcon } from '~shared/components/Icon/Icon';
import { defaultRenderLinkFunction } from '~shared/helpers/routing/link';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';

import './BlockRichTextTwoColumns.scss';
import { CopyrightAttribution } from '~shared/components/CopyrightAttribution';
import { SmartLink } from '~shared/components/SmartLink/SmartLink';

interface BlockRichTextTwoColumnsElement {
	/** Undefined for content saved before columns could hold an image: render as text */
	columnType?: RichTextColumnType;
	content: string;
	copyrightTitle?: string;
	copyrightIconVisible?: boolean;
	copyrightText?: string;
	buttons?: (ButtonProps & { buttonAction: ButtonAction })[];
	color?: string;
	imageSource?: string;
	imageAlt?: string;
	imageAction?: ButtonAction;
	imageAlign?: AlignOption;
}

export interface BlockRichTextTwoColumnsProps extends DefaultProps {
	elements: BlockRichTextTwoColumnsElement | BlockRichTextTwoColumnsElement[];
	renderLink?: RenderLinkFunction;
}

export const BlockRichTextTwoColumns: FunctionComponent<BlockRichTextTwoColumnsProps> = ({
	className,
	elements = [
		{
			content: '',
			copyrightTitle: '',
			copyrightIconVisible: false,
			copyrightText: '',
		},
	],
	renderLink = defaultRenderLinkFunction,
}) => {
	const renderButtons = (columnIndex: number, buttons: RichTextButton[]) => {
		return buttons.map((buttonProps: RichTextButton, buttonIndex: number) => {
			return (
				<Spacer
					// biome-ignore lint/suspicious/noArrayIndexKey: We don't have a better key at this time
					key={`rich-text-column-${columnIndex}-button-${buttonIndex}`}
					margin="top"
				>
					{renderLink(
						buttonProps.buttonAction,
						<Button
							{...buttonProps}
							renderIcon={
								buttonProps.icon ? () => <ContentPageIcon name={buttonProps.icon} /> : undefined
							}
							iconPosition={buttonProps.buttonIconAlignment}
						/>,
						buttonProps.label || buttonProps.ariaLabel || buttonProps.tooltip,
						buttonProps.altTitle ||
							buttonProps.label ||
							buttonProps.ariaLabel ||
							buttonProps.tooltip
					)}
				</Spacer>
			);
		});
	};

	const renderImage = (contentElem: BlockRichTextTwoColumnsElement) => {
		const {
			imageSource,
			imageAlt,
			imageAction,
			imageAlign,
			copyrightTitle,
			copyrightIconVisible,
			copyrightText,
		} = contentElem;

		// The image keeps its intrinsic width, so the alignment only has a visible effect
		// when the image is narrower than the column.
		const image = imageSource ? <Image src={imageSource} alt={imageAlt} /> : null;

		return (
			<div
				className={clsx(
					'c-rich-text-two-columns-block__image',
					`c-rich-text-two-columns-block__image--${imageAlign || 'center'}`
				)}
			>
				{/* Shrinks to the image width so the caption starts at the image's left edge
				    and wraps at its right edge, whatever the alignment */}
				<figure className="c-rich-text-two-columns-block__image-figure">
					{image &&
						(imageAction ? (
							<SmartLink action={imageAction} title={imageAlt}>
								{image}
							</SmartLink>
						) : (
							image
						))}
					<CopyrightAttribution
						title={copyrightTitle}
						text={copyrightText}
						showIcon={copyrightIconVisible}
					/>
				</figure>
			</div>
		);
	};

	const renderContent = (contentElem: BlockRichTextTwoColumnsElement, columnIndex = 0) => {
		const { columnType, content, color, buttons } = contentElem;

		if (columnType === 'IMAGE') {
			return (
				<>
					{renderImage(contentElem)}
					{buttons && !!buttons.length && renderButtons(columnIndex, buttons)}
				</>
			);
		}

		return (
			<>
				<Html
					content={convertToHtml(content)}
					sanitizePreset={SanitizePreset.full}
					className={clsx('u-background-text-links', {
						// A per-column custom color always wins; only follow the block's design text
						// colors when none was set. https://meemoo.atlassian.net/browse/ARC-3848
						'u-background-text-primary': !color,
					})}
					style={color ? { color } : undefined}
					type="div"
				/>
				{buttons && !!buttons.length && renderButtons(columnIndex, buttons)}
			</>
		);
	};

	const renderElements = (elements: BlockRichTextTwoColumnsElement[]) => (
		<Grid>
			{elements.map((column, columnIndex) => (
				<Column
					size={`2-${12 / elements.length}` as GridSize}
					// biome-ignore lint/suspicious/noArrayIndexKey: We don't have a better key at this time
					key={`rich-text-column-${columnIndex}`}
				>
					{renderContent(column, columnIndex)}
				</Column>
			))}
		</Grid>
	);

	return (
		<div className={clsx('c-rich-text-two-columns-block', className)}>
			{Array.isArray(elements) ? renderElements(elements) : renderContent(elements)}
		</div>
	);
};
