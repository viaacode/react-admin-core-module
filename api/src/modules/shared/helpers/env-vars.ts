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
	return getEnvValue('NODE_ENV', false) === 'local'
		? envVar.replace(/\\n/g, '\n')
		: envVar;
};

const getEnvValue = (name: string, required = true): string | undefined => {
	const value = process.env[name];
	if (!value && required && process.env.NODE_ENV !== 'test') {
		throw new Error(
			`The environment variable ${name} is not set, but is required to run the service.`,
		);
	}
	return value;
};
