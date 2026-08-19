import { Button } from '@meemoo/react-components';
import { Icon, type IconName } from '@viaa/avo2-components';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { clsx } from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';
import { SmartLink } from '~shared/components/SmartLink/SmartLink';
import { isMobileWidth } from '~shared/helpers/media-query.ts';
import { tText } from '~shared/helpers/translation-functions';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { HET_ARCHIEF } from '~shared/types';
import './IeObjectMetadata.scss';

export const IeObjectMetadata: FunctionComponent<{
	ieObject: PlayableDisplayIeObject;
	fallbackTitle: string;
	className?: string;
}> = ({ ieObject, fallbackTitle, className }) => (
	<div className={clsx('c-ie-object-metadata', className)}>
		<SmartLink
			action={{
				type: AvoCoreContentPickerType.INTERNAL_LINK,
				value: `/pid/${ieObject?.schemaIdentifier}`,
			}}
			ariaLabel={tText(
				'modules/content-page/components/object-metadata/object-metadata___bekijk-volledig-fragment',
				{},
				[HET_ARCHIEF]
			)}
			className="c-ie-object-metadata__cta"
		>
			<Button
				variants={['block', 'black']}
				icon={isMobileWidth() ? <Icon name={'arrow-down-right' as IconName} /> : undefined}
				label={
					isMobileWidth()
						? undefined
						: tText(
								'modules/content-page/components/object-metadata/object-metadata___bekijk-volledig-fragment',
								{},
								[HET_ARCHIEF]
							)
				}
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
