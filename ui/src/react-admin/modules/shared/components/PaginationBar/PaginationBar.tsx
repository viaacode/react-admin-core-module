import { Button, Pagination } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { FC } from 'react';

import { Icon } from '../Icon';
import { PaginationProgress } from '../PaginationProgress';

import styles from './PaginationBar.module.scss';
import { PaginationBarProps } from './PaginationBar.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

const PaginationBar: FC<PaginationBarProps> = ({
	className,
	count,
	onPageChange,
	showBackToTop,
	start,
	total,
}) => {
	const { tHtml } = useTranslation();

	const pageCount = Math.ceil(total / count);
	const currentPage = start / count;

	const renderProgress = () => {
		const end = start + count;

		return <PaginationProgress {...{ start: start + 1, end, total }} />;
	};

	const scrollTo = (yLocation = 0): void => {
		window.scrollTo({ top: yLocation, left: 0, behavior: 'smooth' });
	};

	const renderPagination = () => (
		<Pagination
			buttons={{
				next: (
					<Button
						className="u-pl-24:sm u-pl-8"
						disabled={currentPage + 1 === pageCount}
						variants={['text', 'neutral']}
						label={tHtml(
							'modules/shared/components/pagination-bar/pagination-bar___volgende'
						)}
						iconEnd={<Icon name={'angleRight'} />}
					/>
				),
				previous: (
					<Button
						className="u-pr-24:sm u-pr-8"
						disabled={currentPage + 1 === 1}
						variants={['text', 'neutral']}
						label={tHtml(
							'modules/shared/components/pagination-bar/pagination-bar___vorige'
						)}
						iconStart={<Icon name={'angleLeft'} />}
					/>
				),
			}}
			showFirstLastNumbers
			onPageChange={onPageChange}
			currentPage={currentPage}
			pageCount={pageCount}
		/>
	);

	return (
		<div
			className={clsx(
				className,
				styles['c-pagination-bar'],
				showBackToTop && styles['c-pagination-bar--back-to-top']
			)}
		>
			{renderProgress()}

			{renderPagination()}

			{showBackToTop && (
				<div className={styles['c-pagination-bar__back-to-top-wrapper']}>
					<Button
						className={styles['c-pagination-bar__back-to-top']}
						variants={['text', 'neutral']}
						label={tHtml(
							'modules/shared/components/pagination-bar/pagination-bar___terug-naar-boven'
						)}
						iconEnd={<Icon name={'angleUp'} />}
						onClick={() => scrollTo(0)}
					/>
				</div>
			)}
		</div>
	);
};

export default PaginationBar;
