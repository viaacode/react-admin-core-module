export interface DeleteResponse {
	affectedRows: number
}

export enum SpecialPermissionGroups {
	loggedOutUsers = '-1',
	loggedInUsers = '-2',
}

export interface Recipient {
	id: string
	email: string
}

export interface UpdateResponse {
	affectedRows: number
}
