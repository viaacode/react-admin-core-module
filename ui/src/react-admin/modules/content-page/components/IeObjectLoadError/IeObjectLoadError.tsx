import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement } from 'react';
import { AdminCoreIconName } from '~core/config';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';

import './IeObjectLoadError.scss';

export interface IeObjectLoadErrorProps extends DefaultComponentProps {
	/**
	 * Whether the message under the icon is shown. The hero carousel keeps it collapsed on the
	 * slides that aren't active -- they're too small for it, and the icon sits centered on its own
	 * -- and lets it unfold once the slide becomes the active one.
	 */
	isTextVisible?: boolean;
}

/**
 * Tile shown in place of an ie-object this visitor cannot be shown: one the proxy reports no
 * essence access for, or one the playable-display-data endpoint came back with a null for (no
 * accessible licenses at all, or the object no longer exists). The blocks that render objects
 * (video, timeline, hero carousel, overview carousel, objects grid) all keep their layout in that
 * case and show this instead of the player/image, so the visitor gets a clear signal that the
 * object is out of reach rather than a silently missing tile.
 */
export const IeObjectLoadError: FunctionComponent<IeObjectLoadErrorProps> = ({
	className,
	isTextVisible = true,
}): ReactElement => (
	<div className={clsx('c-ie-object-load-error', className)} role="alert">
		<Icon name={AdminCoreIconName.Warning} className="c-ie-object-load-error__icon" />
		<div
			className={clsx('c-ie-object-load-error__text-wrapper', {
				'c-ie-object-load-error__text-wrapper--collapsed': !isTextVisible,
			})}
		>
			<span className="c-ie-object-load-error__text">
				{tText(
					'modules/content-page/components/ie-object-load-error/ie-object-load-error___geen-permissies-om-dit-object-te-bekijken',
					undefined,
					[HET_ARCHIEF]
				)}
			</span>
		</div>
	</div>
);
