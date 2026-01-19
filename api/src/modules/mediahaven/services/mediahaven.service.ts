import { Injectable } from '@nestjs/common';
import { addSeconds } from 'date-fns';
import { CustomError } from '../../shared/helpers/error';
import { MamAccessToken, MEDIAHAVEN_TOKEN_EXPIRE_MARGIN } from '../mediahaven.types';

@Injectable()
export class MediahavenService {
	private static accessTokenByEndpoint: Record<string, MamAccessToken> = {};

	public async getAccessToken(credentials: {
		tokenEndpoint: string;
		username: string;
		password: string;
		clientId: string;
		clientSecret: string;
	}): Promise<MamAccessToken> {
		try {
			const existingToken = MediahavenService.accessTokenByEndpoint[credentials.tokenEndpoint];
			const isTokenStillValid =
				existingToken &&
				addSeconds(
					existingToken.createdAt,
					existingToken.token?.expires_in - MEDIAHAVEN_TOKEN_EXPIRE_MARGIN
				) > new Date();
			if (isTokenStillValid) {
				return existingToken;
			}

			// Fetch a new token
			const url = credentials.tokenEndpoint;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Accept: 'application/json',
				},
				body: new URLSearchParams({
					username: credentials.username,
					password: credentials.password,
					client_id: credentials.clientId,
					client_secret: credentials.clientSecret,
				}).toString(),
			});
			if (response.status < 200 || response.status >= 400) {
				throw new CustomError(
					'Error received when fetching an access token for the mediahaven jobs api',
					response?.statusText,
					{
						status: response.status,
						statusText: response.statusText,
						responseBody: response.body,
					}
				);
			}
			const token = (await response.json()) as MamAccessToken['token'];
			const newToken: MamAccessToken = {
				token,
				createdAt: new Date(),
			};
			MediahavenService.accessTokenByEndpoint[credentials.tokenEndpoint] = newToken;
			return newToken;
		} catch (error) {
			throw new CustomError('Failed to get Mediahaven access token', error, {
				tokenEndpoint: credentials.tokenEndpoint,
			});
		}
	}
}
