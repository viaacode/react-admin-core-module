import type { TableSortingIcons } from '@meemoo/react-components';
import React from 'react';

import { Icon } from '../Icon';

export const sortingIcons: TableSortingIcons = {
	asc: <Icon className="c-sorting-icon" name="arrowUp" />,
	default: <Icon className="c-sorting-icon" name="sortTable" />,
	desc: <Icon className="c-sorting-icon" name="arrowDown" />,
};
