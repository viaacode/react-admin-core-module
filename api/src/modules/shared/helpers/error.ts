import { randomUUID as uuid } from 'node:crypto';
import util from 'node:util';

import { omitByDeep } from './omit-by-deep';

export class CustomError {
	public message: string;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	public innerException: any | null;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	public additionalInfo: any | null;
	public identifier: string = uuid();
	public name = 'Error';
	public stack: string;
	public statusCode = 500;
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
		Error.captureStackTrace(this, this.constructor);

		if (innerException && typeof innerException.stack === 'string') {
			this.stack = innerException.stack;
		} else {
			this.stack = new Error().stack || '';
		}
		if (innerException && !(innerException instanceof CustomError)) {
			this.innerException = {
				// biome-ignore lint/suspicious/noExplicitAny: todo
				message: (innerException as any).message,
				// biome-ignore lint/suspicious/noExplicitAny: todo
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
