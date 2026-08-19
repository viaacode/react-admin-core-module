import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { isString } from 'es-toolkit/compat';
import { parseUrl } from 'query-string';
import { QUERY_KEYS } from '~shared/types';

export const useGetFileDuration = (playableUrl: string | undefined | null) => {
	return useQuery<number>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECT_PLAYER_DURATION, playableUrl],
		queryFn: () =>
			new Promise((resolve, reject) => {
				if (!playableUrl) {
					return reject(undefined);
				}

				// Url contains t=x,y then the video has been dynamically cut by the media service
				// So we can determine the duration from that instantly
				const parsedUrl = parseUrl(playableUrl);
				if (parsedUrl.query.t && isString(parsedUrl.query.t)) {
					const [start, end] = parsedUrl.query.t.split(',');
					if (/[0-9]+/.test(start) && /[0-9]+/.test(end)) {
						const startTime = Number(start);
						const endTime = Number(end);

						if (startTime < endTime) {
							// Valid time cut format
							return resolve(endTime - startTime);
						}
					}
				}

				// Else, get video duration from file header
				const video = document.createElement('video');
				video.preload = 'metadata';

				video.onloadedmetadata = () => {
					window.URL.revokeObjectURL(video.src);
					return resolve(video.duration);
				};

				video.onerror = () => {
					return reject(undefined);
				};

				video.src = playableUrl;
			}),

		enabled: !!playableUrl,
		placeholderData: keepPreviousData,
		staleTime: 60 * 60 * 1000, // 60 minutes
	});
};
