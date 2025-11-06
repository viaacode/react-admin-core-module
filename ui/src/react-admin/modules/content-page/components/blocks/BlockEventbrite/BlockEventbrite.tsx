import type { AlignOptions, ButtonProps, DefaultProps, IconName } from '@viaa/avo2-components';
import { Button } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React, { useEffect } from 'react';
import { Icon } from '~shared/components/Icon/Icon.js';

import './BlockEventbrite.scss';

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
		let script: HTMLScriptElement | null = document.getElementById(
			EVENTBRITE_SCRIPT_ID
		) as HTMLScriptElement | null;

		if (!script) {
			script = document.createElement('script');
			script.src = 'https://www.eventbrite.com/static/widgets/eb_widgets.js';
			script.id = EVENTBRITE_SCRIPT_ID;
			document.body.appendChild(script);

			script.onload = () => {
				// biome-ignore lint/suspicious/noExplicitAny: todo
				(window as any).EBWidgets.createWidget({
					eventId,
					widgetType: 'checkout',
					modal: true,
					modalTriggerElementId: elementId,
				});
			};
		}

		return () => script.remove();
	}, [elementId, eventId]);

	return (
		<div className={clsx(className, 'c-block-eventbrite', `c-block-eventbrite__align-${align}`)}>
			<Button
				{...rest}
				id={elementId}
				renderIcon={rest.icon ? () => <Icon name={rest.icon as IconName} /> : undefined}
			/>
		</div>
	);
};
