import type { CSSProperties, FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';
import { sanitizeHtml } from '../../helpers/sanitize';
import { SanitizePreset } from '../../helpers/sanitize/presets';

export interface HtmlProps {
	content: string;
	sanitizePreset?: SanitizePreset;
	type?: 'p' | 'div' | 'span' | 'td';
	className?: string;
	style?: CSSProperties;
}

// Block-level elements that cannot be nested inside <p> tags
const BLOCK_ELEMENT_REGEX =
	/<(p|div|h[1-6]|ul|ol|li|table|blockquote|pre|section|article|header|footer|nav|aside|figure|figcaption|details|summary|main)\b/i;

const Html: FunctionComponent<HtmlProps> = ({
	content,
	sanitizePreset = SanitizePreset.link,
	type = 'p',
	className,
	style,
}) => {
	// Skip sanitization during SSR and initial hydration to avoid attribute-order
	// mismatches (DOMPurify reorders attributes differently from the raw HTML the
	// server sends). Sanitization kicks in on the first client-only re-render.
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	// Avoid invalid nesting (e.g. <p><p>…</p></p>) which causes SSR hydration
	// mismatches because the browser's HTML parser auto-closes the outer <p>.
	const Type =
		type === 'p' && BLOCK_ELEMENT_REGEX.test(content) ? 'div' : type;

	return (
		<Type
			// biome-ignore lint/security/noDangerouslySetInnerHtml: This component is specifically designed to handle HTML content safely
			dangerouslySetInnerHTML={{
				__html: mounted ? sanitizeHtml(content, sanitizePreset) : content,
			}}
			className={className}
			style={style}
		/>
	);
};

export default Html;
