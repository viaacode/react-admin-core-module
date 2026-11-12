import clsx from 'clsx';
import type { CSSProperties, FunctionComponent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import {
	applyImageFallback,
	hasImageFailed,
	optimizeHtmlImages,
	PAGE_CONTENT_IMAGE_WIDTH,
} from '../../helpers/images';
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

	// Resized images that fail to load fall back to the next url. The error event does not bubble,
	// so it is captured on the wrapper. Images rendered on the server can fail before hydration,
	// so those are checked once mounted. The ref is typed as every element `type` can render.
	const wrapperRef = useRef<
		HTMLParagraphElement & HTMLDivElement & HTMLSpanElement & HTMLTableCellElement
	>(null);
	useEffect(() => {
		const wrapper = wrapperRef.current;
		if (!wrapper) {
			return;
		}
		const handleError = (event: Event) => {
			if (event.target instanceof HTMLImageElement) {
				applyImageFallback(event.target);
			}
		};
		wrapper.addEventListener('error', handleError, true);
		wrapper.querySelectorAll('img').forEach((img) => {
			if (hasImageFailed(img)) {
				applyImageFallback(img);
			}
		});
		return () => wrapper.removeEventListener('error', handleError, true);
	}, []);

	// Avoid invalid nesting (e.g. <p><p>…</p></p>) which causes SSR hydration
	// mismatches because the browser's HTML parser auto-closes the outer <p>.
	const Type = type === 'p' && BLOCK_ELEMENT_REGEX.test(content) ? 'div' : type;

	return (
		<Type
			ref={wrapperRef}
			// biome-ignore lint/security/noDangerouslySetInnerHtml: This component is specifically designed to handle HTML content safely
			dangerouslySetInnerHTML={{
				__html: optimizeHtmlImages(
					mounted ? sanitizeHtml(content, sanitizePreset) : content,
					PAGE_CONTENT_IMAGE_WIDTH
				),
			}}
			className={clsx('c-rich-text-editor__content', className)}
			style={style}
		/>
	);
};

export default Html;
