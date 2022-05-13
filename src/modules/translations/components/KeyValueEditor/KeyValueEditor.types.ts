import { SortingRule } from 'react-table';

import { DefaultComponentProps } from '../../../shared/types';

export interface KeyValueEditorProps extends DefaultComponentProps {
	className?: string;
	/**
	 * Contains the key value pairs while the user is modifying them, updated on every key stroke
	 */
	data: KeyValuePair[];
	filter?: string;
	/**
	 * Contains the key value pairs when the page is loaded, and are only updated on save.
	 * This extra prop is needed so we can keep fields visible that were searched for, while the user is modifying them
	 */
	initialData: KeyValuePair[];
	keyLabel?: string;
	keySeparator?: string;
	noDataForFilterMessage?: string;
	noDataMessage?: string;
	readonly?: boolean;
	valueLabel?: string;
	onChange?: (modifiedData: KeyValuePair[]) => void;
	onSort?: (rules: SortingRule<KeyValuePair>[]) => void;
}

export type KeyValuePair = [string, string];
