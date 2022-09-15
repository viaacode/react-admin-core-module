import { Container, Flex, IconName, Spinner } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import React, { FunctionComponent, ReactElement, ReactNode } from 'react';

import { AdminConfigManager } from '~core/config';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { Permissions, PermissionService } from '~modules/shared/services/permission-service';
import { CommonUser } from '~modules/user/user.types';

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

export const LoadingErrorLoadedComponent: FunctionComponent<LoadingErrorLoadedComponentProps> = ({
	loadingInfo = { state: 'loading' },
	notFoundError,
	showSpinner = true,
	dataObject,
	render,
}) => {
	const { tHtml } = useTranslation();

	const renderSpinner = () => (
		<Container mode="vertical">
			<Flex orientation="horizontal" center>
				<Spinner size="large" />
			</Flex>
		</Container>
	);

	const renderError = () => (
		// <ErrorView
		// 	message={
		// 		loadingInfo.message ||
		// 		t(
		// 			'shared/components/loading-error-loaded-component/loading-error-loaded-component___er-is-iets-mis-gegaan-bij-het-laden-van-de-gegevens'
		// 		)
		// 	}
		// 	icon={loadingInfo.icon || 'alert-triangle'}
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
			return showSpinner ? renderSpinner() : <></>;
	}
};

export async function checkPermissions(
	permissions: Permissions,
	user: CommonUser | undefined,
	successFunc: () => void,
	setLoadingInfo: (info: LoadingInfo) => void,
	noPermissionsMessage?: string
): Promise<void> {
	try {
		if (!user) {
			return;
		}

		if (await PermissionService.hasPermissions(permissions, user)) {
			successFunc();
		} else {
			setLoadingInfo({
				state: 'error',
				message:
					noPermissionsMessage ||
					AdminConfigManager.getConfig().services.i18n.tHtml(
						'shared/components/loading-error-loaded-component/loading-error-loaded-component___je-hebt-geen-rechten-voor-deze-pagina'
					),
				icon: 'lock',
			});
		}
	} catch (err) {
		console.error('Failed to check permissions', err, { permissions, user });
		setLoadingInfo({
			state: 'error',
			message: AdminConfigManager.getConfig().services.i18n.tHtml(
				'shared/components/loading-error-loaded-component/loading-error-loaded-component___er-ging-iets-mis-tijdens-het-controleren-van-de-rechten-van-je-account'
			),
			icon: 'alert-triangle',
		});
	}
}
