import type { ButtonAction } from '@viaa/avo2-components';
import { Button, Modal, ModalBody } from '@viaa/avo2-components';
import type { AvoItemItem, AvoOrganizationOrganization, AvoUserCommonUser } from '@viaa/avo2-types';
import clsx from 'clsx';
import React, {
	type FunctionComponent,
	type MouseEvent,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { ItemsService } from '~modules/item/items.service';
import { showToast } from '~modules/shared/helpers/show-toast';
import { FlowPlayerWrapper } from '~shared/components/FlowPlayerWrapper/FlowPlayerWrapper';
import type { LoadingInfo } from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { LoadingErrorLoadedComponent } from '~shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { addStartAndEndTimeToUrl } from '~shared/helpers/add-start-and-end-time-to-url';
import { CustomError } from '~shared/helpers/custom-error';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { useLocation } from '~shared/hooks/useLocation.ts';
import { PlayerTicketService } from '~shared/services/player-ticket-service/player-ticket.service';

interface BlockHetArchiefVideoWrapperProps {
	item?: ButtonAction;
	poster?: string;
	title: string;
	external_id?: string;
	duration?: string;
	annotationTitle?: string;
	annotationText?: string;
	issued?: string;
	organisation?: AvoOrganizationOrganization;
	width?: string;
	autoplay?: boolean;
	commonUser?: AvoUserCommonUser;
	showCopyright?: boolean;
	onEnded?: () => void;
	/** Start time of the fragment to play, in seconds */
	startTime?: string;
	/** End time of the fragment to play, in seconds */
	endTime?: string;
}

export const BlockHetArchiefVideoWrapper: FunctionComponent<BlockHetArchiefVideoWrapperProps> = (
	props
) => {
	const {
		item,
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
		onEnded,
		startTime,
		endTime,
	} = props;

	const location = useLocation();
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({
		state: 'loading',
	});
	const [videoStill, setVideoStill] = useState<string>();
	const [mediaItem, setMediaItem] = useState<AvoItemItem | null>(null);
	const [playableUrl, setPlayableUrl] = useState<string | null>(null);
	const [activeCopyright, setActiveCopyright] = useState<AvoOrganizationOrganization | null>(null);

	const org = organisation || mediaItem?.organisation;

	// Show copy right notice when the block requires it and the user is not logged in, or when they are editing the content page (preview)
	// https://meemoo.atlassian.net/browse/AVO-3015
	const showCopyrightNotice =
		showCopyright &&
		(!commonUser ||
			location?.pathname.startsWith(
				AdminConfigManager.getConfig().routes.ADMIN_CONTENT_PAGE_OVERVIEW
			));

	const retrieveMediaItem = useCallback(async () => {
		try {
			if (item) {
				const mediaItemTemp = await ItemsService.fetchItemById(item.value.toString());
				setMediaItem(mediaItemTemp);
				setVideoStill(poster || mediaItemTemp?.thumbnail_path);
			}
		} catch (err) {
			console.error(
				new CustomError('Failed to fetch item info from the database', err, {
					item,
				})
			);
			showToast({
				title: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___error'
				),
				description: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___het-ophalen-van-het-fragment-is-mislukt'
				),
				type: ToastType.ERROR,
			});
			setLoadingInfo({ state: 'error' });
		}
	}, [item, poster]);

	useEffect(() => {
		retrieveMediaItem();
	}, [retrieveMediaItem]);

	const retrievePlayableUrl = useCallback(async () => {
		const itemExternalId = external_id || mediaItem?.external_id;

		if (!itemExternalId) {
			return;
		}

		try {
			const url = await PlayerTicketService.getPlayableUrl(itemExternalId, startTime, endTime);
			// Do not rely on flowplayer cuepoints, since those only restrict the seekbar, but do not
			// prevent the rest of the video from loading/playing. Adding the start and end time as a
			// media fragment (t=start,end) on the url itself, ensures only that part is played.
			setPlayableUrl(addStartAndEndTimeToUrl(url, startTime, endTime));
		} catch (err) {
			console.error(
				new CustomError('Failed to fetch the playable url for the item', err, {
					itemExternalId,
					startTime,
					endTime,
				})
			);
			showToast({
				title: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___error'
				),
				description: tText(
					'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___het-ophalen-van-het-fragment-is-mislukt'
				),
				type: ToastType.ERROR,
			});
			setLoadingInfo({ state: 'error' });
		}
	}, [external_id, mediaItem?.external_id, startTime, endTime]);

	useEffect(() => {
		retrievePlayableUrl();
	}, [retrievePlayableUrl]);

	useEffect(() => {
		if (playableUrl && (item ? mediaItem : true)) {
			setLoadingInfo({
				state: 'loaded',
			});
		}
	}, [playableUrl, item, mediaItem]);

	const handleCopyrightClicked = (
		evt: React.MouseEvent<HTMLElement>,
		orgInfo: AvoOrganizationOrganization
	) => {
		evt.stopPropagation();
		evt.preventDefault();
		setActiveCopyright(orgInfo);
	};

	const renderVideoPlayer = () => {
		return (
			<div className={clsx('c-video-player t-player-skin--dark', 'u-center-m')} style={{ width }}>
				<FlowPlayerWrapper
					item={
						mediaItem
							? ({
									...(mediaItem || {}),
									title: title || mediaItem?.title || '',
									issued: issued || mediaItem?.issued || '',
									organisation: organisation || mediaItem?.organisation || '',
								} as AvoItemItem)
							: undefined
					}
					src={playableUrl || undefined}
					poster={videoStill}
					topRight={
						showCopyrightNotice &&
						org && (
							<Button
								type="inline-link"
								onClick={(evt) => handleCopyrightClicked(evt as MouseEvent<HTMLElement>, org)}
								label={tText(
									'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___bron'
								)}
								title={tText(
									'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___bekijk-de-copyright-info-van-deze-afbeelding'
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
					onEnded={onEnded}
					trackPlayEvent={true}
				/>
				{/* Modal for displaying copyright info about the tile's image https://meemoo.atlassian.net/browse/AVO-3015 */}
				<Modal
					isOpen={!!activeCopyright}
					onClose={() => {
						setActiveCopyright(null);
					}}
					size="small"
					title={tText(
						'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___copyright-info'
					)}
				>
					<ModalBody>
						{tHtml(
							'react-admin/modules/content-page/components/blocks/block-het-archief-video/block-het-archief-video___deze-afbeelding-valt-onder-copyright-van-organisation-name',
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
			dataObject={playableUrl}
			render={renderVideoPlayer}
			locationId="block-het-archief-video-wrapper"
		/>
	);
};
