import type { TagOption } from '@viaa/avo2-components';
import { TagList } from '@viaa/avo2-components';
import { noop } from 'es-toolkit';
import type { MouseEvent, ReactNode } from 'react';
import React from 'react';

export function stringsToTagList(
	// biome-ignore lint/suspicious/noExplicitAny: todo
	labelsOrObjs: string[] | any[],
	prop: string | null = null,
	onTagClicked: (tagId: string | number, clickEvent: MouseEvent) => void = noop,
	onTagClosed?: (tagId: string | number, clickEvent: MouseEvent) => void
): ReactNode {
	if (!labelsOrObjs || !labelsOrObjs.length) {
		return null;
	}
	return (
		<TagList
			// biome-ignore lint/suspicious/noExplicitAny: todo
			tags={(labelsOrObjs as any[]).map(
				// biome-ignore lint/suspicious/noExplicitAny: todo
				(labelOrObj: string | any): TagOption => {
					const label = prop ? labelOrObj[prop] : labelOrObj;
					return {
						label,
						id: label,
					};
				}
			)}
			closable={!!onTagClosed}
			onTagClicked={onTagClicked}
			onTagClosed={onTagClosed || noop}
			swatches={false}
		/>
	);
}
