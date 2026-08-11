import type { ButtonAction, ButtonType, IconName } from '@viaa/avo2-components';
import React, { type FunctionComponent, type ReactElement, useState } from 'react';
import type { Color } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockThemeReels.scss';
import { Button } from '@meemoo/react-components';
import { Icon } from '~shared/components/Icon';
import { tText } from '~shared/helpers/translation-functions.ts';
import 'swiper/css';
import clsx from 'clsx';
import { BlockThemeReelSection } from '~content-blocks/BlockThemeReels/BlockThemeReelSection.tsx';
import { App } from '~modules/translations/translations.core.types.ts';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink.tsx';
import type { PickerItem } from '~shared/types/content-picker.ts';

export interface BlockThemeReelsProps extends DefaultComponentProps {
	backgroundColor: Color;
	buttonLabel: string;
	buttonAltTitle?: string;
	buttonType?: ButtonType;
	buttonIcon?: IconName;
	buttonAction?: ButtonAction;
	elements: {
		theme: PickerItem;
		image?: string;
		imageAlt?: string;
		imageMask: string;
		description?: string;
	}[];
}

export const BlockThemeReels: FunctionComponent<BlockThemeReelsProps> = ({
	backgroundColor,
	buttonLabel,
	buttonAltTitle,
	buttonType,
	buttonIcon,
	buttonAction,
	elements,
}): ReactElement => {
	const [maxVisibleItems, setMaxVisibleItems] = useState<number>(Math.min(elements.length, 3));
	const visibleThemes = (elements || []).slice(0, maxVisibleItems);

	return (
		<div
			className={clsx('c-block-theme-reels')}
			style={{
				backgroundColor: backgroundColor,
			}}
		>
			{visibleThemes.map((element, groupIndex) => {
				return (
					<BlockThemeReelSection
						// biome-ignore lint/suspicious/noArrayIndexKey: groups have no stable id
						key={`c-block-theme-reels__group-${groupIndex}`}
						themeId={element.theme?.value}
						image={element.image}
						imageAlt={element.imageAlt}
						imageMask={element.imageMask}
						description={element.description}
					/>
				);
			})}

			<div className={clsx('c-block-theme-reels__actions')}>
				{visibleThemes.length < elements.length && (
					<Button
						variants={['black', 'sm']}
						label={tText(
							'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___meer-suggesties',
							{},
							[App.HET_ARCHIEF]
						)}
						title={tText(
							'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___meer-suggesties',
							{},
							[App.HET_ARCHIEF]
						)}
						ariaLabel={tText(
							'modules/content-page/components/blocks/block-theme-reels/block-theme-reels___meer-suggesties',
							{},
							[App.HET_ARCHIEF]
						)}
						onClick={() => setMaxVisibleItems(maxVisibleItems + 1)}
					/>
				)}

				{generateSmartLink(
					buttonAction,
					<Button
						variants={['sm', ...(buttonType ? [buttonType] : [])]}
						icon={buttonIcon && <Icon name={buttonIcon} />}
						label={buttonLabel}
						title={buttonLabel}
						ariaLabel={buttonAltTitle}
					/>,
					buttonAltTitle || buttonLabel,
					undefined,
					-1
				)}
			</div>
		</div>
	);
};
