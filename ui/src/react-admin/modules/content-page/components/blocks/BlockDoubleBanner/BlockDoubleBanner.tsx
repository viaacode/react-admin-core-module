import { Image, LinkTarget } from '@viaa/avo2-components';
import clsx from 'clsx';
import { compact } from 'es-toolkit';
import type { CSSProperties, FunctionComponent, ReactElement } from 'react';
import React from 'react';
import type {
	BlockDoubleBannerProps,
	DoubleBannerHalf,
} from '~content-blocks/BlockDoubleBanner/BlockDoubleBanner.types';
import { AdminCoreIconName } from '~core/config/config.types';
import { ContentPageIcon, Icon } from '~shared/components/Icon/Icon';
import { generateSmartLink } from '~shared/components/SmartLink/SmartLink';
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
					<span className="c-block-double-banner__actions" aria-hidden>
						<span className="c-block-double-banner__icons">
							{icons.map((icon, iconIndex) => (
								<ContentPageIcon
									key={`c-block-double-banner__icon-${index}-${iconIndex}-${icon}`}
									className="c-block-double-banner__icon"
									name={icon}
								/>
							))}
						</span>
						<Icon
							className="c-block-double-banner__arrow"
							name={AdminCoreIconName.ArrowDownRight}
						/>
					</span>
				</div>
				<div className="c-block-double-banner__image">
					{/* Before an image is uploaded the value is empty, and an empty src makes the
					    browser refetch the page. */}
					{half.image ? <Image src={half.image} alt="" /> : null}
				</div>
			</>
		);
	};

	return (
		<div className={clsx('c-block-double-banner', className)}>
			{halves.map((half: DoubleBannerHalf, index: number) => {
				const content = renderHalf(half, index);
				// Every half after the first mirrors the previous one: image towards the middle.
				const halfClassName = clsx('c-block-double-banner__half', {
					'c-block-double-banner__half--mirrored': index % 2 === 1,
				});

				// generateSmartLink returns a bare fragment for an empty action, which drops the
				// halfClassName and with it the whole layout. Keep the wrapper in that case, so the
				// editor sees the real layout before the destination is filled in.
				if (!half.link?.value) {
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: the halves have no id of their own
						<div key={`c-block-double-banner__half-${index}`} className={halfClassName}>
							{content}
						</div>
					);
				}

				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: the halves have no id of their own
					<React.Fragment key={`c-block-double-banner__half-${index}`}>
						{generateSmartLink(
							{ ...half.link, target: LinkTarget.Self },
							content,
							undefined,
							halfClassName
						)}
					</React.Fragment>
				);
			})}
		</div>
	);
};
