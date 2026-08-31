import { useQuery } from '@tanstack/react-query';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import { QUERY_KEYS } from '~shared/types';

/**
 * Tickets one of an object's files so it can be played.
 *
 * A ticket is short-lived and access-checked at request time, so it cannot travel with the object
 * and has to be asked for when the file is actually about to be used.
 */
export const useGetPlayableUrl = (
	fileId: string | undefined,
	schemaIdentifier: string | undefined,
	enabled = true
) =>
	useQuery<string | null>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECT_PLAYER_TICKET, schemaIdentifier, fileId],
		queryFn: () => IeObjectsService.getPlayableUrl(fileId as string, schemaIdentifier as string),
		enabled: enabled && !!fileId && !!schemaIdentifier,
		staleTime: 30 * 60 * 1000, // 30 minutes, same as the client's own ticket cache
	});
