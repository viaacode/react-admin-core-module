import { Avo } from '@viaa/avo2-types';
import { FC } from 'react';

type FlowPlayerWrapperProps = {
	item?: Avo.Item.Item;
	src?: string;
	poster?: string;
	external_id?: string;
	title?: string;
	duration?: string;
	organisationName?: string;
	organisationLogo?: string;
	issuedDate?: string;
	annotationTitle?: string;
	annotationText?: string;
	canPlay?: boolean;
	cuePoints?: {
		start: number | null;
		end: number | null;
	};
	seekTime?: number;
	autoplay?: boolean;
	onPlay?: () => void;
	onEnded?: () => void;
};

export const FlowPlayerWrapper: FC<FlowPlayerWrapperProps> = () => null; // TODO pass this component from the client application
// import { AspectRatioWrapper, FlowPlayer, Icon } from '@viaa/avo2-components';
// import { Avo } from '@viaa/avo2-types';
// import { get, isNil } from 'lodash-es';
// import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';
// import { useTranslation } from '~modules/shared/hooks/useTranslation';
//
// import { useGetMediaTicketInfo } from '@media/hooks/get-media-ticket-url';
//
//
// import { CustomError } from '~modules/shared/helpers/custom-error';
// import { getValidStartAndEnd } from '~modules/shared/helpers/cut-start-and-end';
// import { getEnv } from '~modules/shared/helpers/env';
// import { reorderDate } from '~modules/shared/helpers/formatters/date';
// import { formatDurationHoursMinutesSeconds } from '~modules/shared/helpers/formatters/duration';
// import { getSubtitles } from '~modules/shared/helpers/get-subtitles';
// import { toSeconds } from '~modules/shared/helpers/parsers/duration';
// import { UserProps } from '~modules/shared/types';
//
// import './FlowPlayerWrapper.scss';
//
// type FlowPlayerWrapperProps = {
// 	item?: Avo.Item.Item;
// 	src?: string;
// 	poster?: string;
// 	external_id?: string;
// 	title?: string;
// 	duration?: string;
// 	organisationName?: string;
// 	organisationLogo?: string;
// 	issuedDate?: string;
// 	annotationTitle?: string;
// 	annotationText?: string;
// 	canPlay?: boolean;
// 	cuePoints?: CuePoints;
// 	seekTime?: number;
// 	autoplay?: boolean;
// 	onPlay?: () => void;
// 	onEnded?: () => void;
// };
//
// /**
//  * Handle flowplayer play events for the whole app, so we track play count
//  * @param props
//  * @constructor
//  */
// const FlowPlayerWrapper: FunctionComponent<FlowPlayerWrapperProps & UserProps> = (props) => {
// 	const { tHtml, tText } = useTranslation();
//
// 	const item: Avo.Item.Item | undefined = props.item;
// 	const poster: string | undefined = props.poster || get(item, 'thumbnail_path');
//
// 	const [triggeredForUrl, setTriggeredForUrl] = useState<string | null>(null);
// 	const [clickedThumbnail, setClickedThumbnail] = useState<boolean>(false);
// 	const [src, setSrc] = useState<string | null>(props.src);
// 	const { data: playableUrl } = useGetMediaTicketInfo(item?.external_id || null, {
// 		enabled: clickedThumbnail,
// 	});
//
// 	useEffect(() => {
// 		// reset token when item changes
// 		setSrc(props.src || null);
// 		setClickedThumbnail(false);
// 	}, [item, props.src, setSrc, setClickedThumbnail]);
//
// 	const initFlowPlayer = useCallback(async () => {
// 		try {
// 			if (!item) {
// 				throw new CustomError('Failed to init flowplayer since item is undefined');
// 			}
// 			setSrc(playableUrl || null);
// 		} catch (err) {
// 			console.error(
// 				new CustomError('Failed to initFlowPlayer in FlowPlayerWrapper', err, {
// 					item,
// 				})
// 			);
// 			Config.getConfig().services.toastService.showToast({
// 				title: Config.getConfig().services.i18n.t('modules/admin/shared/components/flow-player-wrapper/flow-player-wrapper___error'),
// 				description: Config.getConfig().services.i18n.t(
// 					'item/components/item-video-description___het-ophalen-van-de-mediaplayer-ticket-is-mislukt'
// 				),
// 			});
// 		}
// 	}, [item, , setSrc, t]);
//
// 	useEffect(() => {
// 		if (props.autoplay && item) {
// 			initFlowPlayer();
// 		}
// 	}, [props.autoplay, item, initFlowPlayer]);
//
// 	const handlePlay = () => {
// 		// trackEvents(
// 		// 	{
// 		// 		object: props.external_id || '',
// 		// 		object_type: 'item',
// 		// 		action: 'play',
// 		// 	},
// 		// 	props.user
// 		// );
//
// 		// Only trigger once per video
// 		if (item && item.uid && triggeredForUrl !== src) {
// 			BookmarksViewsPlaysService.action('play', 'item', item.uid, undefined).catch(
// 				(err: any) => {
// 					console.error(
// 						new CustomError('Failed to track item play event', err, {
// 							itemUuid: item.uid,
// 						})
// 					);
// 				}
// 			);
//
// 			if (props.onPlay) {
// 				props.onPlay();
// 			}
//
// 			setTriggeredForUrl(src || null);
// 		}
//
// 		SmartschoolAnalyticsService.triggerVideoPlayEvent(
// 			props.title || get(item, 'title'),
// 			props.external_id || get(item, 'external_id'),
// 			toSeconds(props.duration || get(item, 'duration'), true) || undefined
// 		);
// 	};
//
// 	const handlePosterClicked = () => {
// 		setClickedThumbnail(true);
//
// 		if (!src) {
// 			initFlowPlayer();
// 		}
// 	};
//
// 	const hasHlsSupport = (): boolean => {
// 		try {
// 			new MediaSource();
//
// 			return true;
// 		} catch (err) {
// 			return false;
// 		}
// 	};
//
// 	const getBrowserSafeUrl = (src: string): string => {
// 		if (hasHlsSupport()) {
// 			return src;
// 		}
//
// 		if (src.includes('flowplayer')) {
// 			return src.replace('/hls/', '/v-').replace('/playlist.m3u8', '_original.mp4');
// 		}
//
// 		if (src.endsWith('.m3u8')) {
// 			ToastService.danger(
// 				t(
// 					'shared/components/flow-player-wrapper/flow-player-wrapper___deze-video-kan-niet-worden-afgespeeld-probeer-een-andere-browser'
// 				)
// 			);
// 		}
//
// 		return src;
// 	};
//
// 	let [start, end]: [number | null, number | null] = getValidStartAndEnd(
// 		props.cuePoints?.start,
// 		props.cuePoints?.end,
// 		toSeconds(item?.duration)
// 	);
//
// 	if (start === 0 && end === toSeconds(item?.duration)) {
// 		start = null;
// 		end = null;
// 	}
//
// 	const trackingId =
// 		window.ga && typeof window.ga.getAll === 'function' && window.ga.getAll()[0]
// 			? window.ga.getAll()[0].get('trackingId')
// 			: undefined;
//
// 	return (
// 		<div className="c-video-player t-player-skin--dark">
// 			{src && (props.autoplay || clickedThumbnail || !item) ? (
// 				<FlowPlayer
// 					src={getBrowserSafeUrl(src)}
// 					seekTime={props.seekTime}
// 					poster={poster}
// 					title={props.title}
// 					metadata={
// 						item
// 							? [
// 									props.issuedDate || reorderDate(item.issued || null, '.'),
// 									props.organisationName || get(item, 'organisation.name', ''),
// 							  ]
// 							: undefined
// 					}
// 					token={getEnv('FLOW_PLAYER_TOKEN')}
// 					dataPlayerId={getEnv('FLOW_PLAYER_ID')}
// 					logo={props.organisationLogo || get(item, 'organisation.logo_url')}
// 					speed={{
// 						options: [0.5, 0.75, 1, 1.25, 1.5],
// 						labels: [
// 							t('shared/components/flow-player-wrapper/flow-player-wrapper___0-5'),
// 							t('shared/components/flow-player-wrapper/flow-player-wrapper___0-75'),
// 							t(
// 								'shared/components/flow-player-wrapper/flow-player-wrapper___normaal'
// 							),
// 							t('shared/components/flow-player-wrapper/flow-player-wrapper___1-25'),
// 							t('shared/components/flow-player-wrapper/flow-player-wrapper___1-5'),
// 						],
// 					}}
// 					start={item ? start : null}
// 					end={item ? end : null}
// 					autoplay={(!!item && !!src) || props.autoplay}
// 					canPlay={props.canPlay}
// 					subtitles={getSubtitles(item)}
// 					onPlay={handlePlay}
// 					onEnded={props.onEnded}
// 					googleAnalyticsId={trackingId}
// 					googleAnalyticsEvents={
// 						[
// 							'video_player_load',
// 							'video_start',
// 							'video_click_play',
// 							'video_25_percent',
// 							'video_50_percent',
// 							'video_75_percent',
// 							'video_complete',
// 						] as any
// 					}
// 					googleAnalyticsTitle={props.title}
// 				/>
// 			) : (
// 				<div className="c-video-player__overlay" onClick={handlePosterClicked}>
// 					<AspectRatioWrapper
// 						className="c-video-player__item c-video-player__thumbnail"
// 						style={{ backgroundImage: `url(${poster})` }}
// 					/>
// 					<div className="c-play-overlay">
// 						<div className="c-play-overlay__inner">
// 							<Icon name="play" className="c-play-overlay__button" />
// 						</div>
// 					</div>
// 					{!isNil(start) &&
// 						!isNil(end) &&
// 						(start !== 0 || end !== toSeconds(item?.duration)) && (
// 							<div className="c-cut-overlay">
// 								<Icon name="scissors" />
// 								{`${formatDurationHoursMinutesSeconds(
// 									start
// 								)} - ${formatDurationHoursMinutesSeconds(end)}`}
// 							</div>
// 						)}
// 				</div>
// 			)}
// 			{(!!props.annotationTitle || !!props.annotationText) && (
// 				<div className="a-block-image__annotation">
// 					{props.annotationTitle && <h3>&#169; {props.annotationTitle}</h3>}
// 					{props.annotationText && (
// 						<p className="a-flowplayer__text">{props.annotationText}</p>
// 					)}
// 				</div>
// 			)}
// 		</div>
// 	);
// };
//
// export default withUser(FlowPlayerWrapper) as FunctionComponent<FlowPlayerWrapperProps>;
