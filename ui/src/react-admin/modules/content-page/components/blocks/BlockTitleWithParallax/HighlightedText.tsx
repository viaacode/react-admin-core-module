import React, {
	type FunctionComponent,
	type ReactElement,
	type Ref,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import { computeLineBoxes, type LineBox } from './BlockTitleWithParallax.helpers';

interface HighlightedTextProps {
	htmlTag: 'h1' | 'p';
	text: string;
	wrapperClassName: string;
	textClassName: string;
	boxClassName: string;
}

// Shared between BlockTitleWithParallax's title and subtitle - only the wrapper tag and class
// names differ; the highlight-box measuring/rendering below is identical.
export const HighlightedText: FunctionComponent<HighlightedTextProps> = ({
	htmlTag: Tag,
	text,
	wrapperClassName,
	textClassName,
	boxClassName,
}): ReactElement => {
	const wrapperRef = useRef<HTMLElement>(null);
	const textRef = useRef<HTMLSpanElement>(null);
	const [boxes, setBoxes] = useState<LineBox[]>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-measures on text change
	useLayoutEffect(() => {
		const wrapperEl = wrapperRef.current;
		const textEl = textRef.current;
		if (!wrapperEl || !textEl) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setBoxes([]);
			return undefined;
		}

		let cancelled = false;
		const measure = () => {
			if (!cancelled) {
				setBoxes(computeLineBoxes(wrapperEl, textEl));
			}
		};

		measure();

		const resizeObserver = new ResizeObserver(measure);
		resizeObserver.observe(wrapperEl);

		document.fonts?.ready?.then(measure);

		return () => {
			cancelled = true;
			resizeObserver.disconnect();
		};
	}, [text]);

	// Tag and wrapperRef always agree at runtime (both come from the same `as`) - TS just can't
	// see that a ref generic over the union covers whichever concrete element Tag resolves to.
	const ref = wrapperRef as Ref<HTMLHeadingElement & HTMLParagraphElement>;

	return (
		<Tag ref={ref} className={wrapperClassName}>
			{boxes.map((box, index) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: decorative, no identity of its own
					key={index}
					className={boxClassName}
					style={box}
					aria-hidden="true"
				/>
			))}
			<span ref={textRef} className={textClassName}>
				{text}
			</span>
		</Tag>
	);
};
