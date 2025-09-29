import { Button, IconName } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { type FC, useEffect, useState } from 'react';

import './BlockScrollDownNudge.scss';
import { ROUTE_PARTS } from '~shared/consts';

export const BlockScrollDownNudge: FC = () => {
	const [visible, setVisible] = useState<boolean>(false);
	const isAdminRoute = window.location.href.includes(ROUTE_PARTS.admin);

	useEffect(() => {
		// Register window listener when the component mounts
		const onScrollHandler = () => {
			setVisible(false);
			window.removeEventListener('scroll', onScrollHandler);
		};

		const shouldShow = document.body.clientHeight > window.innerHeight;
		setVisible(shouldShow);

		if (shouldShow) {
			window.addEventListener('scroll', onScrollHandler);
		}

		return () => {
			window.removeEventListener('scroll', onScrollHandler);
		};
	}, []);

	return (
		<div
			className={clsx('c-nudge-scroll-down-wrapper', {
				'c-nudge-scroll-down-wrapper--hidden': !isAdminRoute && !visible,
			})}
		>
			<Button
				className="c-nudge-scroll-down-button button-bounce"
				icon={IconName.arrowDown}
				type="tertiary"
			/>
		</div>
	);
};
