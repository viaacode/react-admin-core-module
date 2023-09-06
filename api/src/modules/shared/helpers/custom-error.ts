import { InternalServerErrorException } from '@nestjs/common';

export function CustomError(
	message: string,
	innerException?: any,
	additionalInfo?: Record<string, unknown>
) {
	return new InternalServerErrorException({
		message,
		innerException,
		additionalInfo,
	});
}
