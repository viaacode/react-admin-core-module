import React, { FunctionComponent } from 'react';
import { BlockButtons, BlockButtonsProps } from '~content-blocks/BlockButtons/BlockButtons';

import { tText } from '~shared/helpers/translation-functions';

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
