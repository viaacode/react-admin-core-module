import captureStackTrace from 'capture-stack-trace';

export class CustomError {
	public message: string;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	public innerException: any | null;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	public additionalInfo: any | null;
	public name = 'Error';
	public stackTrace: string;
	public timestamp: string = new Date().toISOString();

	constructor(
		message = 'Something went wrong',
		// biome-ignore lint/suspicious/noExplicitAny: todo
		innerException: any = null,
		// biome-ignore lint/suspicious/noExplicitAny: todo
		additionalInfo: any = null
	) {
		this.message = message;
		this.innerException = innerException;
		this.additionalInfo = additionalInfo;
		captureStackTrace(this, this.constructor);

		if (innerException && typeof innerException.stack === 'string') {
			this.stackTrace = innerException.stack;
		} else {
			this.stackTrace = new Error().stack || '';
		}
	}

	public toString = (): string => {
		return JSON.stringify(
			this,
			// Avoid huge request object in error json
			(key, value) => (key === 'request' ? '[request]' : value)
		);
	};
}
