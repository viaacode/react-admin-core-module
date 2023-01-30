import { get } from 'lodash-es';
import React, { FunctionComponent } from 'react';
import { BlockButtons, BlockButtonsProps } from '~content-blocks/BlockButtons/BlockButtons';

import { useTranslation } from '~shared/hooks/useTranslation';

export const BlockButtonsWrapper: FunctionComponent<BlockButtonsProps> = (props) => {
	const { tText } = useTranslation();

	// Add tooltips for download buttons
	const elements = props.elements;
	elements.forEach((element) => {
		if (get(element, 'buttonAction.type') === 'FILE') {
			element.tooltip = tText(
				'admin/content-block/components/wrappers/buttons-wrapper/buttons-wrapper___gebruik-rechtermuisknop-en-kies-save-om-het-bestand-te-downloaden'
			);
		}
	});

	return <BlockButtons {...props} elements={elements} />;
};
