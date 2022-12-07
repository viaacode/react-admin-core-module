import { ToggleButtonProps } from '@viaa/avo2-components';
import React from 'react';

export type renderBookmarkButtonProps = Pick<
	ToggleButtonProps,
	'active' | 'onClick' | 'ariaLabel' | 'title'
>;
