import type { FunctionComponent } from 'react';
import React from 'react';

import { sanitizeHtml } from '../../helpers/sanitize';
import { SanitizePreset } from '../../helpers/sanitize/presets';

export interface HtmlProps {
	content: string;
	sanitizePreset?: SanitizePreset;
	type?: 'p' | 'div' | 'span';
	className?: string;
}

const Html: FunctionComponent<HtmlProps> = ({
	content,
	sanitizePreset = SanitizePreset.link,
	type = 'p',
	className,
}) => {
	const Type = type;

	return (
		<Type
			dangerouslySetInnerHTML={{ __html: sanitizeHtml(content, sanitizePreset) }}
			className={className}
		/>
	);
};

export default Html;
