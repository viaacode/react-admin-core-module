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

import clsx from 'clsx';
import type { FunctionComponent, MouseEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { AVO } from '~shared/types';
import { getEducationOrganisationKey } from '../../helpers/edu-org-string-to-client-org';
import { NULL_FILTER } from '../../helpers/filters';
import { EducationalOrganisationsSelect } from '../EducationalOrganisationsSelect/EducationalOrganisationsSelect';

import './MultiEducationalOrganisationSelectModal.scss';
import type { AvoEducationOrganizationOrganization } from '@viaa/avo2-types';

export interface MultiEducationalOrganisationSelectModalProps {
	label: string;
	id: string;
	values: AvoEducationOrganizationOrganization[];
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
		useState<AvoEducationOrganizationOrganization[]>(values);

	// The values passed in only contain the organisation and unit ids (from the url), not the names.
	// Remember the full organisations the user picked, so we can show their names again,
	// and fetch the names of organisations we do not know yet (eg: after a page reload)
	const knownOrganisations = useRef<Record<string, AvoEducationOrganizationOrganization>>({});

	// values is a new array on every render, so only react to actual changes in the selected organisations
	const valuesKey = values.map(getEducationOrganisationKey).join(',');

	// biome-ignore lint/correctness/useExhaustiveDependencies: values is derived from valuesKey
	useEffect(() => {
		const orgs = values
			.filter((org) => org.organisationLabel !== NULL_FILTER)
			.map((org) => knownOrganisations.current[getEducationOrganisationKey(org)] || org);
		setSelectedOrganisations(orgs);
		setIncludeEmpty(!!values.find((org) => org.organisationLabel === NULL_FILTER));

		orgs
			.filter((org) => !knownOrganisations.current[getEducationOrganisationKey(org)])
			.forEach(async (org) => {
				try {
					const name =
						await AdminConfigManager.getConfig().services.educationOrganisationService.fetchEducationOrganisationName(
							org.organisationId,
							org.unitId || undefined
						);
					if (!name) {
						return;
					}
					const key = getEducationOrganisationKey(org);
					const namedOrg = { ...org, organisationLabel: name };
					knownOrganisations.current[key] = namedOrg;
					setSelectedOrganisations((selectedOrgs) =>
						selectedOrgs.map((selectedOrg) =>
							getEducationOrganisationKey(selectedOrg) === key ? namedOrg : selectedOrg
						)
					);
				} catch (err) {
					console.error('Failed to fetch educational organisation name', err, { org });
				}
			});
	}, [valuesKey]);

	const handleSelectedOrganisationsChanged = (orgs: AvoEducationOrganizationOrganization[]) => {
		orgs.forEach((org) => {
			knownOrganisations.current[getEducationOrganisationKey(org)] = org;
		});
		setSelectedOrganisations(orgs);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	const applyFilter = () => {
		onChange(
			[
				...selectedOrganisations.map(getEducationOrganisationKey),
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
							onChange={handleSelectedOrganisationsChanged}
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
