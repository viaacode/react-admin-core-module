import type { FunctionComponent } from 'react';
import React from 'react';
import type { BlockButtonsProps } from '~content-blocks/BlockButtons/BlockButtons.js';
import { BlockButtons } from '~content-blocks/BlockButtons/BlockButtons.js';

import { tText } from '~shared/helpers/translation-functions.js';

export const BlockButtonsWrapper: FunctionComponent<BlockButtonsProps> = (props) => {
	// Add tooltips for download buttons
	const elements = props.elements;
	elements.forEach((element) => {
		if (element?.buttonAction?.type === 'FILE') {
			element.tooltip = tText(
				'admin/content-block/components/wrappers/buttons-wrapper/buttons-wrapper___gebruik-rechtermuisknop-en-kies-save-om-het-bestand-te-downloaden'
			);
		}
	});

	return <BlockButtons {...props} elements={elements} />;
};
