import { Button, Table } from '@meemoo/react-components';
import { startCase } from 'lodash-es';
import React, { FC, useState } from 'react';
import { useQueryClient } from 'react-query';
import { generatePath, Link, useHistory, useParams } from 'react-router-dom';

import { Icon } from '../../../shared/components';
import { useHasChanges } from '../../../shared/hooks';
import { AdminLayout } from '../../../shared/layouts';
import { NAVIGATION_PATHS, NAVIGATION_QUERY_KEYS } from '../../const';
import {
	useDeleteNavigationElement,
	useGetNavigationByPlacement,
	useUpdateNavigation,
} from '../../hooks';
import { NavigationElement } from '../../types';

import { NAVIGATION_DETAIL_COLS } from './NavigationDetail.const';
import { NavigationDetailParams, ReorderRowFunc } from './NavigationDetail.types';

const NavigationDetail: FC = () => {
	// TODO: uncomment once modal is available
	// const [idToDelete, setIdToDelete] = useState<string | null>(null);
	// const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [navigationElements, setNavigationElements] = useState<NavigationElement[]>([]);

	const history = useHistory();
	const { navigationName } = useParams<NavigationDetailParams>();

	// Data

	const queryClient = useQueryClient();
	const { data: initialData, isLoading } = useGetNavigationByPlacement(navigationName, {
		onSuccess: (data) => setNavigationElements(data),
	});
	const invalidateNavigation = () =>
		queryClient.invalidateQueries(NAVIGATION_QUERY_KEYS.list(navigationName));
	const { mutate: deleteOne } = useDeleteNavigationElement({
		onSuccess: invalidateNavigation,
	});
	const { mutate: saveNavigation, isLoading: isSaving } = useUpdateNavigation({
		onSuccess: invalidateNavigation,
	});
	const hasChanges = useHasChanges(initialData, navigationElements, isLoading);

	// Methods

	const getEditLink = (navigationElementId: string) =>
		generatePath(NAVIGATION_PATHS.detailEdit, { navigationName, navigationElementId });

	const onDeleteElement = (id: string) => {
		deleteOne(id);
		// TODO: uncomment once modal is available
		// if (idToDelete) {
		// 	deleteOne(idToDelete);
		// }
		// setIsDeleteModalOpen(false);
	};

	// TODO: uncomment once modal is available
	// const onOpenDeleteModal = (id: string) => {
	// 	setIdToDelete(id);
	// 	setIsDeleteModalOpen(true);
	// };

	const onReorderRow: ReorderRowFunc = (currentIndex, indexUpdate) => {
		const newIndex = currentIndex + indexUpdate;

		setNavigationElements((oldState) => {
			const newState = [...oldState];
			const updatedItem = newState.splice(currentIndex, 1)[0];
			newState.splice(newIndex, 0, updatedItem);
			return newState;
		});
	};

	const onSave = async () => {
		saveNavigation(navigationElements);
	};

	// Render

	if (!isLoading && !initialData?.length) {
		// Navigate back to overview when there are no elements after fetch
		history.push(NAVIGATION_PATHS.overview);
	}

	return (
		<AdminLayout pageTitle={startCase(navigationName)}>
			<AdminLayout.Actions>
				<Link to={NAVIGATION_PATHS.overview}>
					<Button label="Annuleer" tabIndex={-1} variants={['outline']} />
				</Link>
				<Button
					disabled={!hasChanges || isSaving}
					label="Opslaan"
					variants={['black']}
					onClick={onSave}
				/>
			</AdminLayout.Actions>

			<AdminLayout.Content>
				<Table
					options={
						{
							columns: NAVIGATION_DETAIL_COLS(
								onReorderRow,
								getEditLink,
								// TODO: replace this with modal open once modal is available
								onDeleteElement
							),
							data: navigationElements,
							disableSortBy: true,
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
						} as any
					}
				/>

				<div className="c-admin-table-footer u-text-center u-mt-16">
					<Link to={generatePath(NAVIGATION_PATHS.detailCreate, { navigationName })}>
						<Button
							iconStart={<Icon name="add" />}
							label="Voeg een navigatie-item toe"
							tabIndex={-1}
							variants="black"
						/>
					</Link>
				</div>

				{/* TODO: add modal from meemoo/react-components */}
				{/* <ConfirmationModal
					isOpen={isDeleteModalOpen}
					onClose={() => setIsDeleteModalOpen(false)}
					onConfirm={() => onDeleteElement()}
				/> */}
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default NavigationDetail;
