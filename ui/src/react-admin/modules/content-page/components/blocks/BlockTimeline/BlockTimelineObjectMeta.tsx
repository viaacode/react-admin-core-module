import { Button } from '@meemoo/react-components';
import { Icon, type IconName } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import type { FunctionComponent } from 'react';
import React from 'react';
import type { IeObjectMediaInfo } from '~shared/components/IeObjectMedia';
import { SmartLink } from '~shared/components/SmartLink/SmartLink';
import { IeObjectType } from '~shared/helpers/mapFormatToType.ts';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';

// The call to action names the kind of object it links to, so a newspaper isn't announced as a fragment.
const getCallToActionLabel = (format: IeObjectType | null): string => {
	switch (format) {
		case IeObjectType.video:
		case IeObjectType.videofragment:
		case IeObjectType.film:
			return tText(
				'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___bekijk-de-volledige-video',
				{},
				[HET_ARCHIEF]
			);

		case IeObjectType.audio:
		case IeObjectType.audiofragment:
			return tText(
				'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___beluister-de-volledige-audio',
				{},
				[HET_ARCHIEF]
			);

		case IeObjectType.newspaper:
		case IeObjectType.newspaperpage:
			return tText(
				'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___bekijk-de-volledige-krant',
				{},
				[HET_ARCHIEF]
			);

		case IeObjectType.image:
			return tText(
				'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___bekijk-de-volledige-afbeelding',
				{},
				[HET_ARCHIEF]
			);

		default:
			return tText(
				'react-admin/modules/content-page/components/blocks/block-timeline/block-timeline___bekijk-het-volledige-object',
				{},
				[HET_ARCHIEF]
			);
	}
};

export const BlockTimelineObjectMeta: FunctionComponent<{
	ieObject: IeObjectMediaInfo;
	fallbackTitle: string;
}> = ({ ieObject, fallbackTitle }) => {
	const callToActionLabel = getCallToActionLabel(ieObject.dctermsFormat);

	return (
		<div className="c-block-timeline__node-object-meta">
			{/* The label is swapped for an icon below $g-bp3, where the meta bar has no room for it */}
			<SmartLink
				action={{
					type: AvoCoreContentPickerType.INTERNAL_LINK,
					value: `/pid/${ieObject.schemaIdentifier}`,
				}}
				ariaLabel={callToActionLabel}
				className="c-block-timeline__node-object-cta"
			>
				<Button variants={['block', 'black', 'sm']}>
					<span className="c-block-timeline__node-object-cta-label">{callToActionLabel}</span>
					<Icon
						name={'arrow-down-right' as IconName}
						className="c-block-timeline__node-object-cta-icon"
					/>
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
};
