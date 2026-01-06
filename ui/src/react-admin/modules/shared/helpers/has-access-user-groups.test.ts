import { describe, expect, it } from 'vitest';
import { SpecialUserGroups } from '~shared/types/authentication.types.ts';
import { hasAccessUserGroups } from './has-access-user-groups.ts';

const LOGGED_OUT = SpecialUserGroups.loggedOutUsers;
const LOGGED_IN = SpecialUserGroups.loggedInUsers;
const ALL_CONTENT = SpecialUserGroups.allContent;

describe('hasAccessUserGroups', () => {
	describe('public / empty requirements', () => {
		it('returns true when requiredUserGroupIds is undefined', () => {
			expect(hasAccessUserGroups('1', undefined)).toBe(true);
		});

		it('returns true when requiredUserGroupIds is null', () => {
			expect(hasAccessUserGroups('1', null)).toBe(true);
		});

		it('returns true when requiredUserGroupIds is an empty array', () => {
			expect(hasAccessUserGroups('1', [])).toBe(true);
		});
	});

	describe('allContent (-3)', () => {
		it('throws for anyone when required includes -3', () => {
			expect(() => hasAccessUserGroups('1', [ALL_CONTENT])).toThrow(
				'Required user group cannot contain the "all content" -3 special user group'
			);
			expect(() => hasAccessUserGroups('some-uuid', [ALL_CONTENT])).toThrow(
				'Required user group cannot contain the "all content" -3 special user group'
			);
		});

		it('throws if required includes other groups alongside -3', () => {
			expect(() => hasAccessUserGroups('999', [ALL_CONTENT, '1'])).toThrow(
				'Required user group cannot contain the "all content" -3 special user group'
			);
		});
	});

	describe('loggedInUsers (-2)', () => {
		it('returns true when user is logged in and required includes -2', () => {
			// logged in via having any real group id
			expect(hasAccessUserGroups('1', [LOGGED_IN])).toBe(true);
			expect(hasAccessUserGroups('some-uuid', [LOGGED_IN])).toBe(true);

			// logged in via explicitly having -2 in current
			expect(hasAccessUserGroups(LOGGED_IN, [LOGGED_IN])).toBe(true);
		});

		it('returns true when required includes -2 plus other groups and user is logged in', () => {
			expect(hasAccessUserGroups('1', [LOGGED_IN, '999'])).toBe(true);
			expect(hasAccessUserGroups('some-uuid', [LOGGED_IN, 'other-uuid'])).toBe(true);
		});
	});

	describe('loggedOutUsers (-1)', () => {
		it('returns true when user is logged out and required includes -1', () => {
			// logged out via explicitly having -1 in current (if your system uses this)
			expect(hasAccessUserGroups(LOGGED_OUT, [LOGGED_OUT])).toBe(true);
		});

		it('returns false when user is logged in and required includes -1', () => {
			expect(hasAccessUserGroups('1', [LOGGED_OUT])).toBe(false);
			expect(hasAccessUserGroups('some-uuid', [LOGGED_OUT])).toBe(false);
			expect(hasAccessUserGroups(LOGGED_IN, [LOGGED_OUT])).toBe(false);
		});

		it('returns false when required includes -1 plus other groups and user is logged in but has no intersection', () => {
			expect(hasAccessUserGroups('999', [LOGGED_OUT, '1'])).toBe(false);
			expect(hasAccessUserGroups('another-uuid', [LOGGED_OUT, 'some-uuid'])).toBe(false);
		});
	});

	describe('regular group intersection', () => {
		it('returns true when there is an overlap (Avo numeric string ids)', () => {
			expect(hasAccessUserGroups('2', ['2', '3'])).toBe(true);
		});

		it('returns false when there is no overlap (Avo numeric string ids)', () => {
			expect(hasAccessUserGroups('2', ['3', '4'])).toBe(false);
		});

		it('returns true when there is an overlap (Hetarchief UUID ids)', () => {
			const a = '0d2a7b8e-8d63-4c45-b87e-8f1c9e9b7c4a';
			const b = 'b1e1a8f0-4e6d-4cc6-9b4c-83b9db7dbb0b';
			expect(hasAccessUserGroups(a, [b, a])).toBe(true);
		});
	});

	describe('combined special + regular (typical precedence)', () => {
		it('returns true when required includes a matching regular group even if it also includes -1', () => {
			// user is logged in, so -1 alone would deny, but intersection should allow if your impl is "OR"
			// If your intended logic is different (e.g., -1 means ONLY logged out), remove/adjust this.
			expect(hasAccessUserGroups('2', [LOGGED_OUT, '2'])).toBe(true);
		});

		it('returns true when required includes a matching regular group even if it also includes -2', () => {
			expect(hasAccessUserGroups('2', [LOGGED_IN, '2'])).toBe(true);
		});

		it('returns false when required contains only specials that do not match the user state', () => {
			expect(hasAccessUserGroups('1', [LOGGED_OUT])).toBe(false);
		});
	});

	describe('defensive / weird inputs', () => {
		it('handles duplicates gracefully', () => {
			expect(hasAccessUserGroups('1', ['1', '1'])).toBe(true);
		});

		it('treats unknown special strings as normal ids', () => {
			expect(hasAccessUserGroups('-999', ['-999'])).toBe(true);
			expect(hasAccessUserGroups('-999', ['-998'])).toBe(false);
		});
	});
});
