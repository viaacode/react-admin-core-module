import { BlockHero, BlockHeroProps } from '@viaa/avo2-components';
import React, { FunctionComponent } from 'react';
import { Config } from '~core/config';

const HeroWrapper: FunctionComponent<BlockHeroProps> = (props) => {
	return (
		<BlockHero
			{...props}
			dataPlayerId={Config.getConfig().flowplayer.FLOW_PLAYER_ID}
			token={Config.getConfig().flowplayer.FLOW_PLAYER_TOKEN}
		/>
	);
};

export default HeroWrapper;
