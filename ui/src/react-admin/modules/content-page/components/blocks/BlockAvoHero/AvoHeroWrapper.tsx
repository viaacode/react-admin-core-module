import type { FunctionComponent } from 'react';
import React from 'react';
import type { BlockHeroProps } from '~content-blocks/BlockAvoHero/BlockAvoHero';
import { BlockAvoHero } from '~content-blocks/BlockAvoHero/BlockAvoHero';
import { AdminConfigManager } from '~core/config';

export const AvoHeroWrapper: FunctionComponent<BlockHeroProps> = (props) => {
	return (
		<BlockAvoHero
			{...props}
			dataPlayerId={AdminConfigManager.getConfig().flowplayer.FLOW_PLAYER_ID}
			token={AdminConfigManager.getConfig().flowplayer.FLOW_PLAYER_TOKEN}
		/>
	);
};
