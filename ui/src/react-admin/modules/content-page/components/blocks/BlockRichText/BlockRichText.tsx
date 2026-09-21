import type { DefaultProps } from '@viaa/avo2-components';
import { convertToHtml } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';
import Html from '~shared/components/Html/Html';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';

import './BlockRichText.scss';

interface BlockRichTextElement {
	content: string;
	color?: string;
}

export interface BlockRichTextProps extends DefaultProps {
	/** Arrays are only supported for content saved before this block became single column */
	elements: BlockRichTextElement | BlockRichTextElement[];
	maxTextWidth?: string;
}

export const BlockRichText: FunctionComponent<BlockRichTextProps> = ({
	className,
	elements = { content: '' },
	maxTextWidth,
}) => {
	const { content, color } = Array.isArray(elements) ? elements[0] || { content: '' } : elements;

	return (
		<div className={clsx('c-rich-text-block', className)}>
			<Html
				content={convertToHtml(content)}
				sanitizePreset={SanitizePreset.full}
				className={clsx('u-background-text-links', {
					// A custom color always wins; only follow the block's design text
					// colors when none was set. https://meemoo.atlassian.net/browse/ARC-3848
					'u-background-text-primary': !color,
				})}
				style={{
					...(color ? { color } : {}),
					...(maxTextWidth ? { maxWidth: maxTextWidth } : {}),
				}}
				type="div"
			/>
		</div>
	);
};
