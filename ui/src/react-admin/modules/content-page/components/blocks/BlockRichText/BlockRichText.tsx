import type {
	ButtonAction,
	ButtonProps,
	DefaultProps,
	GridSize,
	IconName,
	RenderLinkFunction,
} from '@viaa/avo2-components';
import { Button, Column, convertToHtml, Grid, Spacer } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';
import type { RichTextButton } from '~content-blocks/BlockRichText/BlockRichText.types.js';
import Html from '~shared/components/Html/Html.js';
import { Icon } from '~shared/components/Icon/Icon.js';
import { defaultRenderLinkFunction } from '~shared/helpers/link.js';
import { SanitizePreset } from '~shared/helpers/sanitize/presets/index.js';

import './BlockRichText.scss';

interface BlockRichTextElement {
	content: string;
	buttons?: (ButtonProps & { buttonAction: ButtonAction })[];
	color?: string;
}

export interface BlockRichTextProps extends DefaultProps {
	elements: BlockRichTextElement | BlockRichTextElement[];
	maxTextWidth?: string;
	renderLink?: RenderLinkFunction;
}

export const BlockRichText: FunctionComponent<BlockRichTextProps> = ({
	className,
	elements = [
		{
			content: '',
		},
	],
	maxTextWidth,
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
								buttonProps.icon ? () => <Icon name={buttonProps.icon as IconName} /> : undefined
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

	const renderContent = (contentElem: BlockRichTextElement, columnIndex = 0) => {
		const { content, color, buttons } = contentElem;

		return (
			<>
				<Html
					content={convertToHtml(content)}
					sanitizePreset={SanitizePreset.full}
					className="c-content"
					style={{
						...(color ? { color } : {}),
						...(maxTextWidth ? { maxWidth: maxTextWidth } : {}),
					}}
					type="div"
				/>
				{buttons && !!buttons.length && renderButtons(columnIndex, buttons)}
			</>
		);
	};

	const renderElements = (elements: BlockRichTextElement[]) => (
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
		<div className={clsx('c-rich-text-block', className)}>
			{Array.isArray(elements) ? renderElements(elements) : renderContent(elements)}
		</div>
	);
};
