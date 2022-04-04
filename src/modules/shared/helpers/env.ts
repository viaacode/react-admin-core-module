import { get } from 'lodash-es';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

// TODO See how we manage env variables from both applications in the admin core
export function getEnv(name: string): string | undefined {
	return get(publicRuntimeConfig, name) || get(window, `_ENV_[${name}]`) || process.env[name];
}
