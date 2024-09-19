import type { VideoAspectRatio } from '@viaa/avo2-components';
import { AspectRatioWrapper } from '@viaa/avo2-components';
import type { FunctionComponent, IframeHTMLAttributes } from 'react';
import React from 'react';

import './BlockIFrame.scss';

export interface BlockIFrameProps extends IframeHTMLAttributes<HTMLIFrameElement> {
	title: string;
	ratio?: VideoAspectRatio;
}

export const BlockIFrame: FunctionComponent<BlockIFrameProps> = ({
	title,
	ratio,
	allowFullScreen = true,
	frameBorder = 0,
	...iframeProps
}) => {
	if (iframeProps.src && !/^(http:|https:)?\/\//.test(iframeProps.src)) {
		iframeProps.src = `//${iframeProps.src}`;
	}

	let aspectRatio: VideoAspectRatio | number | undefined;
	try {
		aspectRatio =
			ratio ||
			parseInt(String(iframeProps.width), 10) / parseInt(String(iframeProps.height), 10);
	} catch (err) {
		aspectRatio = ratio;
	}

	return (
		<AspectRatioWrapper aspect={aspectRatio} className="c-block-iframe">
			<iframe
				title={title}
				allowFullScreen={allowFullScreen}
				frameBorder={frameBorder}
				{...iframeProps}
			/>
		</AspectRatioWrapper>
	);
};
