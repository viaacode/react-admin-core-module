import { IconName } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import React, { FunctionComponent, ReactElement, ReactNode } from 'react';

import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { tHtml } from '~shared/helpers/translation-functions';
import { useTranslation } from '~shared/hooks/useTranslation';
import { Permissions, PermissionService } from '~shared/services/permission-service';

export type LoadingState = 'loading' | 'loaded' | 'error';

export interface ErrorViewQueryParams {
	message?: ReactNode | string;
	icon?: IconName;
	actionButtons?: Avo.Auth.ErrorActionButton[];
}

export interface LoadingInfo extends ErrorViewQueryParams {
	state: LoadingState;
}

export interface LoadingErrorLoadedComponentProps {
	loadingInfo: LoadingInfo;
	notFoundError?: string | null;
	showSpinner?: boolean;
	dataObject: any | undefined | null;
	render: () => ReactElement | null;
}

/**
 * @deprecated use react-query useQuery function to handle loading and error states
 * @param loadingInfo
 * @param notFoundError
 * @param showSpinner
 * @param dataObject
 * @param render
 * @constructor
 */
export const LoadingErrorLoadedComponent: FunctionComponent<LoadingErrorLoadedComponentProps> = ({
	loadingInfo = { state: 'loading' },
	notFoundError,
	showSpinner = true,
	dataObject,
	render,
}) => {
	const { tHtml } = useTranslation();

	const renderError = () => (
		// <ErrorView
		// 	message={
		// 		loadingInfo.message ||
		// 		t(
		// 			'shared/components/loading-error-loaded-component/loading-error-loaded-component___er-is-iets-mis-gegaan-bij-het-laden-van-de-gegevens'
		// 		)
		// 	}
		// 	icon={loadingInfo.icon || 'alertTriangle' as IconName}
		// 	actionButtons={loadingInfo.actionButtons || ['home']}
		// />
		<>
			{loadingInfo.message ||
				tHtml(
					'shared/components/loading-error-loaded-component/loading-error-loaded-component___er-is-iets-mis-gegaan-bij-het-laden-van-de-gegevens'
				)}
		</>
	);

	// Render
	switch (loadingInfo.state) {
		case 'error':
			return renderError();

		case 'loaded':
			if (dataObject) {
				return render();
			}
			return (
				<>
					{notFoundError ||
						tHtml(
							'shared/components/loading-error-loaded-component/loading-error-loaded-component___het-gevraagde-object-is-niet-gevonden'
						)}
				</>
			);

		case 'loading':
		default:
			return showSpinner ? <CenteredSpinner /> : <></>;
	}
};
