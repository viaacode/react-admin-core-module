import { LinkTarget } from '@viaa/avo2-components';

import { CustomError } from '../../../helpers/custom-error';
import { PickerItem } from '../../../types/content-picker';

export const retrieveAnchors = async (name: string | null, limit = 5): Promise<PickerItem[]> => {
	try {
		const anchorIds: string[] = [];
		document.querySelectorAll('[data-anchor]').forEach((block) => {
			const anchorId = block.getAttribute('data-anchor');
			if (anchorId) {
				anchorIds.push(anchorId);
			}
		});
		return parseAnchors(anchorIds);
	} catch (err) {
		throw new CustomError('Failed to get anchor links for content picker', err, {
			name,
			limit,
		});
	}
};

// Convert anchors to react-select options
const parseAnchors = (anchorIds: string[]): PickerItem[] => {
	return anchorIds.map(
		(anchorId): PickerItem => ({
			label: anchorId,
			type: 'ANCHOR_LINK',
			value: anchorId,
			target: LinkTarget.Self,
		})
	);
};
