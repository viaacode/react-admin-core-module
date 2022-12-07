import {
	Column,
	FormGroup,
	Grid,
	LabelObj,
	Select,
	SelectOption,
	TagInfo,
	TagsInput,
} from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { compact, get, isNumber } from 'lodash-es';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { ContentPageLabel } from '~modules/content-page/types/content-pages.types';

import { useContentTypes } from '../../../content-page/hooks/useContentTypes';
import { ContentPageService } from '../../../content-page/services/content-page.service';
import { CustomError } from '../../helpers/custom-error';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

export interface ContentTypeAndLabelsValue {
	selectedContentType: Avo.ContentPage.Type;
	selectedLabels: number[] | null;
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
	const { tHtml, tText } = useTranslation();

	const [contentTypes, isLoadingContentTypes] = useContentTypes();
	const [labels, setLabels] = useState<ContentPageLabel[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);
		ContentPageService.fetchLabelsByContentType(value.selectedContentType)
			.then(setLabels)
			.catch((err: any) => {
				console.error(
					new CustomError(
						'Failed to get content labels in ContentTypeAndLabelsPicker',
						err,
						{
							selectedContentType: value.selectedContentType,
						}
					)
				);
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: AdminConfigManager.getConfig().services.i18n.tText(
						'modules/admin/shared/components/content-type-and-labels-picker/content-type-and-labels-picker___error'
					),
					description: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/shared/components/content-type-and-labels-picker/content-type-and-labels-picker___het-ophalen-van-de-content-pagina-labels-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			})
			.finally(() => setIsLoading(false));
	}, [value.selectedContentType, setLabels, tHtml]);

	const handleContentTypeChanged = (selectedValue: string) => {
		onChange({
			selectedContentType: selectedValue as Avo.ContentPage.Type,
			selectedLabels: null,
		});
	};

	const handleLabelsChanged = (newSelectedLabels: TagInfo[]) => {
		onChange({
			selectedContentType: get(value, 'selectedContentType') as Avo.ContentPage.Type,
			selectedLabels: (newSelectedLabels || []).map(
				(labelOption) => labelOption.value as number
			),
		});
	};

	const getSelectedLabelObjects = (): SelectOption<number>[] => {
		// new format where we save the ids of the labels instead of the full label object
		// https://meemoo.atlassian.net/browse/AVO-1410
		let selectedLabelIds: number[] = value.selectedLabels || [];
		if (!isNumber(selectedLabelIds[0])) {
			// Old format where we save the whole label object
			// TODO deprecated remove when all content pages with type overview have been resaved
			selectedLabelIds = ((value.selectedLabels || []) as unknown as LabelObj[]).map(
				(labelObj) => labelObj.id
			);
		}
		return compact(
			selectedLabelIds.map((labelId: number): SelectOption<number> | null => {
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
					placeholder={tText(
						'admin/content/components/content-picker/content-picker___type'
					)}
					options={contentTypes}
					value={get(value, 'selectedContentType')}
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
