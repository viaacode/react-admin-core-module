import type { FunctionComponent } from 'react';
import React from 'react';
import type { BlockAvoHeroProps } from '~content-blocks/BlockAvoHero/BlockAvoHero';
import { BlockAvoHero } from '~content-blocks/BlockAvoHero/BlockAvoHero';
import { AdminConfigManager } from '~core/config/config.class';

export const AvoHeroWrapper: FunctionComponent<BlockAvoHeroProps> = (props) => {
	return (
		<BlockAvoHero
			{...props}
			dataPlayerId={AdminConfigManager.getConfig().flowplayer.FLOW_PLAYER_ID}
			token={AdminConfigManager.getConfig().flowplayer.FLOW_PLAYER_TOKEN}
		/>
	);
};
