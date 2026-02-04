import { type InternalServerErrorException } from '@nestjs/common';
import { CustomError } from './error';

export function logAndThrow(err: InternalServerErrorException | CustomError): never {
	console.error(err);
	throw {
		...err,
		innerException: undefined,
	};
}
