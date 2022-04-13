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
import React, { FunctionComponent } from 'react';

import { sanitizeHtml } from '../../helpers/sanitize';
import Html from '../Html/Html';

import { Config } from '~core/config';

interface ConfirmModalProps {
	title?: string;
	body?: string;
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
	const modalTitle = () =>
		title ||
		Config.getConfig().services.i18n.t(
			'shared/components/delete-object-modal/delete-object-modal___ben-je-zeker-dat-je-deze-actie-wil-uitvoeren'
		);
	const modalBody = () =>
		body ||
		Config.getConfig().services.i18n.t(
			'shared/components/delete-object-modal/delete-object-modal___deze-actie-kan-niet-ongedaan-gemaakt-worden'
		);

	const handleDelete = () => {
		onClose();
		deleteObjectCallback();
	};

	return (
		<Modal
			isOpen={isOpen}
			title={modalTitle && sanitizeHtml(modalTitle(), 'basic')}
			size="small"
			onClose={onClose}
			scrollable
		>
			<ModalBody>
				{!!modalBody && <Html content={modalBody()} />}
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