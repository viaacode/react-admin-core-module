import { Button, IconName } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { type FC, useCallback, useEffect, useState } from 'react';

import './BlockScrollDownNudge.scss';
import { ROUTE_PARTS } from '~shared/consts/routes';

export const BlockScrollDownNudge: FC = () => {
	const isAdminRoute = window.location.href.includes(ROUTE_PARTS.admin);

	const [visible, setVisible] = useState<boolean>(false);
	const [sizing, setSizing] = useState<
		| {
				width: number;
				right: number;
				left: number;
		  }
		| undefined
	>(undefined);

	const determinePosition = useCallback(() => {
		const previewScrollable = document.querySelector('.c-content-page-preview');
		if (previewScrollable) {
			const contentRect = previewScrollable.getBoundingClientRect();
			setSizing({
				width: contentRect.width,
				right: contentRect.right,
				left: contentRect.left,
			});
		}
	}, []);

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

	useEffect(() => {
		const previewScrollable = document.querySelector('.c-content-page-preview');
		const resizeObserver = new ResizeObserver(determinePosition);

		if (previewScrollable) {
			resizeObserver.observe(previewScrollable);
		}

		determinePosition();
	}, [determinePosition]);

	return (
		<div
			className={clsx('c-nudge-scroll-down-wrapper', {
				'c-nudge-scroll-down-wrapper--hidden': !isAdminRoute && !visible,
			})}
			style={sizing || {}}
		>
			<Button
				className="c-nudge-scroll-down-button button-bounce"
				icon={IconName.arrowDown}
				type="tertiary"
			/>
		</div>
	);
};
