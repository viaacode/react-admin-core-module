import { Button } from '@meemoo/react-components';
import { startCase, uniqBy } from 'lodash-es';
import React, { FC, useMemo } from 'react';
import { generatePath, Link, useParams } from 'react-router-dom';

import { AdminLayout } from '../../../shared/layouts';
import { NavigationElementForm } from '../../components';
import { NAVIGATION_PATHS } from '../../const';
import { useGetNavigations } from '../../hooks';
import { NavigationElementParams } from '../../types';

const NavigationElement: FC = () => {
	const { navigationName, navigationElementId } = useParams<NavigationElementParams>();
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

	const cleanName = startCase(navigationName);
	const isEditing = !!navigationElementId;
	const pageTitle = !navigationName
		? 'Navigatie toevoegen'
		: isEditing
		? `${cleanName}: item aanpassen`
		: `${cleanName}: item toevoegen`;
	const cancelLink = navigationName
		? generatePath(NAVIGATION_PATHS.detail, { navigationName })
		: NAVIGATION_PATHS.overview;

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
