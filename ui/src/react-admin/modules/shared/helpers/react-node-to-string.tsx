import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { stripHtml } from '~shared/helpers/formatters/strip-html';

export function reactNodeToString(reactNode: ReactNode): string {
	const div = document.createElement('div');
	const root = createRoot(div);
	flushSync(() => {
		root.render(<BrowserRouter>{reactNode}</BrowserRouter>);
	});
	return stripHtml(div.innerHTML);
}
