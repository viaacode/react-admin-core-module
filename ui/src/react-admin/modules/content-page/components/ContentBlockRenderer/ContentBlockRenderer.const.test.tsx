import { describe, expect, it } from 'vitest';
import { BlockIFrame } from '~content-blocks/BlockIFrame';
import { AdminConfigManager } from '~core/config/config.class';
import type { AdminConfig } from '~core/config/config.types';
import { ContentBlockType } from '~modules/content-page/types/content-block.types';

import { GET_BLOCK_COMPONENT } from './ContentBlockRenderer.const';

const CustomIFrame = () => null;

function setContentBlocksConfig(contentBlocks: AdminConfig['content_blocks']) {
	AdminConfigManager.setConfig({ content_blocks: contentBlocks } as unknown as AdminConfig);
}

describe('GET_BLOCK_COMPONENT', () => {
	it('Should return the default block component', () => {
		setContentBlocksConfig({});
		expect(GET_BLOCK_COMPONENT(ContentBlockType.IFrame)).toBe(BlockIFrame);
	});

	it('Should return the block component from the config content_blocks if the app passes one', () => {
		setContentBlocksConfig({ [ContentBlockType.IFrame]: CustomIFrame });
		expect(GET_BLOCK_COMPONENT(ContentBlockType.IFrame)).toBe(CustomIFrame);
	});
});
