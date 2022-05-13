import { Button, Pagination as MeemooPagination } from '@meemoo/react-components';
import React, { FC } from 'react';

import { Icon } from '../Icon';

import { PaginationProps } from './Pagination.types';

export const Pagination: FC<PaginationProps> = ({ currentPage = 1, pageCount, onPageChange }) => {
	return (
		<MeemooPagination
			buttons={{
				next: (
					<Button
						disabled={currentPage + 1 === pageCount}
						label="Volgende"
						iconEnd={<Icon name="angleRight" />}
					/>
				),
				previous: (
					<Button
						disabled={currentPage + 1 === 1}
						label="Vorige"
						iconStart={<Icon name="angleLeft" />}
					/>
				),
			}}
			showFirstLastNumbers
			onPageChange={onPageChange}
			currentPage={currentPage}
			pageCount={pageCount}
		/>
	);
};
