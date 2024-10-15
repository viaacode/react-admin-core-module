import type { ButtonAction } from '@viaa/avo2-components';
import { Button, Modal, ModalBody } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React, { useCallback, useEffect, useState } from 'react';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { ItemsService } from '~modules/item/items.service';
import { showToast } from '~modules/shared/helpers/show-toast';
import { FlowPlayerWrapper } from '~shared/components/FlowPlayerWrapper/FlowPlayerWrapper';
import type { LoadingInfo } from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { LoadingErrorLoadedComponent } from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { CustomError } from '~shared/helpers/custom-error';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { SourcePage } from '~shared/components/FlowPlayerWrapper/FlowPlayerWrapper.types';

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
	commonUser?: Avo.User.CommonUser;
	showCopyright?: boolean;
	seekable?: boolean;
	ui?: number;
	controls?: boolean;
	speed?: unknown | null;
	onEnded?: () => void;
}

export const BlockVideoWrapper: FunctionComponent<MediaPlayerWrapperProps> = (props) => {
	const {
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
		commonUser,
		showCopyright,
		seekable,
		ui,
		controls,
		speed,
		onEnded,
	} = props;

	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });
	const [videoStill, setVideoStill] = useState<string>();
	const [mediaItem, setMediaItem] = useState<Avo.Item.Item | null>(null);
	const [activeCopyright, setActiveCopyright] = useState<Avo.Organization.Organization | null>(
		null
	);

	const org = organisation || mediaItem?.organisation;

	// Show copy right notice when the block requires it and the user is not logged in, or when they are editing the content page (preview)
	// https://meemoo.atlassian.net/browse/AVO-3015
	const showCopyrightNotice =
		showCopyright &&
		(!commonUser ||
			location.pathname.startsWith(
				AdminConfigManager.getConfig().routes.ADMIN_CONTENT_PAGE_OVERVIEW
			));

	const retrieveMediaItem = useCallback(async () => {
		try {
			if (item && !src) {
				// !src since the proxy can resolve the src already for users without an account
				// Video from MAM
				const mediaItemTemp = await ItemsService.fetchItemById(item.value.toString());
				setMediaItem(mediaItemTemp);
				setVideoStill(poster || mediaItemTemp?.thumbnail_path);
			} else {
				// Custom video
				setVideoStill(poster);
			}
		} catch (err) {
			console.error(
				new CustomError('Failed to fetch item info from the database', err, { item })
			);
			showToast({
				title: tText(
					'modules/admin/content-page/components/wrappers/media-player-wrapper/media-player-wrapper___error'
				),
				description: tText(
					'admin/content-block/components/wrappers/media-player-wrapper/media-player-wrapper___het-ophalen-van-het-fragment-is-mislukt'
				),
				type: ToastType.ERROR,
			});
		}
	}, [item, src, poster]);

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

	const handleCopyrightClicked = (
		evt: React.MouseEvent<HTMLElement, MouseEvent>,
		orgInfo: Avo.Organization.Organization
	) => {
		evt.stopPropagation();
		evt.preventDefault();
		setActiveCopyright(orgInfo);
	};

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
									title: title || mediaItem?.title || '',
									issued: issued || mediaItem?.issued || '',
									organisation: organisation || mediaItem?.organisation || '',
							  } as any)
							: undefined
					}
					src={src}
					poster={videoStill}
					topRight={
						showCopyrightNotice &&
						org && (
							<Button
								type="inline-link"
								onClick={(evt) => handleCopyrightClicked(evt, org)}
								label={tText(
									'react-admin/modules/content-page/components/blocks/block-video/block-video___bron'
								)}
								title={tText(
									'react-admin/modules/content-page/components/blocks/block-video/block-video___bekijk-de-copyright-info-van-deze-afbeelding'
								)}
							/>
						)
					}
					external_id={external_id || mediaItem?.external_id}
					duration={duration || mediaItem?.duration}
					title={title || mediaItem?.title}
					organisationName={org?.name}
					organisationLogo={org?.logo_url}
					issuedDate={issued || mediaItem?.issued}
					autoplay={autoplay}
					annotationTitle={annotationTitle}
					annotationText={annotationText}
					seekable={seekable}
					ui={ui}
					controls={controls}
					speed={speed}
					onEnded={onEnded}
					sourcePage={SourcePage.contentPage}
				/>
				{/* Modal for displaying copyright info about the tile's image https://meemoo.atlassian.net/browse/AVO-3015 */}
				<Modal
					isOpen={!!activeCopyright}
					onClose={() => {
						setActiveCopyright(null);
					}}
					size="small"
					title={tText(
						'admin/content-page/components/blocks/media-grid-wrapper/media-grid-wrapper___copyright-info'
					)}
				>
					<ModalBody>
						{tHtml(
							'admin/content-page/components/blocks/media-grid-wrapper/media-grid-wrapper___deze-afbeelding-valt-onder-copyright-van-organisation-name',
							{
								organisationName: activeCopyright?.name || '',
								organisationWebsite: activeCopyright?.website || '',
							}
						)}
					</ModalBody>
				</Modal>
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
