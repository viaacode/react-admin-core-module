import { isEqual } from 'lodash-es';
import { useMemo } from 'react';

export const useHasChanges = <T>(initialData: T, data: T, wait = false): boolean => {
	const hasChanges = useMemo(() => {
		if (wait) {
			return false;
		}

		return !isEqual(initialData, data);
	}, [data, initialData, wait]);

	return hasChanges;
};
