import { FormGroup } from '@viaa/avo2-components';
import type { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { noop } from 'es-toolkit';
import type { FunctionComponent } from 'react';
import React, { useEffect } from 'react';
import type { ActionMeta } from 'react-select';
import ReactSelect from 'react-select';

import { useGetMaintainersByContent } from '~shared/components/MaintainerSelect/hooks/useGetMaintainersByContent';

export interface MaintainerSelectProps {
	label: string | undefined;
	error: string | undefined;
	placeholder: string;
	value: string;
	required: boolean;
	onChange: (selectedMaintainerId: string | null) => void;
	contentItemType: AvoCoreContentPickerType | null; // Limit maintainer options based on the selected item, collection or assignment
	contentItemId: string | null; // Limit maintainer options based on the selected item, collection or assignment
	extraSelectOptions: { label: string; value: string }[];
}

export const MaintainerSelect: FunctionComponent<MaintainerSelectProps> = ({
	label,
	error,
	placeholder,
	value,
	onChange,
	required,
	contentItemType,
	contentItemId,
	extraSelectOptions,
}) => {
	const {
		data: maintainers,
		isFetching,
		refetch,
	} = useGetMaintainersByContent(contentItemType, contentItemId as string);
	const maintainerOptions = [
		...(extraSelectOptions || []),
		...(maintainers || []).map((maintainer) => ({
			label: `${maintainer.name}`,
			value: maintainer.id,
		})),
	];

	useEffect(() => {
		if (contentItemId) {
			// Force maintainers to be refetched on content item change
			// Normally this should be handled by the useQuery query key changing, but for some reason it doesn't trigger correctly
			refetch().then(noop);
		}
	}, [refetch, contentItemId]);

	const handleSelectionChanged = (
		newValue: { label: string; value: string },
		actionMeta: ActionMeta<{ label: string; value: string }>
	) => {
		if (actionMeta.action === 'deselect-option') {
			onChange(null);
		} else if (actionMeta.action === 'select-option') {
			onChange(newValue.value);
		} else if (actionMeta.action === 'clear') {
			onChange(null);
		}
	};

	return (
		<FormGroup error={error} label={label} required={required} className="c-maintainer-select">
			<ReactSelect<{ label: string; value: string }, true>
				classNamePrefix="c-select"
				options={maintainerOptions}
				value={maintainerOptions.find((option) => value === option.value) || null}
				isLoading={isFetching}
				isClearable
				placeholder={placeholder}
				// biome-ignore lint/suspicious/noExplicitAny: todo
				onChange={handleSelectionChanged as any}
				noOptionsMessage={() => 'Geen opties'}
				loadingMessage={() => 'Bezig met laden'}
			/>
		</FormGroup>
	);
};
