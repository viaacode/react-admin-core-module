export interface AssetToken {
	token: string
	owner: string
	scope: string
	expiration: string // Timestamp
	creation: string // Timestamp
	secret: string
}
