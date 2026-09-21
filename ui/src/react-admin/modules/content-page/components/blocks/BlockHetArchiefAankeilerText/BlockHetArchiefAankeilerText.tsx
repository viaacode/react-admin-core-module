import type { DefaultProps } from '@viaa/avo2-components';
import { convertToHtml } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';
import Html from '~shared/components/Html/Html';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';

import './BlockHetArchiefAankeilerText.scss';

export interface BlockHetArchiefAankeilerTextProps extends DefaultProps {
	content: string;
	maxTextWidth?: string;
}

export const BlockHetArchiefAankeilerText: FunctionComponent<BlockHetArchiefAankeilerTextProps> = ({
	className,
	content = '',
	maxTextWidth,
}) => {
	return (
		<div className={clsx('c-aankeiler-text-block', className)}>
			<Html
				content={convertToHtml(content)}
				sanitizePreset={SanitizePreset.full}
				className="u-background-text-links u-background-text-primary"
				style={maxTextWidth ? { maxWidth: maxTextWidth } : {}}
				type="div"
			/>
		</div>
	);
};
