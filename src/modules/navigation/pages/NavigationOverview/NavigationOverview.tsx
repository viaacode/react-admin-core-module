import { Button, Table } from '@meemoo/react-components';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import { Icon, Loader } from '../../../shared/components';
import { AdminLayout } from '../../../shared/layouts';
import { NAVIGATION_PATHS } from '../../const';
import { useGetNavigations } from '../../hooks';

import { NAVIGATION_OVERVIEW_COLS } from './NavigationOverview.const';

const NavigationOverview: FC = () => {
	const componensConfig = useConfig('components');
	const sortingIcons = componensConfig?.table.sortingIcons;

	const { data: navigations, isLoading } = useGetNavigations();

	return (
		<AdminLayout pageTitle="Navigatie">
			<AdminLayout.Actions>
				<Link to={NAVIGATION_PATHS.create}>
					<Button
						iconStart={<Icon name="add" />}
						label="Navigatie toevoegen"
						tabIndex={-1}
						variants="black"
					/>
				</Link>
			</AdminLayout.Actions>

			<AdminLayout.Content>
				{isLoading && <Loader />}

				{!isLoading && !navigations?.length && (
					<div className="u-text-center">
						<h3>Er zijn nog geen navigatie-items aangemaakt.</h3>
						<p>
							Klik op de knop &apos;Navigatie toevoegen&apos; om een eerste
							navigatie-item toe te voegen in het beheer.
						</p>
					</div>
				)}

				{!isLoading && navigations && (
					<Table
						sortingIcons={sortingIcons}
						options={
							{
								data: navigations,
								columns: NAVIGATION_OVERVIEW_COLS(),
								disableSortBy: true,
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
							} as any
						} // TODO: fix table types
					/>
				)}
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default NavigationOverview;
