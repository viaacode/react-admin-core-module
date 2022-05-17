import { Button } from '@meemoo/react-components';
import React from 'react';
import { CellProps, Column } from 'react-table';

import { Icon } from '../../../shared/components/Icon';
import { NavigationElement } from '../../types';

import { ReorderRowFunc } from './NavigationDetail.types';
import { Config } from '~core/config';

export const NAVIGATION_DETAIL_COLS = (
	onReorder: ReorderRowFunc,
	editLink: (id: string) => string,
	onDelete: (id: string) => void
): Column<NavigationElement>[] => {
	const Link = Config.getConfig().services.router.Link;
	return [
		{
			accessor: 'id',
			Cell: ({
				row,
				rows,
				value: id,
			}: CellProps<NavigationElement, NavigationElement['id']>) => {
				const { index } = row;

				return (
					<div>
						<Button
							disabled={index === 0}
							icon={<Icon name="angleUp" />}
							onClick={() => onReorder(index, -1, id)}
							variants={['text', 'small']}
						/>
						<Button
							disabled={index === rows.length - 1}
							icon={<Icon name="angleDown" />}
							onClick={() => onReorder(index, 1, id)}
							variants={['text', 'small']}
						/>
					</div>
				);
			},
		},
		{
			Header: 'Navigatie item',
			accessor: 'label',
		},
		{
			Header: 'Bestemming',
			accessor: 'content_path',
		},
		{
			id: 'actions',
			Cell: ({ row }: CellProps<NavigationElement>) => {
				const { id } = row.original;
				return (
					<div>
						<Link to={editLink(id)}>
							<Button icon={<Icon name="edit" />} tabIndex={-1} variants="text" />
						</Link>
						<Button
							icon={<Icon name="delete" />}
							variants="text"
							onClick={() => onDelete(id)}
						/>
					</div>
				);
			},
		},
	];
};
