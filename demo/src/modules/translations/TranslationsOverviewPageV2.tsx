import { FC, ReactNode } from 'react';
import { TranslationsOverviewV2 } from '~modules/translations/views';
import { Modal } from '@meemoo/react-components';

export const TranslationsOverviewPageV2: FC = () => {
	const renderPopup = ({
		title,
		body,
		confirmButton,
		cancelButton,
		isOpen,
		onClose,
	}: {
		title: string;
		body: ReactNode;
		confirmButton: ReactNode;
		cancelButton: ReactNode;
		isOpen: boolean;
		onClose: () => void;
	}) => {
		const renderFooter = () => {
			return (
				<div className="c-modal__footer">
					{cancelButton}
					{confirmButton}
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
