import { Button } from '@meemoo/react-components';
import { startCase } from 'lodash-es';
import React from 'react';
import { CellProps, Column } from 'react-table';

import { Icon } from '../../../shared/components';
import { NAVIGATION_PATHS } from '../../const';
import { Navigation, NavigationOverviewCellProps } from '../../types';
import { Config } from '~core/config';

export const NAVIGATION_OVERVIEW_COLS = (): Column<Navigation>[] => {
	const Link = Config.getConfig().services.router.Link;

	return [
		{
			id: 'name',
			Header: 'Naam',
			accessor: 'placement',
			Cell: ({ row }: CellProps<Navigation>) => {
				const { placement } = row.original;

				return (
					<Link to={NAVIGATION_PATHS.detail.replace(':navigationName', placement)}>
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
						<Link to={NAVIGATION_PATHS.detail.replace(':navigationName', placement)}>
							<Button
								icon={<Icon name="view" />}
								tabIndex={-1}
								variants={['text', 'small']}
							/>
						</Link>
						<Link to={NAVIGATION_PATHS.detail.replace(':navigationName', placement)}>
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
};
