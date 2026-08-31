import { Button } from '@meemoo/react-components';
import { Icon, type IconName } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { clsx } from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';
import { SmartLink } from '~shared/components/SmartLink/SmartLink';
import {
	type IeObjectType,
	mapDcTermsFormatToSimpleType,
	SimpleIeObjectType,
} from '~shared/helpers/map-format-to-type.ts';
import { useIsMobileWidth } from '~shared/helpers/media-query.ts';
import { tText } from '~shared/helpers/translation-functions';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { HET_ARCHIEF } from '~shared/types';
import './IeObjectMetadata.scss';
import { IeObjectsService } from '~modules/ie-objects/ie-objects.service.ts';

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
}> = ({ ieObject, fallbackTitle, className }) => {
	const callToActionLabel = getCallToActionLabel(ieObject.dctermsFormat);
	const isMobile = useIsMobileWidth();

	return (
		<div className={clsx('c-ie-object-metadata', className)}>
			<SmartLink
				action={{
					type: AvoCoreContentPickerType.INTERNAL_LINK,
					value: IeObjectsService.getObjectDetailPath(
						ieObject?.maintainerSlug,
						ieObject?.schemaIdentifier,
						ieObject?.name
					),
				}}
				ariaLabel={callToActionLabel}
				className="c-ie-object-metadata__cta"
			>
				<Button
					variants={['block', 'black']}
					icon={isMobile ? <Icon name={'arrow-down-right' as IconName} /> : undefined}
					label={isMobile ? undefined : callToActionLabel}
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
		</div>
	);
};
