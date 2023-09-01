import { InternalServerErrorException } from '@nestjs/common';

export function logAndThrow(err: InternalServerErrorException): never {
	console.error(err);
	throw {
		...err,
		innerException: undefined,
	};
}
