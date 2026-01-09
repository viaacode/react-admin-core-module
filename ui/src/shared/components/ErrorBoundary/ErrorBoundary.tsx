import { IconName } from '@viaa/avo2-components';
import { lazy } from 'react';
import { useRouteError } from 'react-router';

import './ErrorBoundary.scss';

export function ErrorBoundary(locationId: string) {
	// biome-ignore lint/suspicious/noExplicitAny: We don't know what errors can be thrown in advance
	const error = useRouteError() as any;

	// Lazy load ErrorView to prevent tText to be called who has a chain to the admin-core which uses use-query-params as commonJs with vite 7 cannot load
	const ErrorView = lazy(() =>
		import('../../../react-admin/modules/shared/components/error/ErrorView.tsx').then((module) => ({
			default: module.ErrorView,
		}))
	);
	return (
		<ErrorView
			locationId={`${locationId}--error`}
			icon={IconName.alertTriangle}
			message={
				<>
					Een onverwachte error is opgetreden. Als dit blijft voorkomen, neem contact op met de
					helpdesk.
					<br />
					<span className="c-error-boundary__error-message">
						{error?.status} {error?.statusText} {error?.message}
					</span>
				</>
			}
			actionButtons={['home', 'helpdesk']}
		/>
	);
}
