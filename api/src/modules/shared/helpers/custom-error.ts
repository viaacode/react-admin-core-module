import { InternalServerErrorException } from '@nestjs/common';
import * as util from 'util';

export function CustomError(
	message: string,
	innerException?: any,
	additionalInfo?: Record<string, unknown>
) {
	const error = {
		message,
		innerException,
		additionalInfo,
	};
	const json = util.inspect(error, {
		showHidden: true,
		compact: process.env.SINGLE_LINE_LOGGING !== 'false',
		depth: 10,
	});
	return new InternalServerErrorException(json);
}
