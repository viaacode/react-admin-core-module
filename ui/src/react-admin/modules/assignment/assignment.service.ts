import type { Avo } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';

import { AdminConfigManager } from '~core/config';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';

export class AssignmentService {
	/**
	 * Retrieve assignments.
	 *
	 * @param titleOrId the partial title or full id of the assignment
	 * @param limit Numeric value to define the maximum amount of items in response.
	 * @returns Assignments limited by `limit`.
	 */
	static async fetchAssignmentsByTitleOrId(
		titleOrId: string | null,
		limit: number
	): Promise<Avo.Assignment.Assignment[]> {
		return await fetchWithLogoutJson(
			stringifyUrl({
				url: `${AdminConfigManager.getConfig().database.proxyUrl}/admin/assignments/public`,
				query: {
					titleOrId,
					limit,
				},
			}),
			{ throwOnNullResponse: true }
		);
	}
}
