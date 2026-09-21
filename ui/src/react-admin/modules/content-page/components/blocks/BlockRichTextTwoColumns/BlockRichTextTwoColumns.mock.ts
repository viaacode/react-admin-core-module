import { loremIpsum } from 'lorem-ipsum';

export const RICH_TEXT_TWO_COLUMNS_TEXT_COLUMN_MOCK = {
	columnType: 'TEXT' as const,
	content: `
# Title

${loremIpsum({ count: 20 })}

* one
* two
* three
`,
};

export const RICH_TEXT_TWO_COLUMNS_IMAGE_COLUMN_MOCK = {
	columnType: 'IMAGE' as const,
	content: '',
	imageSource: 'https://example.com/image.jpg',
	imageAlt: 'Een afbeelding',
	imageAlign: 'right' as const,
};
