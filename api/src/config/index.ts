import { NotImplementedException } from "@nestjs/common";

export * from './config.const';
export * from './config.types';

const getEnvValue = (name: string, required = true): string => {
	const value = process.env[name];
	if (!value && required && process.env.NODE_ENV !== 'test') {
		throw new NotImplementedException(
			`The environment variable ${name} is not set, but is required to run the service.`
		);
	}
	return value;
};

/**
 * Environment variables are loaded differently locally and on IBM cloud
 * dotenv handles the newlines in the certificates/keys differently
 * and are cleaned here
 * @param envVar the variable (value) to clean
 * @returns the cleaned value
 */
export const cleanMultilineEnv = (envVar: string) => {
	if (!envVar) {
		return envVar; // Do not crash on empty env vars
	}
	return getEnvValue('NODE_ENV', false) === 'local' ? envVar.replace(/\\n/g, '\n') : envVar;
};
