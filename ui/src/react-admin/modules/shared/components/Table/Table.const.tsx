import type { TableSortingIcons } from '@meemoo/react-components';
import React from 'react';

import { AdminCoreIconName } from '~core/config/config.types';
import { Icon } from '../Icon/Icon';

export const sortingIcons: TableSortingIcons = {
	asc: <Icon className="c-sorting-icon" name={AdminCoreIconName.ArrowUp} />,
	default: <Icon className="c-sorting-icon" name={AdminCoreIconName.SortTable} />,
	desc: <Icon className="c-sorting-icon" name={AdminCoreIconName.ArrowDown} />,
};
