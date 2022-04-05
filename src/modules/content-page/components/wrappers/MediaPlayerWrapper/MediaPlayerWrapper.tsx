import { ButtonAction } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import { get } from 'lodash-es';
import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { Config, ToastType } from 'core/config';
import { ItemsService } from 'modules/item/items.service';
import { FlowPlayerWrapper } from 'modules/shared/components/FlowPlayerWrapper/FlowPlayerWrapper';
import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from 'modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from 'modules/shared/helpers/custom-error';
import { useTranslation } from 'modules/shared/hooks/useTranslation';

interface MediaPlayerWrapperProps {
	item?: ButtonAction;
	src?: string;
	poster?: string;
	title: string;
	external_id?: string;
	duration?: string;
	annotationTitle?: string;
	annotationText?: string;
	issued?: string;
	organisation?: Avo.Organization.Organization;
	width?: string;
	autoplay?: boolean;
}

const MediaPlayerWrapper: FunctionComponent<MediaPlayerWrapperProps> = ({
	item,
	src,
	poster,
	title,
	external_id,
	duration,
	annotationTitle,
	annotationText,
	issued,
	organisation,
	width,
	autoplay,
}) => {
	const { t } = useTranslation();

	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [videoStill, setVideoStill] = useState<string>();
	const [mediaItem, setMediaItem] = useState<Avo.Item.Item | null>(null);

	const retrieveMediaItem = useCallback(async () => {
		try {
			if (item && !src) {
				// !src since the proxy can resolve the src already for users without an account
				// Video from MAM
				const mediaItemTemp = await ItemsService.fetchItemByExternalId(
					item.value.toString()
				);
				setMediaItem(mediaItemTemp);
				setVideoStill(poster || get(mediaItemTemp, 'thumbnail_path'));
			} else {
				// Custom video
				setVideoStill(poster);
			}
		} catch (err) {
			console.error(
				new CustomError('Failed to fetch item info from the database', err, { item })
			);
			Config.getConfig().services.toastService.showToast({
				title: t(
					'modules/admin/content-page/components/wrappers/media-player-wrapper/media-player-wrapper___error'
				),
				description: t(
					'admin/content-block/components/wrappers/media-player-wrapper/media-player-wrapper___het-ophalen-van-het-fragment-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	}, [item, src, poster, t]);

	useEffect(() => {
		retrieveMediaItem();
	}, [retrieveMediaItem]);

	useEffect(() => {
		if (src || mediaItem) {
			setLoadingInfo({
				state: 'loaded',
			});
		}
	}, [src, mediaItem, setLoadingInfo]);

	const renderVideoPlayer = () => {
		return (
			<div
				className={clsx('c-video-player t-player-skin--dark', 'u-center-m')}
				style={{ width }}
			>
				<FlowPlayerWrapper
					item={
						mediaItem
							? ({
									...(mediaItem || {}),
									title: title || get(mediaItem, 'title') || '',
									issued: issued || get(mediaItem, 'issued') || '',
									organisation:
										organisation || get(mediaItem, 'organisation') || '',
							  } as any)
							: undefined
					}
					src={src}
					poster={videoStill}
					external_id={external_id || get(mediaItem, 'external_id')}
					duration={duration || get(mediaItem, 'duration')}
					title={title || get(mediaItem, 'title')}
					organisationName={get(organisation || get(mediaItem, 'organisation'), 'name')}
					organisationLogo={get(
						organisation || get(mediaItem, 'organisation'),
						'logo_url'
					)}
					issuedDate={issued || get(mediaItem, 'issued')}
					autoplay={autoplay}
					annotationTitle={annotationTitle}
					annotationText={annotationText}
				/>
			</div>
		);
	};

	return (
		<LoadingErrorLoadedComponent
			loadingInfo={loadingInfo}
			dataObject={item || src}
			render={renderVideoPlayer}
		/>
	);
};

export default MediaPlayerWrapper;
