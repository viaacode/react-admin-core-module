import {
	Button,
	ButtonToolbar,
	FormGroup,
	Modal,
	ModalBody,
	ModalFooterRight,
	Spacer,
} from '@viaa/avo2-components';
import { UserTempAccess } from '@viaa/avo2-types/types/user';
import { noop } from 'lodash-es';
import React, { FunctionComponent, useState } from 'react';
import DatePicker from 'react-datepicker';
import { BlockHeading } from '~content-blocks/BlockHeading/BlockHeading';
import { datePickerDefaultProps } from '~modules/content-page/components/DatePicker/DatePicker.consts';
import { toDateObject, toIsoDate } from '~shared/helpers/formatters/date';
import { useTranslation } from '~shared/hooks/useTranslation';
import { AdminConfigManager, ToastType } from '~core/config';
import { getTempAccessValidationErrors } from '../user.consts';

interface TempAccessModalProps {
	tempAccess: UserTempAccess | null;
	isOpen: boolean;
	onClose?: () => void;
	setTempAccessCallback: (tempAccess: UserTempAccess) => void;
}

const TempAccessModal: FunctionComponent<TempAccessModalProps> = ({
	tempAccess,
	isOpen,
	onClose,
	setTempAccessCallback,
}) => {
	const { tText, tHtml } = useTranslation();

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

		const validationErrors: string[] = getTempAccessValidationErrors(newTempAccess, {
			tText,
			tHtml,
		});

		if (validationErrors?.length) {
			setValidationError(validationErrors);
			AdminConfigManager.getConfig().services.toastService.showToast({
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
				<DatePicker
					{...datePickerDefaultProps}
					value={toDateObject(from)?.toISOString()}
					onChange={(selectedDate) => {
						setFrom(selectedDate);
					}}
				/>
				<Spacer margin="top-large">
					<BlockHeading className="u-m-0" type="h4">
						{tHtml('admin/users/components/temp-access-modal___einddatum')}
					</BlockHeading>
				</Spacer>
				<DatePicker
					{...datePickerDefaultProps}
					value={toDateObject(until)?.toISOString()}
					onChange={(selectedDate) => {
						setUntil(selectedDate);
					}}
				/>
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
