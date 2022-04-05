import { LinkTarget } from '@viaa/avo2-components';

import { CustomError } from '../../../helpers/custom-error';
import { PickerSelectItem } from '../../../types/content-picker';

import { ContentPickerType } from 'modules/shared/components/ContentPicker/ContentPicker.const';

export const retrieveAnchors = async (
	name: string | null,
	limit = 5
): Promise<PickerSelectItem[]> => {
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
const parseAnchors = (anchorIds: string[]): PickerSelectItem[] => {
	return anchorIds.map(
		(anchorId): PickerSelectItem => ({
			label: anchorId,
			value: {
				type: ContentPickerType.ANCHOR_LINK,
				value: anchorId,
				label: anchorId,
				target: LinkTarget.Self,
			},
		})
	);
};
