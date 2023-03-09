import {
	Button,
	Flex,
	FlexItem,
	FormGroup,
	IconName,
	LinkTarget,
	TextInput,
} from '@viaa/avo2-components';
import { isNull } from 'lodash-es';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
import ReactSelect, { ActionMeta, SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { ContentPickerType } from './ContentPicker.types';

import { CustomError } from '../../helpers/custom-error';
import { PickerItem, PickerTypeOption } from '../../types/content-picker';
import FileUpload from '../FileUpload/FileUpload';

import {
	DEFAULT_ALLOWED_TYPES,
	GET_CONTENT_TYPES,
	REACT_SELECT_DEFAULT_OPTIONS,
} from './ContentPicker.const';
import { filterTypes, setInitialItem } from './ContentPicker.helpers';
import './ContentPicker.scss';
import { parseSearchQuery } from './helpers/parse-picker';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { useTranslation } from '~shared/hooks/useTranslation';

export interface ContentPickerProps {
	allowedTypes?: ContentPickerType[];
	value: PickerItem | undefined | null;
	onChange: (value: PickerItem | null) => void;
	placeholder?: string;
	hideTypeDropdown?: boolean;
	hideTargetSwitch?: boolean;
	errors?: string | string[];
}

export const ContentPicker: FunctionComponent<ContentPickerProps> = ({
	allowedTypes = DEFAULT_ALLOWED_TYPES,
	value,
	onChange,
	placeholder = AdminConfigManager.getConfig().services.i18n.tText(
		'admin/shared/components/content-picker/content-picker___selecteer-een-item'
	),
	hideTypeDropdown = false,
	hideTargetSwitch = false,
	errors = [],
}) => {
	const { tHtml, tText } = useTranslation();
	const [testInput, setTestInput] = useState<string>('');

	// filter available options for the type picker
	const typeOptions = filterTypes(GET_CONTENT_TYPES(), allowedTypes as ContentPickerType[]);

	// apply initial type from `value`, default to first available type
	const currentTypeObject = typeOptions.find((type) => type.value === value?.type);
	const [selectedType, setSelectedType] = useState<PickerTypeOption>(
		currentTypeObject || typeOptions[0]
	);

	// available options for the item picker.
	const [itemOptions, setItemOptions] = useState<PickerItem[]>([]);

	// selected option, keep track of whether initial item from `initialValue` has been applied
	const [selectedItem, setSelectedItem] = useState<PickerItem | null>(null);
	const [hasAppliedInitialItem, setHasAppliedInitialItem] = useState<boolean>(false);

	const [isTargetSelf, setIsTargetSelf] = useState<boolean>(
		(value?.target || LinkTarget.Self) === LinkTarget.Self
	);

	// inflate item picker
	const fetchPickerOptions = useCallback(
		async (keyword: string | null): Promise<PickerItem[]> => {
			try {
				if (!selectedType || !selectedType.fetch) {
					return []; // Search query and external link don't have a fetch function
				}
				let items: PickerItem[] = await selectedType.fetch(keyword, 20);

				if (!hasAppliedInitialItem && value) {
					items = [
						{
							label: value?.label || '',
							type: value?.type as ContentPickerType,
							value: value?.value || '',
						},
						...items.filter((item: PickerItem) => item.label !== value?.label),
					];
				}

				setItemOptions(items);
				if (keyword && keyword.length && (items[0]?.value || null) === keyword) {
					setSelectedItem(items[0] as any);
				}
				return items;
			} catch (err) {
				console.error(
					new CustomError('[Content Picker] - Failed to inflate.', err, {
						keyword,
						selectedType,
					})
				);
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: AdminConfigManager.getConfig().services.i18n.tText(
						'modules/admin/shared/components/content-picker/content-picker___error'
					),
					description: AdminConfigManager.getConfig().services.i18n.tText(
						'modules/admin/shared/components/content-picker/content-picker___het-ophalen-van-de-opties-is-mislukt'
					),
					type: ToastType.ERROR,
				});
				return [];
			}
		},
		[selectedType, hasAppliedInitialItem, value]
	);

	// when selecting a type, reset `selectedItem` and retrieve new item options
	useEffect(() => {
		fetchPickerOptions(null);
	}, [fetchPickerOptions]);

	// during the first update of `itemOptions`, set the initial value of the item picker
	useEffect(() => {
		if (itemOptions.length && !hasAppliedInitialItem) {
			setSelectedItem(setInitialItem(itemOptions, value || undefined) || null);
			setHasAppliedInitialItem(true);
		}
	}, [itemOptions, hasAppliedInitialItem, value]);

	// events
	const onSelectType = async (selected: SingleValue<PickerTypeOption>) => {
		if (selectedType !== selected) {
			const selectedOption = selected as PickerTypeOption;
			setSelectedType(selectedOption);
			setSelectedItem(null);
			propertyChanged('selectedItem', null);
		}
	};

	const onSelectItem = (
		selectedItem: SingleValue<PickerItem>,
		event?: ActionMeta<PickerItem>
	) => {
		// reset `selectedItem` when clearing item picker
		if (event?.action === 'clear') {
			propertyChanged('selectedItem', null);
			setSelectedItem(null);
			return null;
		}

		const value = selectedItem?.value || null;

		// if value of selected item is `null`, throw error
		if (!value) {
			propertyChanged('value', null);
			setSelectedItem(null);
			console.error(
				new CustomError('[Content Picker] - Selected item has no value.', null, {
					selectedItem,
				})
			);
			AdminConfigManager.getConfig().services.toastService.showToast({
				title: AdminConfigManager.getConfig().services.i18n.tText(
					'modules/admin/shared/components/content-picker/content-picker___error'
				),
				description: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/shared/components/content-picker/content-picker___voor-deze-content-pagina-is-geen-pad-geconfigureerd'
				),
				type: ToastType.ERROR,
			});
			return null;
		}

		propertyChanged('selectedItem', selectedItem);

		// update `selectedItem`
		setSelectedItem(selectedItem);
	};

	const propertyChanged = (
		prop: 'type' | 'selectedItem' | 'value' | 'target' | 'label',
		propValue: ContentPickerType | PickerItem | string | number | null | LinkTarget
	) => {
		let newType: ContentPickerType;
		if (prop === 'type') {
			newType = propValue as ContentPickerType;
		} else {
			newType = selectedType.value;
		}

		let newValue: string | null;
		let newLabel: string | undefined;
		if (prop === 'value') {
			newValue = propValue as string | null;
		} else if (prop === 'selectedItem') {
			newValue = (propValue as PickerItem)?.value || null;
			newLabel = (propValue as PickerItem)?.label;
		} else if (selectedType.picker === 'TEXT_INPUT') {
			newValue = value?.value || '';
		} else if (selectedType.picker === 'SELECT' && selectedItem) {
			newLabel = selectedItem?.label;
			newValue = selectedItem?.value;
		} else {
			newValue = null;
		}
		if (newType === ContentPickerType.SEARCH_QUERY && newValue) {
			newValue = parseSearchQuery(newValue);
		}

		let newTarget: LinkTarget;
		if (prop === 'target') {
			newTarget = propValue as LinkTarget;
		} else if (newType === ContentPickerType.FILE) {
			newTarget = LinkTarget.Blank;
			newLabel = (newValue && newValue.split('/').pop()) || undefined;
		} else {
			newTarget = isTargetSelf ? LinkTarget.Self : LinkTarget.Blank;
		}

		if (isNull(newValue)) {
			onChange(null);
		} else {
			onChange({
				type: newType,
				value: newValue,
				target: newTarget,
				label: newLabel,
			});
		}
	};

	// render controls
	const renderTypePicker = () => {
		if (hideTypeDropdown) {
			return null;
		}
		return (
			<FlexItem shrink>
				<ReactSelect
					{...REACT_SELECT_DEFAULT_OPTIONS}
					id="content-picker-type"
					placeholder={tText(
						'admin/shared/components/content-picker/content-picker___type'
					)}
					aria-label={tText(
						'admin/shared/components/content-picker/content-picker___selecteer-een-type'
					)}
					options={typeOptions}
					onChange={onSelectType}
					value={selectedType}
					isSearchable={false}
					isOptionDisabled={(option: PickerTypeOption) => !!option.disabled}
					noOptionsMessage={() =>
						tHtml('admin/shared/components/content-picker/content-picker___geen-types')
					}
				/>
			</FlexItem>
		);
	};

	const renderItemControl = () => {
		if (!selectedType) {
			return null;
		}

		switch (selectedType.picker) {
			case 'SELECT':
				return (
					<FlexItem>
						<TextInput value={testInput} onChange={(val) => setTestInput(val)} />
						{renderItemPicker()}
					</FlexItem>
				);
			case 'TEXT_INPUT':
				return (
					<FlexItem>
						<TextInput
							value={value?.value || ''}
							onChange={(value: string) => propertyChanged('value', value)}
							placeholder={selectedType.placeholder}
						/>
					</FlexItem>
				);
			case 'FILE_UPLOAD':
				return (
					<FlexItem>
						<TextInput value={testInput} onChange={(val) => setTestInput(val)} />
						{renderFileUploadPicker()}
					</FlexItem>
				);
			default:
				return null;
		}
	};

	const renderItemPicker = () => (
		<AsyncSelect
			{...REACT_SELECT_DEFAULT_OPTIONS}
			id="content-picker-item"
			placeholder={placeholder}
			aria-label={placeholder}
			loadOptions={fetchPickerOptions}
			onChange={onSelectItem}
			onFocus={() => fetchPickerOptions(null)}
			value={selectedItem}
			defaultOptions={itemOptions as any} // TODO: type
			isClearable
			noOptionsMessage={() =>
				tHtml('admin/shared/components/content-picker/content-picker___geen-resultaten')
			}
			loadingMessage={() =>
				tHtml('admin/shared/components/content-picker/content-picker___laden')
			}
		/>
	);

	const renderFileUploadPicker = () => {
		return (
			<FileUpload
				assetType={'CONTENT_BLOCK_FILE' as any}
				ownerId=""
				urls={[value?.value || '']}
				allowMulti={false}
				showDeleteButton
				onChange={(urls: string[]) => {
					propertyChanged('value', urls[0]);
				}}
				allowedTypes={[]}
			/>
		);
	};

	const renderLinkTargetControl = () => {
		if (hideTargetSwitch) {
			return null;
		}

		return (
			<FlexItem shrink>
				<Button
					size="large"
					type={'borderless'}
					icon={
						isTargetSelf
							? ('arrowDownCircle' as IconName)
							: ('externalLink' as IconName)
					}
					title={
						isTargetSelf
							? tText(
									'admin/shared/components/content-picker/content-picker___open-de-link-in-hetzelfde-tablad'
							  )
							: tText(
									'admin/shared/components/content-picker/content-picker___open-de-link-in-een-nieuw-tabblad'
							  )
					}
					onClick={() => {
						setIsTargetSelf(!isTargetSelf);
						propertyChanged(
							'target',
							isTargetSelf ? LinkTarget.Blank : LinkTarget.Self
						);
					}}
					disabled={!(selectedType.picker === 'TEXT_INPUT' ? value?.value : selectedItem)}
				/>
			</FlexItem>
		);
	};

	// render content picker
	return (
		<FormGroup error={errors} className="c-content-picker">
			<Flex spaced="regular">
				{renderTypePicker()}
				{renderItemControl()}
				{renderLinkTargetControl()}
			</Flex>
		</FormGroup>
	);
};
