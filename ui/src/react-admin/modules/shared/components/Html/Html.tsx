import type { CSSProperties, FunctionComponent } from 'react';
import React from 'react';

import { sanitizeHtml } from '../../helpers/sanitize';
import { SanitizePreset } from '../../helpers/sanitize/presets';

export interface HtmlProps {
	content: string;
	sanitizePreset?: SanitizePreset;
	type?: 'p' | 'div' | 'span' | 'td';
	className?: string;
	style?: CSSProperties;
}

const Html: FunctionComponent<HtmlProps> = ({
	content,
	sanitizePreset = SanitizePreset.link,
	type = 'p',
	className,
	style,
}) => {
	const Type = type;

	return (
		<Type
			// biome-ignore lint/security/noDangerouslySetInnerHtml: This component is specifically designed to handle HTML content safely
			dangerouslySetInnerHTML={{
				__html: sanitizeHtml(content, sanitizePreset),
			}}
			className={className}
			style={style}
		/>
	);
};

export default Html;
