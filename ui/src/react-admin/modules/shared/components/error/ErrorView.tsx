import type { IconName } from '@viaa/avo2-components';
import {
	Blankslate,
	Button,
	ButtonToolbar,
	Container,
	Toolbar,
	ToolbarCenter,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { isNull } from 'lodash-es';
import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import { CustomError } from '~shared/helpers/custom-error';
import { isMobileWidth } from '~shared/helpers/media-query';
import { tText } from '~shared/helpers/translation-functions';
import { Link } from '../Link';

import './ErrorView.scss';

interface ErrorViewProps {
	message?: string | ReactNode;
	icon?: IconName;
	actionButtons?: Avo.Auth.ErrorActionButton[] | null;
	children?: ReactNode;
}

export const ErrorView: FunctionComponent<ErrorViewProps> = ({
	message,
	icon,
	children = null,
	actionButtons,
}) => {
	const messageText: string | ReactNode = message || '';
	const errorMessage: string | ReactNode = messageText;
	const errorIcon = (icon || 'search') as IconName;
	const actionButtonsResolved = isNull(actionButtons) ? [] : actionButtons || [];

	if (!message) {
		console.error(
			new CustomError('Error view without error message', null, {
				message,
				icon,
				actionButtonsResolved,
			})
		);
	}

	const renderButtons = () => {
		const buttons = (
			<>
				{actionButtonsResolved?.includes('home') && (
					<Link to="/">
						<Button
							label={tText('error/views/error-view___ga-terug-naar-de-homepagina')}
						/>
					</Link>
				)}
				{actionButtonsResolved?.includes('helpdesk') && (
					<Button
						type="danger"
						onClick={() => (window as any).zE('webWidget', 'toggle')}
						label={tText('error/views/error-view___contacteer-de-helpdesk')}
					/>
				)}
			</>
		);

		if (isMobileWidth()) {
			return <div className="c-error-buttons__mobile">{buttons}</div>;
		}
		return (
			<Toolbar>
				<ToolbarCenter>
					<ButtonToolbar>{buttons}</ButtonToolbar>
				</ToolbarCenter>
			</Toolbar>
		);
	};

	return (
		<Container mode="vertical" background="alt" className="m-error-view">
			<Container size="medium" mode="horizontal">
				<Blankslate body="" icon={errorIcon} title={errorMessage} className="c-content">
					{children}
					{renderButtons()}
				</Blankslate>
			</Container>
		</Container>
	);
};
