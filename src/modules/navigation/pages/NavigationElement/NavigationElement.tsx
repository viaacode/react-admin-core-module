import { Button } from '@meemoo/react-components';
import { startCase, uniqBy } from 'lodash-es';
import React, { FC, useMemo } from 'react';

import { AdminLayout } from '../../../shared/layouts';
import { NavigationElementForm } from '../../components';
import { NAVIGATION_PATHS } from '../../const';
import { useGetNavigations } from '../../hooks';
import { Config } from '~core/config';

const NavigationElement: FC = () => {
	const getNavigationNameFromUrl = () => {
		return Config.getConfig().services.router.getUrlParam('navigationName');
	};

	const getNavigationElementIdFromUrl = () => {
		return Config.getConfig().services.router.getUrlParam('navigationElementId');
	};

	const { data: navigations, isLoading } = useGetNavigations();
	const placementOptions = useMemo(() => {
		return isLoading && navigations
			? []
			: uniqBy(
					navigations?.map(({ placement }) => ({
						label: startCase(placement),
						value: placement,
					})),
					'value'
			  );
	}, [navigations, isLoading]);

	// Methods

	const onFormSubmit = () => {
		// do nothing
	};

	// Computed

	const cleanName = startCase(getNavigationNameFromUrl());
	const isEditing = !!getNavigationElementIdFromUrl();
	const pageTitle = !getNavigationNameFromUrl()
		? 'Navigatie toevoegen'
		: isEditing
		? `${cleanName}: item aanpassen`
		: `${cleanName}: item toevoegen`;
	const cancelLink = getNavigationNameFromUrl()
		? NAVIGATION_PATHS.detail.replace(':navigationName', getNavigationNameFromUrl())
		: NAVIGATION_PATHS.overview;
	const Link = Config.getConfig().services.router.Link;

	return (
		<AdminLayout pageTitle={pageTitle}>
			<AdminLayout.Actions>
				<Link to={cancelLink}>
					<Button label="Annuleer" tabIndex={-1} variants="outline" />
				</Link>
				<Button label="Opslaan" variants="black" onClick={onFormSubmit} />
			</AdminLayout.Actions>

			<AdminLayout.Content>
				<NavigationElementForm placementOptions={placementOptions} />
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default NavigationElement;
