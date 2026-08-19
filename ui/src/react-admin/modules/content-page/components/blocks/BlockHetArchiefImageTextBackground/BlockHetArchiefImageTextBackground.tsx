import type { ButtonAction, ButtonType, IconName } from '@viaa/avo2-components';
import { Button } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, {
	type CSSProperties,
	type FunctionComponent,
	type ReactElement,
	useCallback,
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
import { ContentPageIcon } from '~shared/components/Icon/Icon';
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
	const copyrightRef = useRef<HTMLDivElement>(null);
	// Hidden, unwrapped clone of the caption, used only to measure its natural
	// (single-line) width in JS — see updateMediaMeasurements below. Can't be done in
	// pure CSS: a flex/grid container's intrinsic-size computation uses the <img>'s
	// intrinsic pixel dimensions, not its rendered size, so `width: fit-content` on
	// `.media` collapses to the full column width for any normal-sized image.
	const copyrightMeasureRef = useRef<HTMLDivElement>(null);
	// Copyright's rendered height, fed into --copyright-height (see scss). The image
	// column is absolutely positioned so it can't grow the block's height itself, so
	// this is what makes the block reserve enough room for a tall caption instead of
	// letting it overflow into a consuming app's `.c-content-block { overflow: hidden }`.
	const [copyrightHeight, setCopyrightHeight] = useState<number>();
	// Image's own rendered width, or the caption's natural (unwrapped) width if that's
	// wider — applied to `.media` below so both share exactly that width and align
	// their left edges, while letting the caption grow past the image instead of
	// wrapping when it would otherwise need to.
	const [mediaWidth, setMediaWidth] = useState<number>();
	// Image's rendered height, which can exceed its 21.7rem floor (see scss) for a
	// tall/portrait source. Fed into --image-height for the same reason as
	// copyrightHeight: without it such an image could get squeezed or overflow.
	const [imageHeight, setImageHeight] = useState<number>();

	// Uses the image's *rendered* width, not `naturalWidth` (its raw file resolution):
	// a grid/flex container's intrinsic-size computation falls back to the raw pixel
	// dimensions whenever height isn't a definite value, which would always win the
	// `max()` below and pin `.media` to the full column regardless of the copyright.
	// Only reads it once the image has finished loading — reading mid-load measures
	// ~0px, which would shrink `.media` (and the image with it) with no way to
	// recover, since a later re-measure would just report that same self-inflicted size.
	const updateMediaMeasurements = useCallback(() => {
		const imgEl = imgRef.current;
		const measureEl = copyrightMeasureRef.current;
		const naturalCopyrightWidth = measureEl?.getBoundingClientRect().width ?? 0;

		if (imgEl && !imgEl.complete) {
			return;
		}

		const imageWidth = imgEl?.getBoundingClientRect().width ?? 0;
		setMediaWidth(Math.max(imageWidth, naturalCopyrightWidth) || undefined);
		setImageHeight(imgEl?.getBoundingClientRect().height || undefined);
	}, []);

	// Deps aren't read in the effect body; they re-attach the observers when the
	// <img>/measuring clone are conditionally (re)mounted, e.g. in a live preview.
	// biome-ignore lint/correctness/useExhaustiveDependencies: see above
	useEffect(() => {
		const imgEl = imgRef.current;
		const measureEl = copyrightMeasureRef.current;

		const observer = new ResizeObserver(updateMediaMeasurements);
		if (imgEl) {
			observer.observe(imgEl);
		}
		if (measureEl) {
			observer.observe(measureEl);
		}
		updateMediaMeasurements();

		return () => observer.disconnect();
	}, [image, copyrightTitle, copyrightText, copyrightIconVisible, updateMediaMeasurements]);

	useEffect(() => {
		const copyrightEl = copyrightRef.current;
		if (!copyrightEl) {
			return;
		}

		const observer = new ResizeObserver(() => {
			setCopyrightHeight(copyrightEl.getBoundingClientRect().height);
		});
		observer.observe(copyrightEl);

		return () => observer.disconnect();
	}, []);

	return (
		<article
			className={clsx(
				`c-block-het-archief-image-text-background c-block-het-archief-image-text-background--${imageAlignment}`,
				{ 'c-block-het-archief-image-text-background--has-image': !!image },
				className
			)}
			style={
				{
					background: backgroundColor,
					...(copyrightHeight ? { '--copyright-height': `${copyrightHeight}px` } : {}),
					...(imageHeight ? { '--image-height': `${imageHeight}px` } : {}),
					...(imageAlignment === 'left-inside-page' || imageAlignment === 'right-inside-page'
						? { width: CONTENT_PAGE_WIDTH_TO_REM[pageWidth] }
						: {}),
				} as CSSProperties
			}
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
							renderIcon={() => (buttonIcon ? <ContentPageIcon name={buttonIcon} /> : null)}
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
					<div
						className="c-block-het-archief-image-text-background__media"
						style={mediaWidth ? { width: mediaWidth } : undefined}
					>
						{image && (
							<div className="c-block-het-archief-image-text-background__image">
								<img ref={imgRef} src={image} alt={imageAltText} onLoad={updateMediaMeasurements} />
							</div>
						)}
						<div
							ref={copyrightRef}
							className="c-block-het-archief-image-text-background__copyright"
						>
							<CopyrightAttribution
								title={copyrightTitle}
								text={copyrightText}
								showIcon={copyrightIconVisible}
							/>
						</div>
						<div
							ref={copyrightMeasureRef}
							className="c-block-het-archief-image-text-background__copyright-measure"
							aria-hidden="true"
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
