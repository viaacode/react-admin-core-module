export interface PlayerTicket {
	jwt: string;
	context: {
		app: string;
		name: string;
		expiration: string;
		aud: string;
		exp: number;
		sub: string;
		ip: string;
		referer: string;
		fragment: {
			start: string;
			end: string;
		};
	};
}

/**
 * @param referer domain of the website that is allowed to play the media
 * @param ip the ip address of the client that is allowed to play the media
 * @param isPublicDomain will generate a ticket that is valid for 15 years for any ip and any referer,
 * @param startTime optional start time to cut a video dynamically out of a longer video
 * @param endTime optional end time to cut a video dynamically out of a longer video
 */
export interface PlayerTokenOptions {
	referer: string;
	ip: string;
	isPublicDomain?: boolean;
	startTime?: number;
	endTime?: number;
}

export interface PlayerTicketServiceOptions {
	app: string;
	client?: string;
	referer?: string;
	maxage?: number;
	fragment?: {
		start: number;
		end: number;
	};
}
