import { Button } from '@meemoo/react-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import type { FunctionComponent } from 'react';
import React from 'react';
import { SmartLink } from '~shared/components/SmartLink/SmartLink';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';
import type { TimelineIeObject } from './hooks/useGetTimelineIeObjects';

export const BlockTimelineObjectMeta: FunctionComponent<{
	ieObject: TimelineIeObject;
	fallbackTitle: string;
}> = ({ ieObject, fallbackTitle }) => (
	<div className="c-block-timeline__node-object-meta">
		<SmartLink
			action={{
				type: AvoCoreContentPickerType.INTERNAL_LINK,
				value: `/pid/${ieObject.schemaIdentifier}`,
			}}
			className="c-block-timeline__node-object-cta"
		>
			<Button variants={['block', 'black', 'sm']}>
				{tText(
					'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___bekijk-volledig-fragment',
					{},
					[HET_ARCHIEF]
				)}
			</Button>
		</SmartLink>
		<div className="c-block-timeline__node-object-text">
			<p className="c-block-timeline__node-object-title">{ieObject.name || fallbackTitle}</p>
			<p className="c-block-timeline__node-object-maintainer-name">
				{ieObject.maintainerName || ''}
			</p>
		</div>
		{ieObject.maintainerLogo && (
			<img
				src={ieObject.maintainerLogo}
				alt={ieObject.maintainerName || ''}
				className="c-block-timeline__node-object-maintainer-logo"
			/>
		)}
	</div>
);
