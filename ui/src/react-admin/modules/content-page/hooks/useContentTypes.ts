import type { SelectOption } from '@viaa/avo2-components';
import type { AvoContentPageType } from '@viaa/avo2-types';
import { useEffect, useState } from 'react';
import { ContentPageService } from '../services/content-page.service';

type UseContentTypesTuple = [SelectOption<AvoContentPageType>[], boolean];

export const useContentTypes = (): UseContentTypesTuple => {
	const [contentTypeOptions, setContentTypeOptions] = useState<SelectOption<AvoContentPageType>[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		ContentPageService.getContentTypes()
			.then((types) => {
				if (types) {
					setContentTypeOptions(types);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	return [contentTypeOptions, isLoading];
};
