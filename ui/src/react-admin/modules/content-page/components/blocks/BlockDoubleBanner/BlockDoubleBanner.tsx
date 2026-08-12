import { type IconName, Image, LinkTarget } from '@viaa/avo2-components';
import clsx from 'clsx';
import { compact } from 'es-toolkit';
import type { CSSProperties, FunctionComponent, ReactElement } from 'react';
import React from 'react';
import type {
	BlockDoubleBannerProps,
	DoubleBannerHalf,
} from '~content-blocks/BlockDoubleBanner/BlockDoubleBanner.types';
import { Icon } from '~shared/components/Icon/Icon';
import { SmartLink } from '~shared/components/SmartLink/SmartLink';
import './BlockDoubleBanner.scss';

/**
 * Two mirrored halves, each one clickable path to a search page or content page.
 * The first half puts its text panel on the left and its image on the right; the second is the
 * mirror image of that. https://meemoo.atlassian.net/browse/ARC-3833
 */
export const BlockDoubleBanner: FunctionComponent<BlockDoubleBannerProps> = ({
	className,
	halves,
}): ReactElement => {
	const renderHalf = (half: DoubleBannerHalf, index: number) => {
		const icons = compact([half.icon1, half.icon2, half.icon3]);

		return (
			<>
				<div
					className="c-block-double-banner__panel"
					style={
						{
							background: half.backgroundColor,
							color: half.textColor,
						} as CSSProperties
					}
				>
					<span className="c-block-double-banner__label">{half.label}</span>
					<span className="c-block-double-banner__actions">
						<span className="c-block-double-banner__icons">
							{icons.map((icon) => (
								<Icon
									key={`c-block-double-banner__icon-${index}-${icon}`}
									className="c-block-double-banner__icon"
									name={icon as IconName}
								/>
							))}
						</span>
						<Icon className="c-block-double-banner__arrow" name={'arrowDownRight' as IconName} />
					</span>
				</div>
				<div className="c-block-double-banner__image">
					<Image src={half.image} alt={half.label} />
				</div>
			</>
		);
	};

	return (
		<div className={clsx('c-block-double-banner', className)}>
			{(halves || []).map((half: DoubleBannerHalf, index: number) => {
				const content = renderHalf(half, index);
				// Every half after the first mirrors the previous one: image towards the middle.
				const halfClassName = clsx('c-block-double-banner__half', {
					'c-block-double-banner__half--mirrored': index % 2 === 1,
				});

				if (!half.link) {
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: the halves have no id of their own
						<div key={`c-block-double-banner__half-${index}`} className={halfClassName}>
							{content}
						</div>
					);
				}

				return (
					<SmartLink
						// biome-ignore lint/suspicious/noArrayIndexKey: the halves have no id of their own
						key={`c-block-double-banner__half-${index}`}
						className={halfClassName}
						// The FA requires the destination to always open in the same tab
						action={{ ...half.link, target: LinkTarget.Self }}
					>
						{content}
					</SmartLink>
				);
			})}
		</div>
	);
};
