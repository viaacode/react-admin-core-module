// biome-ignore-all lint/suspicious/noExplicitAny: todo
// biome-ignore-all lint/correctness/noUnusedFunctionParameters: todo

import { type LoggerService } from '@nestjs/common';

export class TestingLogger implements LoggerService {
	/**
	 * Write a 'log' level log.
	 */
	log(message: any, ...optionalParams: any[]) {
		// Nothing to do here
	}

	/**
	 * Write an 'error' level log.
	 */
	error(message: any, ...optionalParams: any[]) {
		// Nothing to do here
	}

	/**
	 * Write a 'warn' level log.
	 */
	warn(message: any, ...optionalParams: any[]) {
		// Nothing to do here
	}

	/**
	 * Write a 'debug' level log.
	 */
	debug?(message: any, ...optionalParams: any[]) {
		// Nothing to do here
	}

	/**
	 * Write a 'verbose' level log.
	 */
	verbose?(message: any, ...optionalParams: any[]) {
		// Nothing to do here
	}
}
