import { BlockHero, BlockHeroProps } from '@viaa/avo2-components';
import React, { FunctionComponent } from 'react';
import { AdminConfigManager } from '~core/config';

const HeroWrapper: FunctionComponent<BlockHeroProps> = (props) => {
	return (
		<BlockHero
			{...props}
			dataPlayerId={AdminConfigManager.getConfig().flowplayer.FLOW_PLAYER_ID}
			token={AdminConfigManager.getConfig().flowplayer.FLOW_PLAYER_TOKEN}
		/>
	);
};

export default HeroWrapper;
