import { Button } from '@viaa/avo2-components';
import { FC, useRef } from 'react';
import { CommonUser } from '~modules/user/user.types';

import { AdminLayout } from '~modules/shared/layouts';
import { TranslationsOverview } from '~modules/translations/views';

interface TranslationsOverviewRef {
	onSave: () => void;
}

export const TranslationsOverviewPage: FC<{ user: CommonUser }> = ({ user }) => {
	// Access child functions
	const translationsRef = useRef<TranslationsOverviewRef>();

	return (
		<AdminLayout pageTitle={'Vertalingen'}>
			<AdminLayout.Actions>
				<Button
					onClick={() => translationsRef.current?.onSave()}
					label={'Wijzigingen opslaan'}
				/>
			</AdminLayout.Actions>
			<AdminLayout.Content>
				<TranslationsOverview user={user} ref={translationsRef} />
			</AdminLayout.Content>
		</AdminLayout>
	);
};
