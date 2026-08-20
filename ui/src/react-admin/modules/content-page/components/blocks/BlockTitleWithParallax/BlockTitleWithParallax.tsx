import clsx from 'clsx';
import React, {
	type FunctionComponent,
	type ReactElement,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import type { TitleWithParallaxBlockComponentState } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';

import './BlockTitleWithParallax.scss';

export interface BlockTitleWithParallaxProps
	extends TitleWithParallaxBlockComponentState,
		DefaultComponentProps {}

// Must match &__image's height: 150% in the .scss (50% oversize = the max offset below).
const PARALLAX_SPEED = 0.5;

const prefersReducedMotion = (): boolean =>
	typeof window !== 'undefined' &&
	window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

interface LineBox {
	top: number;
	left: number;
	width: number;
	height: number;
}

const rootFontSizePx = (): number =>
	Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

// --h-pad (see .scss) is a plain rem number with no layout effect of its own.
const readPaddingPx = (el: Element, customProperty: string): number =>
	(Number.parseFloat(getComputedStyle(el).getPropertyValue(customProperty)) || 0) *
	rootFontSizePx();

// One decorative highlight box per rendered line of textEl, positioned relative to wrapperEl.
const computeLineBoxes = (wrapperEl: HTMLElement, textEl: HTMLElement): LineBox[] => {
	const wrapperRect = wrapperEl.getBoundingClientRect();
	const hPad = readPaddingPx(wrapperEl, '--h-pad');
	const rects = Array.from(textEl.getClientRects());
	const lastIndex = rects.length - 1;

	return rects.map((rect, index) => {
		const isFirst = index === 0;
		const isLast = index === lastIndex;
		// A loaded font's ascent/descent can exceed the (deliberately tight) line-height, which
		// inflates rect.top/bottom beyond the real spacing between lines - so internal boundaries
		// use the next line's own top, and the outer edges use wrapperEl's real box instead.
		const rawTop = isFirst ? wrapperRect.top : rect.top;
		const rawBottom = isLast ? wrapperRect.bottom : rects[index + 1].top;
		const top = rawTop - wrapperRect.top;
		const bottom = rawBottom - wrapperRect.top;
		const left = rect.left - wrapperRect.left - hPad;
		const right = rect.right - wrapperRect.left + hPad;

		return { top, left, width: right - left, height: bottom - top };
	});
};

export const BlockTitleWithParallax: FunctionComponent<BlockTitleWithParallaxProps> = ({
	className,
	visualType,
	title,
	subtitle,
	image,
}): ReactElement => {
	const rootRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const titleTextRef = useRef<HTMLSpanElement>(null);
	const subtitleRef = useRef<HTMLParagraphElement>(null);
	const subtitleTextRef = useRef<HTMLSpanElement>(null);

	const [titleBoxes, setTitleBoxes] = useState<LineBox[]>([]);
	const [subtitleBoxes, setSubtitleBoxes] = useState<LineBox[]>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-attaches once `image` (and imageRef.current) is set
	useEffect(() => {
		const root = rootRef.current;
		const img = imageRef.current;
		if (!root || !img) {
			return undefined;
		}

		let rafId: number;
		let lastOffset: number | null = null;

		const tick = () => {
			if (prefersReducedMotion()) {
				if (lastOffset !== null) {
					img.style.transform = '';
					lastOffset = null;
				}
			} else {
				const rect = root.getBoundingClientRect();
				const offset = Math.max(-rect.height * PARALLAX_SPEED, Math.min(0, rect.top * PARALLAX_SPEED));
				if (offset !== lastOffset) {
					img.style.transform = `translate3d(0, ${offset}px, 0)`;
					lastOffset = offset;
				}
			}
			rafId = window.requestAnimationFrame(tick);
		};

		rafId = window.requestAnimationFrame(tick);

		return () => {
			window.cancelAnimationFrame(rafId);
		};
	}, [image]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-measures on text change
	useLayoutEffect(() => {
		const titleEl = titleRef.current;
		const titleTextEl = titleTextRef.current;
		if (!titleEl || !titleTextEl) {
			setTitleBoxes([]);
			setSubtitleBoxes([]);
			return undefined;
		}

		const measure = () => {
			setTitleBoxes(computeLineBoxes(titleEl, titleTextEl));

			const subtitleEl = subtitleRef.current;
			const subtitleTextEl = subtitleTextRef.current;
			setSubtitleBoxes(
				subtitleEl && subtitleTextEl ? computeLineBoxes(subtitleEl, subtitleTextEl) : []
			);
		};

		measure();

		const resizeObserver = new ResizeObserver(measure);
		resizeObserver.observe(titleEl);
		if (subtitleRef.current) {
			resizeObserver.observe(subtitleRef.current);
		}

		document.fonts?.ready?.then(measure);

		return () => {
			resizeObserver.disconnect();
		};
	}, [title, subtitle]);

	if (!visualType) {
		return <></>;
	}

	return (
		<div
			ref={rootRef}
			className={clsx(
				'c-block-title-with-parallax',
				`c-block-title-with-parallax--${visualType.toLowerCase()}`,
				className
			)}
		>
			{image && (
				<div
					ref={imageRef}
					className="c-block-title-with-parallax__image"
					aria-hidden="true"
					style={{ backgroundImage: `url(${image})` }}
				/>
			)}
			<div className="c-block-title-with-parallax__content">
				{title && (
					<h1 ref={titleRef} className="c-block-title-with-parallax__title">
						{titleBoxes.map((box, index) => (
							<span
								// biome-ignore lint/suspicious/noArrayIndexKey: decorative, no identity of its own
								key={index}
								className="c-block-title-with-parallax__title-box"
								style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
								aria-hidden="true"
							/>
						))}
						<span ref={titleTextRef} className="c-block-title-with-parallax__title-text">
							{title}
						</span>
					</h1>
				)}
				{subtitle && (
					<p ref={subtitleRef} className="c-block-title-with-parallax__subtitle">
						{subtitleBoxes.map((box, index) => (
							<span
								// biome-ignore lint/suspicious/noArrayIndexKey: decorative, no identity of its own
								key={index}
								className="c-block-title-with-parallax__subtitle-box"
								style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
								aria-hidden="true"
							/>
						))}
						<span ref={subtitleTextRef} className="c-block-title-with-parallax__subtitle-text">
							{subtitle}
						</span>
					</p>
				)}
			</div>
		</div>
	);
};
