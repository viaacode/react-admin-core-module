import { BlockHero, BlockHeroProps } from '@viaa/avo2-components';
import getConfig from 'next/config';
import React, { FunctionComponent } from 'react';

const { publicRuntimeConfig } = getConfig();

const HeroWrapper: FunctionComponent<BlockHeroProps> = (props) => {
	return (
		<BlockHero
			{...props}
			dataPlayerId={publicRuntimeConfig.FLOW_PLAYER_ID}
			token={publicRuntimeConfig.FLOW_PLAYER_TOKEN}
		/>
	);
};

export default HeroWrapper;
