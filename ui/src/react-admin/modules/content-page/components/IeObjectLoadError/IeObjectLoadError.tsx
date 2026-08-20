import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement } from 'react';
import { AdminCoreIconName } from '~core/config';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';

import './IeObjectLoadError.scss';

/**
 * Tile shown in place of an ie-object that the playable-display-data endpoint came back with a
 * null for: the object no longer exists, or it can't be resolved for this visitor. The blocks
 * that render objects (video, timeline, hero carousel) all keep their layout in that case and
 * show this instead of the player/image, so an editor sees which element is broken rather than a
 * silently missing tile.
 */
export const IeObjectLoadError: FunctionComponent<DefaultComponentProps> = ({
	className,
}): ReactElement => (
	<div className={clsx('c-ie-object-load-error', className)} role="alert">
		<Icon name={AdminCoreIconName.Warning} className="c-ie-object-load-error__icon" />
		<span className="c-ie-object-load-error__text">
			{tText(
				'react-admin/modules/content-page/components/ie-object-load-error/ie-object-load-error___object-kon-niet-geladen-worden',
				undefined,
				[HET_ARCHIEF]
			)}
		</span>
	</div>
);
