import {
	Button,
	ButtonToolbar,
	DatePicker,
	FormGroup,
	Modal,
	ModalBody,
	ModalFooterRight,
	Spacer,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { noop } from 'es-toolkit';
import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import { BlockHeading } from '~content-blocks/BlockHeading/BlockHeading';
import { ToastType } from '~core/config/config.types';
import { getDatePickerDefaultProps } from '~modules/content-page/components/DatePicker/DatePicker.consts';
import { toDateObject, toIsoDate } from '~shared/helpers/formatters/date';
import { showToast } from '~shared/helpers/show-toast';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { getTempAccessValidationErrors } from '../user.consts';

interface TempAccessModalProps {
	tempAccess: Avo.User.TempAccess | null;
	isOpen: boolean;
	onClose?: () => void;
	setTempAccessCallback: (tempAccess: Avo.User.TempAccess) => void;
}

const TempAccessModal: FunctionComponent<TempAccessModalProps> = ({
	tempAccess,
	isOpen,
	onClose,
	setTempAccessCallback,
}) => {
	const fromDate = tempAccess ? toDateObject(tempAccess.from) : null;
	const untilDate = tempAccess ? toDateObject(tempAccess.until) : null;

	const [validationError, setValidationError] = useState<string[] | undefined>(undefined);
	const [from, setFrom] = useState<Date | null>(fromDate || new Date(Date.now()));
	const [until, setUntil] = useState<Date | null>(untilDate);

	const onSave = async () => {
		const newTempAccess = {
			from: from === null ? null : toIsoDate(from),
			until: until === null ? null : toIsoDate(until),
		};

		const validationErrors: string[] = getTempAccessValidationErrors(newTempAccess);

		if (validationErrors?.length) {
			setValidationError(validationErrors);
			showToast({
				type: ToastType.ERROR,
				description: validationErrors.join(', '),
			});
			return;
		}

		setValidationError(undefined);
		setTempAccessCallback(newTempAccess);

		(onClose || noop)();
	};

	const renderConfirmButtons = () => {
		return (
			<ButtonToolbar>
				<Button
					type="secondary"
					label={tText('admin/users/components/temp-access-modal___annuleren')}
					onClick={onClose}
				/>
				<Button
					type="primary"
					label={tText('admin/users/components/temp-access-modal___opslaan')}
					onClick={onSave}
				/>
			</ButtonToolbar>
		);
	};

	const renderModalBody = () => {
		return (
			<FormGroup error={validationError}>
				<BlockHeading className="u-m-0" type="h4">
					{tHtml('admin/users/components/temp-access-modal___begindatum')}
				</BlockHeading>
				<DatePicker {...getDatePickerDefaultProps} value={from} onChange={setFrom} />
				<Spacer margin="top-large">
					<BlockHeading className="u-m-0" type="h4">
						{tHtml('admin/users/components/temp-access-modal___einddatum')}
					</BlockHeading>
				</Spacer>
				<DatePicker {...getDatePickerDefaultProps} value={until} onChange={setUntil} />
			</FormGroup>
		);
	};

	return (
		<Modal
			isOpen={isOpen}
			title={tText('admin/users/components/temp-access-modal___tijdelijke-toegang-instellen')}
			size="small"
			onClose={onClose}
		>
			<ModalBody>{isOpen && renderModalBody()}</ModalBody>
			<ModalFooterRight>{renderConfirmButtons()}</ModalFooterRight>
		</Modal>
	);
};

export default TempAccessModal;
