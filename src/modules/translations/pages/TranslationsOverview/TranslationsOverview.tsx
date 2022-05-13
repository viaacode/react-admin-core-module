import React, { FC, useState } from 'react';

import Loader from '~modules/shared/components/Loader/Loader';
import { KeyValueEditor } from '~modules/translations/components/KeyValueEditor/KeyValueEditor';
import { KeyValuePair } from '~modules/translations/components/KeyValueEditor/KeyValueEditor.types';
import { useGetTranslations } from '../../hooks';

const TranslationsOverview: FC = () => {
	// const [filter, setFilter] = useState('');
	const [translations, setTranslations] = useState<KeyValuePair[]>([]);

	const { isLoading, data: initialTranslations } = useGetTranslations({
		onSuccess: (data) => {
			setTranslations(Object.entries(data));
		},
	});
	// const { mutate: updateTranslations } = useUpdateTranslations();

	const onChange = (updatedTranslations: KeyValuePair[]) => {
		setTranslations(updatedTranslations);
	};

	// const onFilter = (newFilter: string) => {
	// 	setFilter(newFilter);
	// };
	//
	// const onSave = () => {
	// 	updateTranslations(Object.fromEntries(translations));
	// };

	return (
		<>
			{isLoading && <Loader />}

			{!isLoading && !translations?.length && (
				<div className="u-text-center">
					<h3>Er zijn nog geen vertalingen beschikbaar.</h3>
				</div>
			)}

			{!isLoading && initialTranslations && (
				<KeyValueEditor
					initialData={Object.entries(initialTranslations)}
					data={translations}
					// filter={filter}
					onChange={onChange}
				/>
			)}
		</>
		// Move to client:
		// <AdminLayout pageTitle="Vertalingen">
		// 	<AdminLayout.Actions>
		// 		<Button label="Opslaan" variants="black" onClick={onSave} />
		// 	</AdminLayout.Actions>
		//
		// 	<AdminLayout.FiltersRight>
		// 		<TextInput value={filter} onChange={(e) => onFilter(e.target.value)} />
		// 	</AdminLayout.FiltersRight>
		//
		// 	<AdminLayout.Content>
	);
};

export default TranslationsOverview;
