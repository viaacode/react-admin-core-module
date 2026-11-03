#!/usr/bin/env node
// Runs a command with the env vars from the given 1Password item injected.
// Env vars in the --overrides env file (if it exists) override the ones from 1Password.
// Usage: node ./scripts/load-envs.mjs <1password item name> [--overrides <env file>] <command> [args...]
import { execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseEnv } from 'node:util';


const [opItem, ...rest] = process.argv.slice(2);
let overrideEnvFile;
if (rest[0] === '--overrides') {
	overrideEnvFile = rest[1];
	rest.splice(0, 2);
} else if (rest[0]?.startsWith('--overrides=')) {
	overrideEnvFile = rest.shift().slice('--overrides='.length);
}
const command = rest;
if (!opItem || !command.length || overrideEnvFile === '') {
	console.error('Usage: node ./scripts/load-envs.mjs <1password item name> [--overrides <env file>] <command> [args...]');
	process.exit(1);
}

const localEnv = overrideEnvFile && existsSync(overrideEnvFile) ? parseEnv(readFileSync(overrideEnvFile, 'utf8')) : {};

const item = JSON.parse(execFileSync('op', ['item', 'get', opItem, '--format', 'json'], { encoding: 'utf8' }));

const fields = item.fields.filter((field) => !field.purpose && field.label && !(field.label in localEnv));

// Concealed fields are passed as secret references, so op run resolves and masks them in the output
const envRefs = fields
	.filter((field) => field.type === 'CONCEALED')
	.map((field) => `${field.label}=op://${item.vault.id}/${item.id}/${field.id}`)
	.join('\n');

// Plain text fields are not secret, pass them as is so they are not masked
const plainEnv = Object.fromEntries(
	fields.filter((field) => field.type !== 'CONCEALED').map((field) => [field.label, field.value ?? '']),
);

const tempDir = mkdtempSync(join(tmpdir(), 'load-envs-'));
const envFile = join(tempDir, '.env');
writeFileSync(envFile, envRefs);

const child = spawn('op', ['run', `--env-file=${envFile}`, '--', ...command], {
	stdio: 'inherit',
	// Passed outside the env file, op run would otherwise override them
	env: { ...process.env, ...plainEnv, ...localEnv },
});

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.on(signal, () => child.kill(signal));
}

child.on('exit', (code, signal) => {
	rmSync(tempDir, { recursive: true, force: true });
	if (signal) {
		process.kill(process.pid, signal);
	} else {
		process.exit(code ?? 1);
	}
});
