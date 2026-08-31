import { Button } from '@meemoo/react-components';
import { Icon, type IconName } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { clsx } from 'clsx';
import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import { SmartLink } from '~shared/components/SmartLink/SmartLink';
import {
	type IeObjectType,
	mapDcTermsFormatToSimpleType,
	SimpleIeObjectType,
} from '~shared/helpers/map-format-to-type.ts';
import { isMobileWidth } from '~shared/helpers/media-query.ts';
import { tText } from '~shared/helpers/translation-functions';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { HET_ARCHIEF } from '~shared/types';
import './IeObjectMetadata.scss';

// The call to action names the kind of object it links to, so a newspaper isn't announced as a fragment.
const getCallToActionLabel = (format: IeObjectType | null): string => {
	const simpleFormat = mapDcTermsFormatToSimpleType(format);

	switch (simpleFormat) {
		case SimpleIeObjectType.VIDEO:
			return tText(
				'modules/content-page/components/ie-object-metadata/ie-object-metadata___bekijk-de-volledige-video',
				{},
				[HET_ARCHIEF]
			);

		case SimpleIeObjectType.AUDIO:
			return tText(
				'modules/content-page/components/ie-object-metadata/ie-object-metadata___beluister-de-volledige-audio',
				{},
				[HET_ARCHIEF]
			);

		case SimpleIeObjectType.NEWSPAPER:
			return tText(
				'modules/content-page/components/ie-object-metadata/ie-object-metadata___bekijk-de-volledige-krant',
				{},
				[HET_ARCHIEF]
			);

		case SimpleIeObjectType.IMAGE:
			return tText(
				'modules/content-page/components/ie-object-metadata/ie-object-metadata___bekijk-de-volledige-afbeelding',
				{},
				[HET_ARCHIEF]
			);

		default:
			return tText(
				'modules/content-page/components/ie-object-metadata/ie-object-metadata___bekijk-het-volledige-object',
				{},
				[HET_ARCHIEF]
			);
	}
};

export const IeObjectMetadata: FunctionComponent<{
	ieObject: PlayableDisplayIeObject;
	fallbackTitle: string;
	className?: string;
	/** An optional second CTA at the end of the same row. The caller supplies and styles it. */
	secondaryCta?: ReactNode;
}> = ({ ieObject, fallbackTitle, className, secondaryCta }) => {
	const callToActionLabel = getCallToActionLabel(ieObject.dctermsFormat);

	return (
		<div className={clsx('c-ie-object-metadata', className)}>
			<SmartLink
				action={{
					type: AvoCoreContentPickerType.INTERNAL_LINK,
					value: `/pid/${ieObject?.schemaIdentifier}`,
				}}
				ariaLabel={callToActionLabel}
				className="c-ie-object-metadata__cta"
			>
				<Button
					variants={['block', 'black']}
					icon={isMobileWidth() ? <Icon name={'arrow-down-right' as IconName} /> : undefined}
					label={isMobileWidth() ? undefined : callToActionLabel}
				/>
			</SmartLink>
			<div className="c-ie-object-metadata__text">
				<p className="c-ie-object-metadata__title">{ieObject?.name || fallbackTitle}</p>
				<p className="c-ie-object-metadata__maintainer-name">{ieObject?.maintainerName || ''}</p>
			</div>
			{ieObject?.maintainerLogo && (
				<img
					src={ieObject?.maintainerLogo}
					alt={ieObject?.maintainerName || ''}
					className="c-ie-object-metadata__maintainer-logo"
				/>
			)}
			{secondaryCta}
		</div>
	);
};
