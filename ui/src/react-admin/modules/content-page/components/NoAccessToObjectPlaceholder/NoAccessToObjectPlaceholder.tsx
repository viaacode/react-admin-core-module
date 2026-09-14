import type { HetArchiefIeObjectType } from '@viaa/avo2-types';
import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement } from 'react';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon';
import { getIconFromObjectType } from '~shared/helpers/get-icon-from-object-type';
import { tText } from '~shared/helpers/translation-functions';
import { HET_ARCHIEF } from '~shared/types';

import './NoAccessToObjectPlaceholder.scss';

export interface NoAccessToObjectPlaceholderProps extends DefaultComponentProps {
	/**
	 * Format of the object that cannot be shown, used to pick the struck-through type icon
	 * (no-video / no-audio / no-newspaper / ...). Falls back to the generic file icon when the
	 * object couldn't be resolved at all and its format is therefore unknown.
	 */
	dctermsFormat?: HetArchiefIeObjectType;
	/**
	 * Whether the message under the icon is shown. The hero carousel keeps it collapsed on the
	 * slides that aren't active -- they're too small for it, and the icon sits centered on its own
	 * -- and lets it unfold once the slide becomes the active one.
	 */
	isTextVisible?: boolean;
	/**
	 * Whether the placeholder brings its own flat grey background. The blocks that put it in the
	 * place of a player or a thumbnail want it (the spot would otherwise read as a hole in the
	 * page), the hero carousel doesn't: its slides already paint their own background colour.
	 */
	hasBackground?: boolean;
	/**
	 * Colour of the icon and the message. White reads against the placeholder's own grey; a block
	 * that drops the background (the hero carousel) picks whichever of the two its slides need.
	 */
	textColor?: 'white' | 'black';
}

/**
 * Tile shown in place of an ie-object this visitor cannot be shown: one the proxy reports no
 * essence access for, or one the playable-display-data endpoint came back with a null for (no
 * accessible licenses at all, or the object no longer exists). The blocks that render objects
 * (video, timeline, hero carousel, overview carousel) all keep their layout in that case and show
 * this instead of the player/image, so the visitor gets the same clear signal everywhere rather
 * than a silently missing tile.
 */
export const NoAccessToObjectPlaceholder: FunctionComponent<NoAccessToObjectPlaceholderProps> = ({
	className,
	dctermsFormat,
	isTextVisible = true,
	hasBackground = true,
	textColor = 'white',
}): ReactElement => (
	<div
		className={clsx(
			'c-no-access-to-object-placeholder',
			`c-no-access-to-object-placeholder--${textColor}`,
			className,
			{
				'c-no-access-to-object-placeholder--transparent': !hasBackground,
			}
		)}
		role="alert"
	>
		<Icon
			name={getIconFromObjectType(dctermsFormat, false)}
			className="c-no-access-to-object-placeholder__icon"
		/>
		<div
			className={clsx('c-no-access-to-object-placeholder__text-wrapper', {
				'c-no-access-to-object-placeholder__text-wrapper--collapsed': !isTextVisible,
			})}
		>
			<span className="c-no-access-to-object-placeholder__text">
				{tText(
					'modules/content-page/components/no-access-to-object-placeholder/no-access-to-object-placeholder___geen-permissies-om-dit-object-te-bekijken',
					undefined,
					[HET_ARCHIEF]
				)}
			</span>
		</div>
	</div>
);
