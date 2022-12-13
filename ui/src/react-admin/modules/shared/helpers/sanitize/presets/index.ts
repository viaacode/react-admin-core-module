import DOMPurify from 'dompurify';

export const basic: DOMPurify.Config = {
	ALLOWED_TAGS: [
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'blockquote',
		'p',
		'ul',
		'ol',
		'li',
		'b',
		'i',
		'u',
		'strong',
		'em',
		'strike',
		'br',
		'sub',
		'sup',
		'super',
		'span',
	],
	RETURN_DOM: false,
	ADD_ATTR: ['target'], // Allow target _blank for links
};

export const link: DOMPurify.Config = {
	ALLOWED_TAGS: [...(basic.ALLOWED_TAGS || []), 'a'],
	RETURN_DOM: false,
	ADD_ATTR: ['target'], // Allow target _blank for links
};

export const full: DOMPurify.Config = {
	ALLOWED_TAGS: [...(link.ALLOWED_TAGS || []), 'img', 'table', 'tr', 'td', 'div'],
	RETURN_DOM: false,
	ADD_ATTR: ['target'], // Allow target _blank for links
};

export enum SanitizePreset {
	basic = 'basic',
	link = 'link',
	full = 'full',
}

const presetLookup: Record<SanitizePreset, DOMPurify.Config> = {
	[SanitizePreset.basic]: basic,
	[SanitizePreset.link]: link,
	[SanitizePreset.full]: full,
};

export default presetLookup;
