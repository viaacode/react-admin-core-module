import { type RefObject, useLayoutEffect, useRef, useState } from 'react';
import { computeLineBoxes, type LineBox } from '../BlockTitleWithParallax.helpers';

interface HighlightRefs<TWrapper extends HTMLElement> {
	wrapperRef: RefObject<TWrapper | null>;
	textRef: RefObject<HTMLSpanElement | null>;
	boxes: LineBox[];
}

// Measures one highlight box per rendered line (see computeLineBoxes) for one title/subtitle,
// re-measuring on resize and once the real font swaps in - content is the effect's own dependency
// since neither ref identity nor its .current changes when the text itself does.
export const useHighlightBoxes = <TWrapper extends HTMLElement>(
	content: string | undefined
): HighlightRefs<TWrapper> => {
	const wrapperRef = useRef<TWrapper>(null);
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
	}, [content]);

	return { wrapperRef, textRef, boxes };
};
