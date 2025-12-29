import type { SelectOption, TagInfo } from '@viaa/avo2-components';
import { Column, FormGroup, Grid, Select, TagsInput } from '@viaa/avo2-components';
import type { AvoContentPageType } from '@viaa/avo2-types';
import { compact, isString } from 'es-toolkit';
import type { FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';
import type { LabelObj } from '~content-blocks/BlockPageOverview/BlockPageOverview.types';
import { ToastType } from '~core/config/config.types';
import type { ContentPageLabel } from '~modules/content-page/types/content-pages.types';
import { showToast } from '~shared/helpers/show-toast';
import { tText } from '~shared/helpers/translation-functions';
import { useContentTypes } from '../../../content-page/hooks/useContentTypes';
import { ContentPageService } from '../../../content-page/services/content-page.service';
import { CustomError } from '../../helpers/custom-error';

export interface ContentTypeAndLabelsValue {
	selectedContentType: AvoContentPageType;
	selectedLabels: string[] | number[] | null;
}

export interface ContentTypeAndLabelsProps {
	value?: ContentTypeAndLabelsValue;
	onChange: (value: ContentTypeAndLabelsValue) => void;
	errors: string[];
}

export const ContentTypeAndLabelsPicker: FunctionComponent<ContentTypeAndLabelsProps> = ({
	value = {
		selectedContentType: 'FAQ_ITEM',
		selectedLabels: null,
	},
	onChange,
	errors,
}) => {
	const [contentTypes, isLoadingContentTypes] = useContentTypes();
	const [labels, setLabels] = useState<ContentPageLabel[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);
		ContentPageService.fetchLabelsByContentType(value.selectedContentType)
			.then(setLabels)
			// biome-ignore lint/suspicious/noExplicitAny: todo
			.catch((err: any) => {
				console.error(
					new CustomError('Failed to get content labels in ContentTypeAndLabelsPicker', err, {
						selectedContentType: value.selectedContentType,
					})
				);
				showToast({
					title: tText(
						'modules/admin/shared/components/content-type-and-labels-picker/content-type-and-labels-picker___error'
					),
					description: tText(
						'admin/shared/components/content-type-and-labels-picker/content-type-and-labels-picker___het-ophalen-van-de-content-pagina-labels-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => setIsLoading(false));
	}, [value.selectedContentType]);

	const handleContentTypeChanged = (selectedValue: string) => {
		onChange({
			selectedContentType: selectedValue as AvoContentPageType,
			selectedLabels: null,
		});
	};

	const handleLabelsChanged = (newSelectedLabels: TagInfo[]) => {
		const newState = {
			selectedContentType: value?.selectedContentType as AvoContentPageType,
			selectedLabels: (newSelectedLabels || []).map((labelOption) => labelOption.value) as
				| string[]
				| number[],
		};
		onChange(newState);
	};

	const getSelectedLabelObjects = (): SelectOption<number | string>[] => {
		// new format where we save the ids of the labels instead of the full label object
		// https://meemoo.atlassian.net/browse/AVO-1410
		let selectedLabelIds: number[] | string[] = value.selectedLabels || [];
		if (typeof selectedLabelIds[0] !== 'number' && !isString(selectedLabelIds[0])) {
			// Old format where we save the whole label object
			// TODO deprecated remove when all content pages with type overview have been resaved
			selectedLabelIds = ((value.selectedLabels || []) as unknown as LabelObj[]).map(
				(labelObj) => labelObj.id
			);
		}
		return compact(
			selectedLabelIds.map((labelId: number | string): SelectOption<number | string> | null => {
				const labelObj = labels.find((labelObj) => labelObj.id === labelId);
				if (!labelObj) {
					return null;
				}
				return {
					label: labelObj.label,
					value: labelObj.id,
				};
			})
		);
	};

	const renderSelectPicker = () => (
		<Grid>
			<Column size="1">
				<Select
					id="content-type-and-label-picker-type"
					placeholder={tText('admin/content/components/content-picker/content-picker___type')}
					options={contentTypes}
					value={value?.selectedContentType}
					loading={isLoadingContentTypes}
					onChange={handleContentTypeChanged}
				/>
			</Column>
			<Column size="3">
				{/* Force reload tagInput when content type changes */}
				<div key={(value.selectedLabels || []).length}>
					<TagsInput
						options={(labels || []).map(
							(labelObj): SelectOption<number> => ({
								label: labelObj.label,
								value: labelObj.id,
							})
						)}
						allowMulti
						allowCreate={false}
						value={getSelectedLabelObjects()}
						onChange={handleLabelsChanged}
						disabled={!value || !value.selectedContentType}
						isLoading={isLoading}
						placeholder={
							!value || !value.selectedContentType
								? tText(
										'admin/shared/components/content-type-and-labels-picker/content-type-and-labels-picker___kies-eerst-een-content-type'
									)
								: tText(
										'admin/shared/components/content-type-and-labels-picker/content-type-and-labels-picker___labels'
									)
						}
					/>
				</div>
			</Column>
		</Grid>
	);

	return <FormGroup error={errors}>{renderSelectPicker()}</FormGroup>;
};
