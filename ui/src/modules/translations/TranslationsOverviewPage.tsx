import { Button } from '@viaa/avo2-components';
import { FC, useRef } from 'react';

import { AdminLayout } from '~modules/shared/layouts';
import { TranslationsOverview } from '~modules/translations/views';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

interface TranslationsOverviewRef {
	onSave: () => void;
}

export const TranslationsOverviewPage: FC = () => {
	const { tText } = useTranslation();
	// Access child functions
	const translationsRef = useRef<TranslationsOverviewRef>();

	return (
		// not extracted translation since it isn't part of the exported views of the react-admin package
		<AdminLayout pageTitle={tText('Vertalingen')}>
			<AdminLayout.Actions>
				<Button
					onClick={() => translationsRef.current?.onSave()}
					label={tText('Wijzigingen opslaan')}
				/>
			</AdminLayout.Actions>
			<AdminLayout.Content>
				<TranslationsOverview ref={translationsRef} />
			</AdminLayout.Content>
		</AdminLayout>
	);
};
