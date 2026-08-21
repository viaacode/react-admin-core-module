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

import {
	computeLineBoxes,
	type LineBox,
	readParallaxSpeed,
	watchReducedMotion,
} from './BlockTitleWithParallax.helpers';

import './BlockTitleWithParallax.scss';

export interface BlockTitleWithParallaxProps
	extends TitleWithParallaxBlockComponentState,
		DefaultComponentProps {}

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

		const speed = readParallaxSpeed(img);
		let reducedMotion = false;
		const unwatchReducedMotion = watchReducedMotion((value) => {
			reducedMotion = value;
		});

		let rafId: number | null = null;
		let lastOffset: number | null = null;

		const tick = () => {
			if (reducedMotion) {
				if (lastOffset !== null) {
					img.style.transform = '';
					lastOffset = null;
				}
			} else {
				const rect = root.getBoundingClientRect();
				const offset = Math.max(-rect.height * speed, Math.min(0, rect.top * speed));
				if (offset !== lastOffset) {
					img.style.transform = `translate3d(0, ${offset}px, 0)`;
					lastOffset = offset;
				}
			}
			rafId = window.requestAnimationFrame(tick);
		};

		const start = () => {
			if (rafId === null) {
				rafId = window.requestAnimationFrame(tick);
			}
		};
		const stop = () => {
			if (rafId !== null) {
				window.cancelAnimationFrame(rafId);
				rafId = null;
			}
		};

		// Only animate while the block is (near) the viewport - a page with several of these
		// blocks would otherwise keep every single one polling forever.
		const intersectionObserver = new IntersectionObserver(
			([entry]) => (entry.isIntersecting ? start() : stop()),
			{ rootMargin: '50% 0px' }
		);
		intersectionObserver.observe(root);

		return () => {
			intersectionObserver.disconnect();
			stop();
			unwatchReducedMotion();
		};
	}, [image]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-measures on text change
	useLayoutEffect(() => {
		const titleEl = titleRef.current;
		const titleTextEl = titleTextRef.current;
		if (!titleEl || !titleTextEl) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setTitleBoxes([]);
			setSubtitleBoxes([]);
			return undefined;
		}

		let cancelled = false;

		const measure = () => {
			if (cancelled) {
				return;
			}
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
			cancelled = true;
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
					style={{ backgroundImage: `url("${image}")` }}
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
