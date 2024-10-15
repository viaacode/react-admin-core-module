import {
	Button,
	ButtonToolbar,
	FormGroup,
	IconName,
	Modal,
	ModalBody,
	ModalFooterRight,
} from '@viaa/avo2-components';
import type { ContentPickerType } from '@viaa/avo2-types';
import clsx from 'clsx';
import { compact, noop, uniq } from 'lodash-es';
import type { FunctionComponent } from 'react';
import React, { useEffect, useState } from 'react';
import { Loader } from '~shared/components/Loader';
import FileUpload from '~shared/components/FileUpload/FileUpload';

import { useGetStillsFromContentItem } from '~shared/components/UploadOrSelectVideoStill/hooks/useGetStillsFromContentItem';
import { PHOTO_TYPES } from '~shared/helpers/files';
import { tText } from '~shared/helpers/translation-functions';

import './UploadOrSelectVideoStill.scss';

export interface UploadOrSelectVideoStillProps {
	label: string | undefined;
	error: string | undefined;
	value: string;
	required: boolean;
	onChange: (selectedMaintainerId: string | null) => void;
	contentItemType:
		| ContentPickerType.ITEM
		| ContentPickerType.COLLECTION
		| ContentPickerType.ASSIGNMENT
		| null; // Limit maintainer options based on the selected item, collection or assignment
	contentItemId: string | null; // Limit maintainer options based on the selected item, collection or assignment
}

export const UploadOrSelectVideoStill: FunctionComponent<UploadOrSelectVideoStillProps> = ({
	label,
	error,
	value,
	onChange,
	required,
	contentItemType,
	contentItemId,
}) => {
	const [originalStillValue] = useState<string | null>(value);
	const [uploadedStill, setUploadedStill] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [selectedStill, setSelectedStill] = useState<string | null>(value);

	const {
		data: stills,
		isFetching,
		refetch,
	} = useGetStillsFromContentItem(contentItemType, contentItemId);

	useEffect(() => {
		if (contentItemId) {
			// Force maintainers to be refetched on content item change
			// Normally this should be handled by the useQuery query key changing, but for some reason it doesn't trigger correctly
			refetch().then(noop);
		}
	}, [refetch, contentItemId]);

	const handleSaveClick = () => {
		onChange(selectedStill);
		setIsModalOpen(false);
	};

	const handleUploadedStillChanged = (newValue: string[] | null) => {
		setSelectedStill(newValue?.[0] || null);
		setUploadedStill(newValue?.[0] || null);
	};

	return (
		<FormGroup
			error={error}
			label={label}
			required={required}
			className="c-upload-or-select-video-still"
		>
			<FileUpload
				assetType="CONTENT_BLOCK_IMAGE"
				ownerId=""
				urls={compact([selectedStill])}
				onChange={(newValue: string[] | null) => onChange(newValue?.[0] || null)}
				onButtonClicked={() => setIsModalOpen(true)}
				onDeleteFile={() => setSelectedStill(null)}
				label={tText(
					'react-admin/modules/shared/components/upload-or-select-video-still/upload-or-select-video-still___upload-of-kies-een-still'
				)}
			/>
			<Modal
				title={tText(
					'react-admin/modules/shared/components/upload-or-select-video-still/upload-or-select-video-still___upload-of-selecteer-een-still-modal-titel'
				)}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				size="large"
				scrollable
				className="c-upload-or-select-video-still__modal"
			>
				<ModalBody>
					<FileUpload
						assetType="CONTENT_BLOCK_IMAGE"
						ownerId=""
						urls={[value]}
						onChange={handleUploadedStillChanged}
						allowMulti={false}
						allowedTypes={PHOTO_TYPES}
						label={tText(
							'react-admin/modules/shared/components/upload-or-select-video-still/upload-or-select-video-still___eigen-still-uploaden'
						)}
						icon={IconName.upload}
					/>
					{uniq(
						compact(
							[
								value,
								uploadedStill,
								originalStillValue,
								selectedStill,
								...(stills || []),
							].sort()
						)
					).map((still) => (
						<div
							className={clsx('c-upload-or-select-video-still__image', {
								['c-upload-or-select-video-still__image--selected']:
									selectedStill === still,
							})}
							style={{ backgroundImage: `url(${still})` }}
							key={still}
							onClick={() => setSelectedStill(still)}
						/>
					))}
					{isFetching && (
						<div className="c-upload-or-select-video-still__spinner">
							<Loader />
						</div>
					)}
				</ModalBody>
				<ModalFooterRight>
					<ButtonToolbar>
						<Button
							label={tText(
								'react-admin/modules/shared/components/upload-or-select-video-still/upload-or-select-video-still___annuleer'
							)}
							type="secondary"
							onClick={() => setIsModalOpen(false)}
						/>
						<Button
							label={tText(
								'react-admin/modules/shared/components/upload-or-select-video-still/upload-or-select-video-still___opslaan'
							)}
							onClick={handleSaveClick}
						/>
					</ButtonToolbar>
				</ModalFooterRight>
			</Modal>
		</FormGroup>
	);
};
