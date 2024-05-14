import {
	Button,
	ButtonToolbar,
	ButtonType,
	Modal,
	ModalBody,
	Toolbar,
	ToolbarItem,
	ToolbarRight,
} from '@viaa/avo2-components';
import React, { FunctionComponent, ReactNode } from 'react';

import { tHtml, tText } from '~shared/helpers/translation-functions';

interface ConfirmModalProps {
	title?: string;
	body?: string | ReactNode;
	cancelLabel?: string;
	confirmLabel?: string;
	confirmButtonType?: ButtonType;
	isOpen: boolean;
	onClose?: () => void;
	deleteObjectCallback: () => void;
}

const ConfirmModal: FunctionComponent<ConfirmModalProps> = ({
	title,
	body,
	cancelLabel = 'Annuleer',
	confirmLabel = 'Verwijder',
	confirmButtonType = 'danger',
	onClose = () => {
		// noop
	},
	isOpen,
	deleteObjectCallback,
}) => {
	const modalTitle = (): string => {
		return (
			title ||
			tText(
				'shared/components/delete-object-modal/delete-object-modal___ben-je-zeker-dat-je-deze-actie-wil-uitvoeren'
			)
		);
	};
	const modalBody = () =>
		body ||
		tHtml(
			'shared/components/delete-object-modal/delete-object-modal___deze-actie-kan-niet-ongedaan-gemaakt-worden'
		);

	const handleDelete = () => {
		onClose();
		deleteObjectCallback();
	};

	return (
		<Modal isOpen={isOpen} title={modalTitle()} size="small" onClose={onClose}>
			<ModalBody>
				{modalBody()}
				<Toolbar spaced>
					<ToolbarRight>
						<ToolbarItem>
							<ButtonToolbar>
								<Button type="secondary" label={cancelLabel} onClick={onClose} />
								<Button
									type={confirmButtonType}
									label={confirmLabel}
									onClick={handleDelete}
								/>
							</ButtonToolbar>
						</ToolbarItem>
					</ToolbarRight>
				</Toolbar>
			</ModalBody>
		</Modal>
	);
};

export default ConfirmModal;
