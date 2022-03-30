import { Button } from '@meemoo/react-components';
import { startCase } from 'lodash-es';
import React from 'react';
import { generatePath, Link } from 'react-router-dom';
import { CellProps, Column } from 'react-table';

import { Icon } from '../../../shared/components';
import { NAVIGATION_PATHS } from '../../const';
import { Navigation, NavigationOverviewCellProps } from '../../types';

export const NAVIGATION_OVERVIEW_COLS = (): Column<Navigation>[] => [
	{
		id: 'name',
		Header: 'Naam',
		accessor: 'placement',
		Cell: ({ row }: CellProps<Navigation>) => {
			const { placement } = row.original;

			return (
				<Link to={generatePath(NAVIGATION_PATHS.detail, { navigationName: placement })}>
					{startCase(placement)}
				</Link>
			);
		},
	},
	{
		id: 'description',
		Header: 'Beschrijving',
		accessor: 'description',
	},
	{
		id: 'actions',
		Cell: ({ row }: NavigationOverviewCellProps) => {
			const placement = row.original.placement ?? '';
			return (
				<div>
					<Link to={generatePath(NAVIGATION_PATHS.detail, { navigationName: placement })}>
						<Button
							icon={<Icon name="view" />}
							tabIndex={-1}
							variants={['text', 'small']}
						/>
					</Link>
					<Link to={generatePath(NAVIGATION_PATHS.detail, { navigationName: placement })}>
						<Button
							icon={<Icon name="add" />}
							tabIndex={-1}
							variants={['text', 'small']}
						/>
					</Link>
				</div>
			);
		},
	},
];
