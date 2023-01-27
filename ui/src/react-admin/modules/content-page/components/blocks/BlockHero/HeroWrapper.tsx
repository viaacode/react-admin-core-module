import React, { FunctionComponent } from 'react';
import { BlockHero, BlockHeroProps } from '~content-blocks/BlockHero/BlockHero';
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
