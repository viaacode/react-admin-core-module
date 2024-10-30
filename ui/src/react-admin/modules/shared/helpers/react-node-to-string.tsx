import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { trim } from 'lodash-es';

export function reactNodeToString(reactNode: ReactNode): string {
	const div = document.createElement('div');
	const root = createRoot(div);
	flushSync(() => {
		root.render(<BrowserRouter>{reactNode}</BrowserRouter>);
	});

	return trim(
		(div.innerHTML || '').replace(/(<[^>]+>)+/g, ', ').replace(/[\r\n \u202F\u00A0]+/g, ' '),
		', '
	);
}
