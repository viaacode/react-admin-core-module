import type { IconName } from '@viaa/avo2-components';
import { Blankslate, Button, Flex, FlexItem, Icon, Spacer } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { compact, isString } from 'es-toolkit';
import { parse } from 'query-string';
import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import { ToastType } from '~core/config/config.types';
import { showToast } from '~shared/helpers/show-toast';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { AssetsService } from '~shared/services/assets-service/assets.service';
import { CustomError } from '../../helpers/custom-error';
import { getUrlInfo, isPhoto, isVideo, PHOTO_TYPES } from '../../helpers/files';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import { Loader } from '../Loader/Loader';

import './FileUpload.scss';
import { getFileImageDimensions } from '~shared/helpers/get-file-image-dimensions';

export interface FileUploadProps {
	icon?: IconName;
	label?: string;
	allowedTypes?: string[];
	allowMulti?: boolean;
	assetType: Avo.FileUpload.AssetType;
	ownerId: string;
	urls: string[] | null;
	showDeleteButton?: boolean;
	disabled?: boolean;
	onChange: (urls: string[]) => void;
	onDeleteFile?: (url: string) => void;
	imageDimensions?: { width: number; height: number };

	/**
	 * Choose the preview the uploaded file or not
	 * Used in UploadOrSelectVideoStill component
	 */
	showFilePreview?: boolean;
	/**
	 * If you only want to use the visualisation and delete functionality, but not the upload functionality, pass this custom button click handler
	 * Used in UploadOrSelectVideoStill component
	 */
	onButtonClicked?: () => void;
}

const FileUpload: FunctionComponent<FileUploadProps> = ({
	icon,
	label,
	allowedTypes = PHOTO_TYPES,
	allowMulti = true,
	assetType,
	ownerId,
	urls,
	imageDimensions,
	showDeleteButton = true,
	showFilePreview = true,
	disabled = false,
	onChange,
	onDeleteFile,
	onButtonClicked,
}) => {
	const [urlToDelete, setUrlToDelete] = useState<string | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const openDeleteModal = (url: string) => {
		setUrlToDelete(url);
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setUrlToDelete(null);
		setIsDeleteModalOpen(false);
	};

	const uploadSelectedFile = async (files: File[] | null): Promise<boolean> => {
		try {
			if (files?.length) {
				// If allowedTypes array is empty, all filetypes are allowed
				const notAllowedFiles = allowedTypes.length
					? files.filter((file) => !allowedTypes.includes(file.type))
					: [];
				if (notAllowedFiles.length) {
					showToast({
						title: tText('modules/admin/shared/components/file-upload/file-upload___error'),
						description: tText(
							'shared/components/file-upload/file-upload___een-geselecteerde-bestand-is-niet-toegelaten'
						),
						type: ToastType.ERROR,
					});
					setIsProcessing(false);
					return false;
				}

				if (imageDimensions?.width && imageDimensions?.height) {
					// Image must have fixed dimensions
					const dimensions = await Promise.all(files.map((file) => getFileImageDimensions(file)));
					const notAllowedDimensions = dimensions.filter(
						(dim) => dim.width !== imageDimensions.width || dim.height !== imageDimensions.height
					);
					if (notAllowedDimensions.length) {
						showToast({
							title: tText(
								'modules/shared/components/file-upload/file-upload___foutieve-afmetingen'
							),
							description: tText(
								'modules/shared/components/file-upload/file-upload___afbeelding-moet-exact-1920-x-385-pixels-groot-zijn'
							),
							type: ToastType.ERROR,
						});
						setIsProcessing(false);
						return false;
					}
				}

				// Upload all files in series
				setIsProcessing(true);
				const uploadedUrls: string[] = [];
				for (let i = 0; i < (allowMulti ? files.length : 1); i += 1) {
					uploadedUrls.push(await AssetsService.uploadFile(files[i], assetType, ownerId));
				}
				onChange(allowMulti ? [...(urls || []), ...uploadedUrls] : uploadedUrls);
				setIsProcessing(false);
				return true;
			}
		} catch (err) {
			console.error(
				new CustomError('Failed to upload files in FileUpload component', err, {
					files,
				})
			);
			if (files && files.length > 1 && allowMulti) {
				showToast({
					title: tText('modules/admin/shared/components/file-upload/file-upload___error'),
					description: tText(
						'shared/components/file-upload/file-upload___het-uploaden-van-de-bestanden-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			} else {
				showToast({
					title: tText('modules/admin/shared/components/file-upload/file-upload___error'),
					description: tText(
						'shared/components/file-upload/file-upload___het-uploaden-van-het-bestand-is-mislukt'
					),
					type: ToastType.ERROR,
				});
			}
		}
		setIsProcessing(false);
		return false;
	};

	const deleteUploadedFile = async (url: string) => {
		if (!url) {
			closeDeleteModal();
			return;
		}

		try {
			if (assetType === 'ZENDESK_ATTACHMENT') {
				// We don't manage zendesk attachments
				onChange([]);
				return;
			}
			setIsProcessing(true);
			if (urls) {
				const newUrls = [...urls];
				for (let i = newUrls.length - 1; i >= 0; i -= 1) {
					if (newUrls[i] === url) {
						onDeleteFile?.(url);
						newUrls.splice(i, 1);
					}
				}
				onChange(newUrls);
			} else {
				onChange([]);
			}
		} catch (err) {
			console.error(new CustomError('Failed to delete asset', err, { urls }));
			showToast({
				title: tText('modules/admin/shared/components/file-upload/file-upload___error'),
				description: tText(
					'shared/components/file-upload/file-upload___het-verwijderen-van-het-bestand-is-mislukt'
				),
				type: ToastType.ERROR,
			});
			onChange([]);
		}

		setIsProcessing(false);
		closeDeleteModal();
	};

	const renderDeleteButton = (url: string) => {
		if (disabled || !showDeleteButton) {
			return null;
		}
		return (
			<Button
				className="a-delete-button"
				type="danger-hover"
				icon={'trash2' as IconName}
				ariaLabel={tText('shared/components/file-upload/file-upload___verwijder-bestand')}
				title={tText('shared/components/file-upload/file-upload___verwijder-bestand')}
				autoHeight
				disabled={isProcessing}
				onClick={() => openDeleteModal(url)}
			/>
		);
	};

	const renderFilesPreview = () => {
		if (!urls && !showFilePreview) {
			return null;
		}

		return compact(urls || []).map((url) => {
			if (isPhoto(url)) {
				return (
					<Spacer margin="bottom-small" key={url}>
						<div className="a-upload-media-preview" style={{ backgroundImage: `url(${url})` }}>
							{renderDeleteButton(url)}
						</div>
					</Spacer>
				);
			}
			if (isVideo(url)) {
				return (
					<Spacer margin="bottom-small" key={url}>
						<div className="a-upload-media-preview">
							{/** biome-ignore lint/a11y/useMediaCaption: the user uploaded this file, so we don't have a caption track */}
							<video src={url} controls />
							{renderDeleteButton(url)}
						</div>
					</Spacer>
				);
			}
			let fileName: string | undefined;
			if (url.includes('?')) {
				const queryParams = parse(url.split('?').pop() || '');
				if (queryParams?.name && isString(queryParams.name)) {
					fileName = queryParams.name as string;
				}
			}
			if (!fileName && url) {
				const urlInfo = getUrlInfo(url.split('?')[0]);
				fileName = `${urlInfo.fileName.substring(
					0,
					urlInfo.fileName.length - '-00000000-0000-0000-0000-000000000000'.length
				)}.${urlInfo.extension}`;
			}

			return (
				<Spacer margin="bottom-small" key={url}>
					<Blankslate
						title={fileName || ''}
						icon={'file' as IconName}
						className="a-upload-file-preview"
					>
						{renderDeleteButton(url)}
					</Blankslate>
				</Spacer>
			);
		});
	};

	// Render
	return (
		<div className="c-file-upload">
			{renderFilesPreview()}
			{!disabled &&
				(!isProcessing ? (
					<Flex>
						{!!icon && (
							<FlexItem shrink>
								<Icon size="large" name={icon} />
							</FlexItem>
						)}
						<FlexItem className="c-file-upload-button-and-input">
							<Button
								label={
									label ||
									(allowMulti
										? tText('shared/components/file-upload/file-upload___selecteer-bestanden')
										: tText('shared/components/file-upload/file-upload___selecteer-een-bestand'))
								}
								ariaLabel={label}
								type="secondary"
								autoHeight
								onClick={onButtonClicked}
							/>
							{!onButtonClicked && (
								<input
									type="file"
									title={tText('shared/components/file-upload/file-upload___kies-een-bestand')}
									multiple={allowMulti}
									onChange={(evt) => {
										!!evt.target.files &&
											uploadSelectedFile(Array.from(evt.target.files)).then((uploadSucceeded) => {
												if (!uploadSucceeded) {
													evt.target.value = '';
												}
											});
									}}
								/>
							)}
						</FlexItem>
					</Flex>
				) : (
					<Loader fullscreen={false} />
				))}
			<ConfirmModal
				title={tText(
					'shared/components/file-upload/file-upload___ben-je-zeker-dat-je-dit-bestand-wil-verwijderen'
				)}
				body={tHtml(
					'shared/components/file-upload/file-upload___opgelet-deze-actie-kan-niet-ongedaan-gemaakt-worden'
				)}
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				deleteObjectCallback={async () => {
					await deleteUploadedFile(urlToDelete || '');
				}}
			/>
		</div>
	);
};

export default FileUpload;
