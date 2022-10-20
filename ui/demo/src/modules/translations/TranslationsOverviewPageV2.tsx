import { FC, ReactNode } from 'react';
import { TranslationsOverviewV2 } from '~modules/translations/views';
import { Button, Modal } from '@meemoo/react-components';

export const TranslationsOverviewPageV2: FC = () => {
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

	return <TranslationsOverviewV2 className="c-translations-overview" renderPopup={renderPopup} />;
};
