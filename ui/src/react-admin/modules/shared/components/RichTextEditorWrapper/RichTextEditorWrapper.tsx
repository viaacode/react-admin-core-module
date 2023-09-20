import {
	RichTextEditor,
	type RichTextEditorProps,
	type RichTextEditorUploadInfo,
} from '@meemoo/react-components';
import type { Avo } from '@viaa/avo2-types';
import { noop } from 'lodash-es';
import React, { type FunctionComponent } from 'react';
import { AssetsService } from '~shared/services/assets-service/assets.service';

import { RICH_TEXT_EDITOR_OPTIONS_DEFAULT } from '../../consts/rich-text-editor.consts';
import { CustomError } from '../../helpers/custom-error';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { useTranslation } from '~shared/hooks/useTranslation';

import './RichTextEditorWrapper.scss';

export type RichTextEditorWrapperProps = RichTextEditorProps & {
	fileType?: Avo.FileUpload.AssetType; // Required to enable file upload
	ownerId?: string;
};

/**
 * Handle RichTextEditor default controls and upload function
 * @param props
 * @constructor
 */
const RichTextEditorWrapper: FunctionComponent<RichTextEditorWrapperProps> = (props) => {
	const { tText } = useTranslation();

	const { controls, fileType, ownerId, state, onChange, ...rest } = props;

	if ((controls || []).includes('media') && !fileType) {
		console.error(
			new CustomError(
				'Trying to initialize RichTextEditorWrapper component with media without fileType',
				null,
				props
			)
		);
	}

	const media = fileType
		? {
				uploadFn: async (param: RichTextEditorUploadInfo) => {
					try {
						const url = await AssetsService.uploadFile(
							param.file,
							fileType,
							ownerId || ''
						);
						param.success({
							url,
						});
					} catch (err) {
						const error = new CustomError(
							tText(
								'shared/components/wysiwyg-wrapper/wysiwyg-wrapper___het-opladen-van-de-afbeelding-is-mislukt'
							),
							err,
							{ param }
						);
						console.error(error);
						param.error(error);
					}
				},
				validateFn: (file: File) => {
					if (file.size < 1024 * 1000 * 10) {
						// MAX_FILE_SIZE: 10MB
						return true;
					}

					AdminConfigManager.getConfig().services.toastService.showToast({
						title: tText(
							'modules/admin/shared/components/wysiwyg-wrapper/wysiwyg-wrapper___error'
						),
						description: tText(
							'shared/components/wysiwyg-wrapper/wysiwyg-wrapper___dit-bestand-is-te-groot-max-10-mb'
						),
						type: ToastType.ERROR,
					});
					return false;
				},
		  }
		: undefined;

	return (
		<RichTextEditor
			{...rest}
			controls={controls || RICH_TEXT_EDITOR_OPTIONS_DEFAULT}
			media={media as any}
			state={state}
			onChange={onChange || noop}
		/>
	);
};

export default RichTextEditorWrapper;
