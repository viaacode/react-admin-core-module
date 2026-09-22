import { loremIpsum } from 'lorem-ipsum';
import { ColumnType } from '~content-blocks/BlockRichTextTwoColumns/BlockRichTextTwoColumns.types.ts';

export const RICH_TEXT_TWO_COLUMNS_TEXT_COLUMN_MOCK = {
	columnType: ColumnType.TEXT,
	content: `
# Title

${loremIpsum({ count: 20 })}

* one
* two
* three
`,
};

export const RICH_TEXT_TWO_COLUMNS_IMAGE_COLUMN_MOCK = {
	columnType: ColumnType.IMAGE,
	content: '',
	imageSource: 'https://example.com/image.jpg',
	imageAlt: 'Een afbeelding',
	imageAlign: 'right' as const,
};
