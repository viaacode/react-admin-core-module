import type { ButtonAction, ButtonType, IconName } from '@viaa/avo2-components';
import { Button } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, {
	type FunctionComponent,
	type ReactElement,
	useEffect,
	useRef,
	useState,
} from 'react';
import type {
	BackgroundAlignOption,
	Color,
	HeadingTypeOption,
	SimpleAlignOption,
} from '~modules/content-page/types/content-block.types';
import { generateSmartLink } from '~modules/shared/components/SmartLink/SmartLink';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon/Icon';
import { BlockHeading } from '../BlockHeading/BlockHeading';
import './BlockHetArchiefImageTextBackground.scss';
import type { ContentPageWidth } from '~modules/content-page/types/content-pages.types';
import { CONTENT_PAGE_WIDTH_TO_REM } from '~modules/content-page/types/content-pages.types';
import { CopyrightAttribution } from '~shared/components/CopyrightAttribution';

export interface BlockHetArchiefImageTextBackgroundProps extends DefaultComponentProps {
	heading: string;
	headingType: HeadingTypeOption;
	content: string;
	foregroundColor: Color;
	backgroundColor: Color;
	image?: string;
	imageAlignment?: BackgroundAlignOption;
	imageAltText?: string;
	copyrightTitle: string;
	copyrightIconVisible: boolean;
	copyrightText: string;
	buttonAction?: ButtonAction;
	buttonAltTitle?: string;
	buttonLabel: string;
	buttonType?: ButtonType;
	buttonIcon?: IconName;
	buttonIconAlignment?: SimpleAlignOption;
	pageWidth: ContentPageWidth;
}

export const BlockHetArchiefImageTextBackground: FunctionComponent<
	BlockHetArchiefImageTextBackgroundProps
> = ({
	className,
	heading,
	headingType,
	content,
	foregroundColor,
	backgroundColor,
	image,
	imageAlignment = 'left-screen',
	imageAltText,
	copyrightTitle,
	copyrightIconVisible,
	copyrightText,
	buttonAction,
	buttonAltTitle,
	buttonLabel,
	buttonType,
	buttonIcon,
	buttonIconAlignment = 'left',
	pageWidth,
}): ReactElement => {
	const imgRef = useRef<HTMLImageElement>(null);
	// The copyright caption must always line up with the image's actual rendered
	// left edge, even when the image itself is right-aligned and narrower than its
	// column (height-constrained, not full width). CSS can't reliably shrink-wrap a
	// container around a height-constrained <img> while also letting it share space
	// dynamically with an arbitrary-length caption (no fixed height to reserve), so
	// the image's rendered width is measured directly and applied to the caption.
	const [copyrightWidth, setCopyrightWidth] = useState<number>();

	// `image` is not read in the effect body, but is kept as a dependency to
	// re-attach the observer when the <img> element is conditionally
	// (re)mounted, e.g. in a live content-page preview.
	// biome-ignore lint/correctness/useExhaustiveDependencies: see above
	useEffect(() => {
		const imgEl = imgRef.current;
		if (!imgEl) {
			return;
		}

		const observer = new ResizeObserver(() => {
			setCopyrightWidth(imgEl.getBoundingClientRect().width);
		});
		observer.observe(imgEl);

		return () => observer.disconnect();
	}, [image]);

	return (
		<article
			className={clsx(
				`c-block-het-archief-image-text-background c-block-het-archief-image-text-background--${imageAlignment}`,
				className
			)}
			style={{
				background: backgroundColor,
				...(imageAlignment === 'left-inside-page' || imageAlignment === 'right-inside-page'
					? { width: CONTENT_PAGE_WIDTH_TO_REM[pageWidth] }
					: {}),
			}}
		>
			<div
				className="c-block-het-archief-image-text-background__content-wrapper"
				style={{ color: foregroundColor }}
			>
				<BlockHeading
					className="c-block-het-archief-image-text-background__heading"
					type={headingType}
				>
					{heading}
				</BlockHeading>
				<p className="c-block-het-archief-image-text-background__content">{content}</p>

				{buttonAction &&
					generateSmartLink(
						buttonAction,
						<Button
							className={`c-block-het-archief-image-text-background__button c-block-het-archief-image-text-background__button-icon--${buttonIconAlignment}`}
							label={buttonLabel}
							type={buttonType}
							icon={buttonIcon}
							iconPosition={buttonIconAlignment}
							renderIcon={() => (buttonIcon ? <Icon name={buttonIcon} /> : null)}
						/>,
						buttonAltTitle || buttonLabel
					)}
			</div>
			{(image || copyrightTitle || copyrightText) && (
				<div
					className={clsx('c-block-het-archief-image-text-background__image-wrapper', {
						'c-block-het-archief-image-text-background__image-wrapper--screen-left':
							imageAlignment === 'left-screen',
						'c-block-het-archief-image-text-background__image-wrapper--screen-right':
							imageAlignment === 'right-screen',
					})}
				>
					<div className="c-block-het-archief-image-text-background__media">
						<div className="c-block-het-archief-image-text-background__image">
							<img ref={imgRef} src={image} alt={imageAltText} />
						</div>
						<div
							className="c-block-het-archief-image-text-background__copyright"
							style={copyrightWidth ? { width: copyrightWidth } : undefined}
						>
							<CopyrightAttribution
								title={copyrightTitle}
								text={copyrightText}
								showIcon={copyrightIconVisible}
							/>
						</div>
					</div>
				</div>
			)}
		</article>
	);
};
