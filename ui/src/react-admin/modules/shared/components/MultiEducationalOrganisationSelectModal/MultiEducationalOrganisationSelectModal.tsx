import type { IconName } from '@viaa/avo2-components';
import {
	Button,
	Checkbox,
	Icon,
	Modal,
	ModalBody,
	ModalFooterRight,
	Spacer,
	TagList,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import type { FunctionComponent, MouseEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { AVO } from '~shared/types/index';
import { NULL_FILTER } from '../../helpers/filters';
import { EducationalOrganisationsSelect } from '../EducationalOrganisationsSelect/EducationalOrganisationsSelect';

import './MultiEducationalOrganisationSelectModal.scss';

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
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [includeEmpty, setIncludeEmpty] = useState<boolean>(false);
	const [selectedOrganisations, setSelectedOrganisations] =
		useState<Avo.EducationOrganization.Organization[]>(values);

	useEffect(() => {
		setSelectedOrganisations(values.filter((org) => org.organisationLabel !== NULL_FILTER));
		setIncludeEmpty(!!values.find((org) => org.organisationLabel === NULL_FILTER));
	}, [values]);

	const closeModal = () => {
		setIsOpen(false);
	};

	const applyFilter = () => {
		onChange(
			[
				...selectedOrganisations.map((org) => `${org.organisationId}:${org.unitId || ''}`),
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
															'shared/components/multi-educational-organisation-select-modal/multi-educational-organisation-select-modal___items-geselecteerd',
															{},
															[AVO]
														)
													: tText(
															'shared/components/multi-educational-organisation-select-modal/multi-educational-organisation-select-modal___item-geselecteerd',
															{},
															[AVO]
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
								name={isOpen ? ('caretUp' as IconName) : ('caretDown' as IconName)}
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
						'shared/components/multi-educational-organisation-select-modal/multi-educational-organisation-select-modal___educatieve-organisaties',
						{},
						[AVO]
					)}
					size={'medium'}
				>
					<ModalBody>
						<Spacer margin="bottom-small">
							<Checkbox
								label={tHtml('admin/users/user___leeg', {}, [AVO])}
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
								'shared/components/checkbox-dropdown-modal/checkbox-dropdown-modal___toepassen',
								{},
								[AVO]
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
