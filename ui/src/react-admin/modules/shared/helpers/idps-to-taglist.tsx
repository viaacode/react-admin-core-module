import { noop } from 'lodash-es';
import type { ReactText } from 'react';
import React from 'react';

import type { TagOption } from '@viaa/avo2-components';
import { TagList } from '@viaa/avo2-components';
import type { Idp } from '~modules/user/user.types';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const IDP_COLORS: { [idp in Idp]: string } = {
	HETARCHIEF: '#25a4cf',
	KLASCEMENT: '#f7931b',
	SMARTSCHOOL: '#f05a1a',
	VLAAMSEOVERHEID: '#ffe612',
	MEEMOO: '#00c8aa',
};

/* eslint-enable @typescript-eslint/no-unused-vars */

export function idpMapsToTagList(
	idpMaps: Idp[],
	key: string,
	onTagClicked: (tagId: ReactText) => void = noop
) {
	if (!idpMaps || !idpMaps.length) {
		return null;
	}
	return (
		<TagList
			tags={idpMaps.map((idpMap: Idp): TagOption => {
				return {
					color: IDP_COLORS[idpMap],
					label: idpMap,
					id: `${key}_${idpMap}`,
				};
			})}
			onTagClicked={onTagClicked}
		/>
	);
}
