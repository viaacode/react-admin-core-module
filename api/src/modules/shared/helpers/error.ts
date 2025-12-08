import { randomUUID as uuid } from 'node:crypto';
import util from 'util';

import { omitByDeep } from './omit-by-deep';

export class CustomError {
	public message: string;
	public innerException: any | null;
	public additionalInfo: any | null;
	public identifier: string = uuid();
	public name = 'Error';
	public stack: string;
	public statusCode = 500;
	public timestamp: string = new Date().toISOString();

	constructor(
		message = 'Something went wrong',
		innerException: any = null,
		additionalInfo: any = null
	) {
		this.message = message;
		this.innerException = innerException;
		this.additionalInfo = additionalInfo;
		Error.captureStackTrace(this, this.constructor);

		if (innerException && typeof innerException.stack === 'string') {
			this.stack = innerException.stack;
		} else {
			this.stack = new Error().stack || '';
		}
		if (innerException && !(innerException instanceof CustomError)) {
			this.innerException = {
				message: (innerException as any).message,
				stack: (innerException as any).stack,
			};
		}
	}

	public toString(): string {
		const singleLineLogging = process.env.SINGLE_LINE_LOGGING === 'true';
		return util.inspect(
			omitByDeep(this, (key) => key === 'request'),
			{
				showHidden: false,
				depth: 20,
				colors: !singleLineLogging,
				compact: singleLineLogging,
			}
		);
	}
}
