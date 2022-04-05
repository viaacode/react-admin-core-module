import {
	WYSIWYG,
	WYSIWYGMedia,
	WYSIWYGProps,
	WYSIWYGUploadInfo,
} from '@viaa/avo2-components/dist/esm/wysiwyg';
import { Avo } from '@viaa/avo2-types';
import { isEqual } from 'lodash-es';
import React, { FunctionComponent } from 'react';

import { useTranslation } from '~modules/shared/hooks/useTranslation';

import { Config, ToastType } from '../../../../core/config';
import { WYSIWYG_OPTIONS_DEFAULT } from '../../consts/wysiwyg';
import { CustomError } from '../../helpers/custom-error';
import { FileUploadService } from '../../services/file-upload-service';

import './WYSIWYGWrapper.scss';

export type WYSIWYGWrapperProps = WYSIWYGProps & {
	fileType?: Avo.FileUpload.AssetType; // Required to enable file upload
	ownerId?: string;
};

/**
 * Handle WYSIWYG default controls and upload function
 * @param props
 * @constructor
 */
const WYSIWYGWrapper: FunctionComponent<WYSIWYGWrapperProps> = (props) => {
	const { t } = useTranslation();

	const { controls, fileType, ownerId, state, onChange, ...rest } = props;

	if ((controls || []).includes('media') && !fileType) {
		console.error(
			new CustomError(
				'Trying to initialize WYSIWYGWrapper component with media without fileType',
				null,
				props
			)
		);
	}

	const media: WYSIWYGMedia | undefined = fileType
		? {
				uploadFn: async (param: WYSIWYGUploadInfo) => {
					try {
						const url = await FileUploadService.uploadFile(
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

					Config.getConfig().services.toastService.showToast({
						title: Config.getConfig().services.i18n.t(
							'modules/admin/shared/components/wysiwyg-wrapper/wysiwyg-wrapper___error'
						),
						description: Config.getConfig().services.i18n.t(
							'shared/components/wysiwyg-wrapper/wysiwyg-wrapper___dit-bestand-is-te-groot-max-10-mb'
						),
						type: ToastType.ERROR,
					});
					return false;
				},
		  }
		: undefined;

	return (
		<WYSIWYG
			{...rest}
			controls={controls || WYSIWYG_OPTIONS_DEFAULT}
			media={media}
			state={state}
			onChange={(newState) => {
				if (!!onChange && !isEqual(newState, state)) {
					onChange(newState);
				}
			}}
		/>
	);
};

export default WYSIWYGWrapper;
