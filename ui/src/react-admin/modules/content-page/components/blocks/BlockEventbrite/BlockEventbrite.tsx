import { AlignOptions, Button, ButtonProps, DefaultProps } from '@viaa/avo2-components';
import classnames from 'classnames';
import React, { FunctionComponent, useEffect } from 'react';

import './BlockEventbrite.scss';
import Icon from '~shared/components/Icon/Icon';

export interface BlockEventbriteProps extends DefaultProps, ButtonProps {
	eventId: string;
	align?: AlignOptions;
	className?: string;
}

const EVENTBRITE_SCRIPT_ID = 'eventbriteWidgetsScript';

export const BlockEventbrite: FunctionComponent<BlockEventbriteProps> = ({
	eventId,
	align = 'center',
	className,
	...rest
}) => {
	const elementId = `eventbrite-widget-modal-trigger-${eventId}`;

	useEffect(() => {
		const existingScript = document.getElementById(EVENTBRITE_SCRIPT_ID);
		if (!existingScript) {
			const script = document.createElement('script');
			script.src = 'https://www.eventbrite.com/static/widgets/eb_widgets.js';
			script.id = EVENTBRITE_SCRIPT_ID;
			document.body.appendChild(script);

			script.onload = () => {
				(window as any).EBWidgets.createWidget({
					eventId,
					widgetType: 'checkout',
					modal: true,
					modalTriggerElementId: elementId,
				});
			};
		}
	}, [elementId, eventId]);

	return (
		<div
			className={classnames(
				className,
				'c-block-eventbrite',
				`c-block-eventbrite__align-${align}`
			)}
		>
			<Button
				{...rest}
				id={elementId}
				renderIcon={rest.icon ? () => <Icon name={rest.icon as string} /> : undefined}
			/>
		</div>
	);
};
