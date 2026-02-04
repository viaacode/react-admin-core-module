import { HttpException, HttpStatus } from '@nestjs/common';

export class DuplicateKeyException extends HttpException {
	// biome-ignore lint/suspicious/noExplicitAny: todo
	public data: any;

	// biome-ignore lint/suspicious/noExplicitAny: todo
	constructor(data: any) {
		super(
			HttpException.createBody({ message: 'Duplicate Key Exception', data }),
			HttpStatus.INTERNAL_SERVER_ERROR
		);
		this.data = data;
	}
}
