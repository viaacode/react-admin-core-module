import {
	RichTextEditor,
	RichTextEditorControl,
	RichTextEditorProps,
	RichTextEditorUploadInfo,
} from '@meemoo/react-components';
import { Avo } from '@viaa/avo2-types';
import { noop } from 'lodash-es';
import React, { FunctionComponent } from 'react';

import { RICH_TEXT_EDITOR_OPTIONS_DEFAULT } from '../../consts/rich-text-editor.consts';
import { CustomError } from '../../helpers/custom-error';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

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
	const { t } = useTranslation();

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
						const url =
							await AdminConfigManager.getConfig().services.assetService.uploadFile(
								param.file,
								fileType,
								ownerId || ''
							);
						param.success({
							url,
						});
					} catch (err) {
						const error = new CustomError(
							t(
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
						title: AdminConfigManager.getConfig().services.i18n.t(
							'modules/admin/shared/components/wysiwyg-wrapper/wysiwyg-wrapper___error'
						),
						description: AdminConfigManager.getConfig().services.i18n.t(
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
			controls={(controls || RICH_TEXT_EDITOR_OPTIONS_DEFAULT) as RichTextEditorControl[]} // TODO remove this cast once react-components v2.12.16 is released
			media={media as any}
			state={state}
			onChange={onChange || noop}
		/>
	);
};

export default RichTextEditorWrapper;
