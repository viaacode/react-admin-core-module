import { FC, ReactNode } from 'react';
import { Button, Modal } from '@meemoo/react-components';
import { AlertsOverview } from '~modules/alerts/views';

export const AlertsOverviewPage: FC = () => {
	const renderPopup = ({
		title,
		body,
		isOpen,
		onSave,
		onClose,
	}: {
		title: string;
		body: ReactNode;
		isOpen: boolean;
		onSave: () => void;
		onClose: () => void;
	}) => {
		const renderFooter = () => {
			return (
				<div>
					<Button
						variants={['block', 'black']}
						onClick={onSave}
						label="Bewaar wijzigingen"
					/>

					<Button variants={['block', 'text']} onClick={onClose} label="Annuleer" />
				</div>
			);
		};

		return (
			<Modal isOpen={isOpen} title={title} onClose={onClose} footer={renderFooter()}>
				{body}
			</Modal>
		);
	};

	return <AlertsOverview className="c-alerts-overview" renderPopup={renderPopup} />;
};
