import { Avo } from '@viaa/avo2-types';

export class EducationOrganisationService {
	public static async fetchCities(): Promise<string[]> {
		// TODO implement this
		// let url: string | undefined;
		// url = `${publicRuntimeConfig.PROXY_URL}/education-organisations/cities`;

		// 	const response = await fetchWithLogout(url, {
		// 		method: 'GET',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 		credentials: 'include',
		// 	});
		//
		// 	if (response.status < 200 || response.status >= 400) {
		// 		throw new CustomError('Status code invalid', null, { response });
		// 	}
		//
		// 	return await response.json();

		return [];
	}

	public static async fetchEducationOrganisations(
		city: string | null,
		zipCode: string | null
	): Promise<Avo.EducationOrganization.Organization[]> {
		// TODO implement this
		// let url: string | undefined;
		// try {
		// 	url = `${publicRuntimeConfig.PROXY_URL}/education-organisations/organisations?${queryString.stringify({
		// 		city,
		// 		zipCode,
		// 	})}`;
		//
		// 	const response = await fetchWithLogout(url, {
		// 		method: 'GET',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 		credentials: 'include',
		// 	});
		//
		// 	return await response.json();
		// } catch (err) {
		// 	throw new CustomError('Failed to get educational organisations', err, { url });
		// }
		return [];
	}

	public static async fetchEducationOrganisationName(
		organisationId: string,
		unitId?: string
	): Promise<string | null> {
		// TODO implement this
		// let url: string | undefined;
		// try {
		// 	url = `${publicRuntimeConfig.PROXY_URL}/education-organisations/organisation-name?${queryString.stringify({
		// 		organisationId,
		// 		unitId,
		// 	})}`;
		//
		// 	const response = await fetchWithLogout(url, {
		// 		method: 'GET',
		// 		headers: {
		// 			'Content-Type': 'application/json',
		// 		},
		// 		credentials: 'include',
		// 	});
		//
		// 	return get(await response.json(), 'name');
		// } catch (err) {
		// 	throw new CustomError('Failed to get educational organisation name', err, {
		// 		url,
		// 		organisationId,
		// 		unitId,
		// 	});
		// }
		return null;
	}
}
