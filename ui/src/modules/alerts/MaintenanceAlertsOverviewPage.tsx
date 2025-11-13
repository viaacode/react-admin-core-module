import { Button, Modal } from '@meemoo/react-components';
import type { FC, ReactNode } from 'react';
import { MaintenanceAlertsOverview } from '~modules/maintenance-alerts/views/MaintenanceAlertsOverview';
import { App } from '~modules/translations/translations.core.types';
import { tText } from '~shared/helpers/translation-functions';

export const MaintenanceAlertsOverviewPage: FC = () => {
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
						label={tText(
							'react-admin/modules/alerts/views/alerts-overview-page___bewaar-wijzigingen',
							{},
							[App.HET_ARCHIEF]
						)}
					/>

					<Button
						variants={['block', 'text']}
						onClick={onClose}
						label={tText('react-admin/modules/alerts/views/alerts-overview-page___annuleer', {}, [
							App.HET_ARCHIEF,
						])}
					/>
				</div>
			);
		};

		return (
			<Modal isOpen={isOpen} title={title} onClose={onClose} footer={renderFooter()}>
				{body}
			</Modal>
		);
	};

	return <MaintenanceAlertsOverview className="c-alerts-overview" renderPopup={renderPopup} />;
};
