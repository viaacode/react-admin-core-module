import { FormGroup, Select, type SelectOption } from '@viaa/avo2-components';
import { AvoCoreContentPickerType, AvoFileUploadAssetType } from '@viaa/avo2-types';
import { compact, noop } from 'es-toolkit';
import type { FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';
import FileUpload from '~shared/components/FileUpload/FileUpload';
import { Loading } from '~shared/components/Loading/Loading';

import { useGetStillsFromContentItem } from '~shared/components/UploadOrSelectVideoStill/hooks/useGetStillsFromContentItem';
import { useGetStillsFromIeObject } from '~shared/components/UploadOrSelectVideoStill/hooks/useGetStillsFromIeObject';
import { PHOTO_TYPES } from '~shared/helpers/files';
import { snippetTimeToSeconds } from '~shared/helpers/parsers/duration';
import { tText } from '~shared/helpers/translation-functions';

import './UploadOrSelectVideoStill.scss';

export enum ThumbnailMode {
	AUTO = 'AUTO',
	UPLOAD = 'UPLOAD',
}

export interface UploadOrSelectVideoStillProps {
	label: string | undefined;
	error: string | undefined;
	value: string;
	required: boolean;
	onChange: (selectedMaintainerId: string | null) => void;
	contentItemType:
		| AvoCoreContentPickerType.ITEM
		| AvoCoreContentPickerType.COLLECTION
		| AvoCoreContentPickerType.ASSIGNMENT
		| AvoCoreContentPickerType.IE_OBJECT
		| null; // Limit maintainer options based on the selected item, collection or assignment
	contentItemId: string | null; // Limit maintainer options based on the selected item, collection or assignment
	/**
	 * For IE_OBJECT only: start of the snippet as entered on the block (HH:MM:SS or MM:SS), so the
	 * still can be taken from inside the snippet instead of the start of the object.
	 * https://meemoo.atlassian.net/browse/ARC-3832
	 */
	startTime?: string;
}

export const UploadOrSelectVideoStill: FunctionComponent<UploadOrSelectVideoStillProps> = ({
	label,
	error,
	value,
	onChange,
	required,
	contentItemType,
	contentItemId,
	startTime,
}) => {
	const [mode, setMode] = useState<ThumbnailMode>(value ? ThumbnailMode.UPLOAD : ThumbnailMode.AUTO);
	const [selectedStill, setSelectedStill] = useState<string | null>(value || null);

	// hetarchief ie-objects have their own stills source: the avo endpoint below does not know
	// about them, and the still should come from inside the chosen snippet.
	const isIeObject = contentItemType === AvoCoreContentPickerType.IE_OBJECT;

	const avoStills = useGetStillsFromContentItem(
		isIeObject ? null : contentItemType,
		contentItemId,
		{
			enabled: !isIeObject,
		}
	);
	const ieObjectStills = useGetStillsFromIeObject(
		isIeObject ? contentItemId : null,
		snippetTimeToSeconds(startTime),
		{ enabled: isIeObject }
	);

	const { data: stills, isFetching, refetch } = isIeObject ? ieObjectStills : avoStills;
	// The hook resolves the snippet keyframe (or the object's own thumbnail as fallback) first,
	// so the first entry is what "automatic" ends up picking.
	const automaticStill = stills?.[0] || null;

	useEffect(() => {
		if (contentItemId) {
			// Force maintainers to be refetched on content item change
			// Normally this should be handled by the useQuery query key changing, but for some reason it doesn't trigger correctly
			refetch().then(noop);
		}
	}, [refetch, contentItemId]);

	const handleModeChange = (newMode: string) => {
		setMode(newMode as ThumbnailMode);
		if (newMode === ThumbnailMode.AUTO) {
			setSelectedStill(null);
			onChange(null);
		}
	};

	const handleUploadChange = (newValue: string[] | null) => {
		const uploaded = newValue?.[0] || null;
		setSelectedStill(uploaded);
		onChange(uploaded);
	};

	const modeOptions: SelectOption<ThumbnailMode>[] = [
		{
			label: tText(
				'react-admin/modules/shared/components/upload-or-select-video-still/upload-or-select-video-still___automatisch'
			),
			value: ThumbnailMode.AUTO,
		},
		{
			label: tText(
				'react-admin/modules/shared/components/upload-or-select-video-still/upload-or-select-video-still___upload-een-afbeelding'
			),
			value: ThumbnailMode.UPLOAD,
		},
	];

	return (
		<FormGroup
			error={error}
			label={label}
			required={required}
			className="c-upload-or-select-video-still"
		>
			<Select
				options={modeOptions}
				value={mode}
				onChange={handleModeChange}
				className="c-upload-or-select-video-still__mode-select"
			/>
			{mode === ThumbnailMode.AUTO &&
				(automaticStill ? (
					<div
						className="c-upload-or-select-video-still__image c-upload-or-select-video-still__image--selected"
						style={{ backgroundImage: `url(${automaticStill})` }}
					/>
				) : (
					isFetching && (
						<div className="c-upload-or-select-video-still__spinner">
							<Loading locationId="upload-or-select-video-still--loading" />
						</div>
					)
				))}
			{mode === ThumbnailMode.UPLOAD && (
				<FileUpload
					assetType={AvoFileUploadAssetType.CONTENT_BLOCK_IMAGE}
					ownerId=""
					urls={compact([selectedStill])}
					onChange={handleUploadChange}
					allowMulti={false}
					allowedTypes={PHOTO_TYPES}
					label={tText(
						'react-admin/modules/shared/components/upload-or-select-video-still/upload-or-select-video-still___upload-een-eigen-afbeelding'
					)}
				/>
			)}
		</FormGroup>
	);
};
