import { LinkTarget } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { GENERATED_CONTENT_BLOCK_ANCHOR_PREFIX } from '~modules/content-page/const/content-block-anchors.consts';
import { CustomError } from '~shared/helpers/custom-error';
import type { PickerItem } from '~shared/types/content-picker';

export const retrieveAnchors = async (name: string | null, limit = 5): Promise<PickerItem[]> => {
	try {
		const anchorIds: string[] = [];
		document.querySelectorAll('[data-anchor]').forEach((block) => {
			const anchorId = block.getAttribute('data-anchor');
			if (anchorId && !anchorId.startsWith(GENERATED_CONTENT_BLOCK_ANCHOR_PREFIX)) {
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
			type: Avo.Core.ContentPickerType.ANCHOR_LINK,
			value: anchorId,
			target: LinkTarget.Self,
		})
	);
};
