import type { FunctionComponent } from 'react';
import React from 'react';
import type { BlockHeroProps } from '~content-blocks/BlockHero/BlockHero';
import { BlockHero } from '~content-blocks/BlockHero/BlockHero';
import { AdminConfigManager } from '~core/config';

export const HeroWrapper: FunctionComponent<BlockHeroProps> = (props) => {
	return (
		<BlockHero
			{...props}
			dataPlayerId={AdminConfigManager.getConfig().flowplayer.FLOW_PLAYER_ID}
			token={AdminConfigManager.getConfig().flowplayer.FLOW_PLAYER_TOKEN}
		/>
	);
};
