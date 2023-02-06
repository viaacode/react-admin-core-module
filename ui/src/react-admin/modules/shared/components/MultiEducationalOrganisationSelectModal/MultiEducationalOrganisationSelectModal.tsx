import {
	Button,
	Checkbox,
	Icon,
	IconName,
	Modal,
	ModalBody,
	ModalFooterRight,
	Spacer,
	TagList,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import React, { FunctionComponent, MouseEvent, useEffect, useState } from 'react';

import { NULL_FILTER } from '../../helpers/filters';
import { EducationalOrganisationsSelect } from '../EducationalOrganisationsSelect/EducationalOrganisationsSelect';

import { useTranslation } from '~shared/hooks/useTranslation';

import './MultiEducationalOrganisationSelectModal.scss';

export interface Tag {
	label: string;
	id: string;
}

export interface MultiEducationalOrganisationSelectModalProps {
	label: string;
	id: string;
	values: Avo.EducationOrganization.Organization[];
	disabled?: boolean;
	onChange: (organisations: string[], id: string) => void;
	showSelectedValuesOnCollapsed?: boolean;
}

export const MultiEducationalOrganisationSelectModal: FunctionComponent<
	MultiEducationalOrganisationSelectModalProps
> = ({ label, id, values, disabled, onChange, showSelectedValuesOnCollapsed = true }) => {
	const { tHtml, tText } = useTranslation();

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [includeEmpty, setIncludeEmpty] = useState<boolean>(false);
	const [selectedOrganisations, setSelectedOrganisations] =
		useState<Avo.EducationOrganization.Organization[]>(values);

	useEffect(() => {
		setSelectedOrganisations(values.filter((org) => org.label !== NULL_FILTER));
		setIncludeEmpty(!!values.find((org) => org.label === NULL_FILTER));
	}, [isOpen, values]);

	const closeModal = () => {
		setIsOpen(false);
	};

	const applyFilter = () => {
		onChange(
			[
				...selectedOrganisations.map((org) => `${org.organizationId}:${org.unitId || ''}`),
				...(includeEmpty ? [NULL_FILTER] : []),
			],
			id
		);
		closeModal();
	};

	const deleteAllSelectedOrganisations = (_tagId: string | number, clickEvent: MouseEvent) => {
		setSelectedOrganisations([]);
		onChange([], id);
		clickEvent.stopPropagation();
	};

	const renderCheckboxControl = () => {
		const selected: number = selectedOrganisations.length + (includeEmpty ? 1 : 0);
		return (
			<>
				<div>
					<Button
						autoHeight
						className="c-checkbox-dropdown-modal__trigger"
						type="secondary"
						onClick={() => setIsOpen(!isOpen)}
					>
						<div className="c-button__content">
							<div className="c-button__label">{label}</div>
							{!!selected && showSelectedValuesOnCollapsed && (
								<TagList
									tags={[
										{
											id: 'users',
											label: `${selected} ${
												selected > 1
													? tText(
															'shared/components/multi-educational-organisation-select-modal/multi-educational-organisation-select-modal___items-geselecteerd'
													  )
													: tText(
															'shared/components/multi-educational-organisation-select-modal/multi-educational-organisation-select-modal___item-geselecteerd'
													  )
											}`,
										},
									]}
									swatches={false}
									closable
									onTagClosed={deleteAllSelectedOrganisations}
								/>
							)}
							<Icon
								className="c-button__icon"
								name={isOpen ? IconName.caretUp : IconName.caretDown}
								size="small"
								type="arrows"
							/>
						</div>
					</Button>
				</div>
				<Modal
					isOpen={isOpen}
					onClose={closeModal}
					title={tText(
						'shared/components/multi-educational-organisation-select-modal/multi-educational-organisation-select-modal___educatieve-organisaties'
					)}
					size={'medium'}
				>
					<ModalBody>
						<Spacer margin="bottom-small">
							<Checkbox
								label={tHtml('admin/users/user___leeg')}
								checked={includeEmpty}
								onChange={setIncludeEmpty}
							/>
						</Spacer>
						<EducationalOrganisationsSelect
							organisations={selectedOrganisations}
							onChange={setSelectedOrganisations}
						/>
					</ModalBody>
					<ModalFooterRight>
						<Button
							label={tText(
								'shared/components/checkbox-dropdown-modal/checkbox-dropdown-modal___toepassen'
							)}
							type="primary"
							className="c-apply-filter-button"
							block
							onClick={applyFilter}
						/>
					</ModalFooterRight>
				</Modal>
			</>
		);
	};

	if (disabled) {
		return (
			<div className={clsx({ 'u-opacity-50 u-disable-click': disabled })}>
				{renderCheckboxControl()}
			</div>
		);
	}

	return renderCheckboxControl();
};
