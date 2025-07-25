import type { FunctionComponent } from 'react';
import React, { useState } from 'react';

import type { TagInfo } from '@viaa/avo2-components';
import {
	Button,
	ButtonToolbar,
	Form,
	FormGroup,
	Modal,
	ModalBody,
	ModalFooterRight,
	Select,
	TagsInput,
	Toolbar,
	ToolbarItem,
	ToolbarRight,
} from '@viaa/avo2-components';
import { tText } from '~shared/helpers/translation-functions';

export type AddOrRemove = 'add' | 'remove';

interface AddOrRemoveLinkedElementsProps {
	title: string; // eg: change subjects
	addOrRemoveLabel: string; // eg: add or remove subjects
	contentLabel: string; // eg: subjects
	isOpen: boolean;
	labels: TagInfo[];
	onClose?: () => void;
	callback: (addOrRemove: AddOrRemove, selectedLabels: TagInfo[]) => void;
}

const AddOrRemoveLinkedElementsModal: FunctionComponent<AddOrRemoveLinkedElementsProps> = ({
	title,
	addOrRemoveLabel,
	contentLabel,
	onClose = () => null,
	isOpen,
	labels,
	callback,
}) => {
	const [selectedLabels, setSelectedLabels] = useState<TagInfo[] | undefined>(undefined);
	const [addOrRemove, setAddOrRemove] = useState<AddOrRemove>('add');

	const handleClose = () => {
		setSelectedLabels(undefined);
		setAddOrRemove('add');
		onClose();
	};

	return (
		<Modal isOpen={isOpen} title={title} size="small" onClose={handleClose}>
			<ModalBody>
				<Form>
					<FormGroup label={addOrRemoveLabel}>
						<Select
							options={[
								{
									label: tText(
										'admin/shared/components/change-labels-modal/change-labels-modal___toevoegen'
									),
									value: 'add',
								},
								{
									label: tText(
										'admin/shared/components/change-labels-modal/change-labels-modal___verwijderen'
									),
									value: 'delete',
								},
							]}
							value={addOrRemove}
							onChange={setAddOrRemove as (value: string) => void}
						/>
					</FormGroup>
					<FormGroup label={contentLabel}>
						<TagsInput options={labels} value={selectedLabels} onChange={setSelectedLabels || []} />
					</FormGroup>
				</Form>
			</ModalBody>
			<ModalFooterRight>
				<Toolbar>
					<ToolbarRight>
						<ToolbarItem>
							<ButtonToolbar>
								<Button
									type="secondary"
									label={tText(
										'admin/shared/components/change-labels-modal/change-labels-modal___annuleren'
									)}
									onClick={handleClose}
								/>
								<Button
									type="primary"
									label={
										addOrRemove === 'add'
											? tText(
													'admin/shared/components/change-labels-modal/change-labels-modal___toevoegen'
												)
											: tText(
													'admin/shared/components/change-labels-modal/change-labels-modal___verwijderen'
												)
									}
									onClick={() => {
										callback(addOrRemove, selectedLabels || []);
										handleClose();
									}}
								/>
							</ButtonToolbar>
						</ToolbarItem>
					</ToolbarRight>
				</Toolbar>
			</ModalFooterRight>
		</Modal>
	);
};

export default AddOrRemoveLinkedElementsModal;
